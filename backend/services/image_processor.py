import os
import uuid
import cv2
import numpy as np
from typing import Tuple, Dict, Any, List
from fastapi import UploadFile, HTTPException, status
from core.config import settings

def validate_and_save_upload(file: UploadFile, sample_type: str = "handwriting") -> Tuple[str, str, int, str]:
    """
    Validates uploaded file MIME type, size limit, and saves safely to disk with UUID filename.
    Returns: (stored_filename, file_path, file_size, mime_type)
    """
    # 1. MIME Validation
    content_type = file.content_type or "application/octet-stream"
    if content_type not in settings.ALLOWED_IMAGE_MIMES and not content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{content_type}'. Allowed types: JPEG, PNG, WebP, TIFF, BMP."
        )

    # 2. Read bytes & check size limit
    file_bytes = file.file.read()
    file_size = len(file_bytes)
    
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes)."
        )
        
    if file_size > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum allowed limit of {settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB."
        )

    # 3. Generate safe filename
    original_ext = os.path.splitext(file.filename or "")[1].lower()
    if not original_ext or original_ext not in [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".bmp"]:
        original_ext = ".png"
        
    stored_filename = f"{sample_type}_{uuid.uuid4().hex}{original_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, stored_filename)

    # 4. Save to disk
    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    # Reset cursor for any other readers
    file.file.seek(0)
    
    return stored_filename, file_path, file_size, content_type

def validate_image_matrix(img: np.ndarray) -> np.ndarray:
    """
    Validates decoded image array:
    1. Checks minimum dimensions (width >= 50, height >= 50).
    2. Validates contrast dynamic range.
    3. Rejects blank/uniform canvases (standard deviation check).
    4. Rejects images with negligible or saturated foreground ink.
    """
    if img is None or img.size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to decode image. Corrupted or invalid image data."
        )

    h, w = img.shape[:2]
    if h < 50 or w < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Image dimensions ({w}x{h}) too small for morphological extraction. Minimum dimensions: 50x50 pixels."
        )

    # Convert to grayscale for metric evaluations
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img

    # Dynamic range test
    dynamic_range = int(np.max(gray)) - int(np.min(gray))
    if dynamic_range < 15:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image has insufficient contrast or dynamic range (near-uniform canvas)."
        )

    # Intensity variance test (detects solid white/black/gray blocks)
    std_dev = float(np.std(gray))
    if std_dev < 3.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blank or featureless image detected (insufficient pixel variance)."
        )

    # Otsu foreground ink presence test
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    ink_ratio = float(np.sum(thresh > 0)) / float(thresh.size)
    if ink_ratio < 0.0005:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blank or non-informative image detected. Minimum foreground ink density (0.05%) not met."
        )
    if ink_ratio > 0.995:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Overexposed or completely saturated image detected. Maximum ink threshold exceeded."
        )

    return img

def decode_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    """Safe server-side OpenCV image decoding."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return validate_image_matrix(img)

def decode_image_from_path(file_path: str) -> np.ndarray:
    """Load image from disk file path and validate."""
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image file not found at {file_path}"
        )
    img = cv2.imread(file_path, cv2.IMREAD_COLOR)
    return validate_image_matrix(img)

class PreprocessedImageData:
    def __init__(
        self,
        original_bgr: np.ndarray,
        gray: np.ndarray,
        denoised: np.ndarray,
        enhanced: np.ndarray,
        binary_thresh: np.ndarray,
        deskew_angle: float,
        num_components: int,
        labels: np.ndarray,
        stats: np.ndarray,
        centroids: np.ndarray,
        contours: List[np.ndarray],
        laplacian_blur_var: float
    ):
        self.original_bgr = original_bgr
        self.gray = gray
        self.denoised = denoised
        self.enhanced = enhanced
        self.binary_thresh = binary_thresh # 255 for ink, 0 for background
        self.deskew_angle = deskew_angle
        self.num_components = num_components
        self.labels = labels
        self.stats = stats
        self.centroids = centroids
        self.contours = contours
        self.laplacian_blur_var = laplacian_blur_var

def preprocess_handwriting_pipeline(img: np.ndarray) -> PreprocessedImageData:
    """
    Real Handwriting Preprocessing Pipeline:
    Grayscale -> Blur check -> Denoising -> Contrast Normalization (CLAHE) ->
    Thresholding (Otsu + Adaptive) -> Deskew -> Connected Components & Contours.
    """
    img = validate_image_matrix(img)

    # 1. Grayscale Conversion
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()

    # 2. Blur / Sharpness check via Laplacian Variance
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    # 3. Denoising (Gaussian Filter)
    denoised = cv2.GaussianBlur(gray, (5, 5), 0)

    # 4. Contrast Normalization via CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(denoised)

    # 5. Thresholding (Otsu's Inverted Binary Thresholding)
    _, thresh = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # 6. Deskewing via minAreaRect of active ink pixels
    coords = np.column_stack(np.where(thresh > 0))
    deskew_angle = 0.0
    if len(coords) > 50:
        rect = cv2.minAreaRect(coords)
        angle = rect[-1]
        if angle < -45:
            angle = -(90 + angle)
        elif angle > 45:
            angle = 90 - angle
        else:
            angle = -angle
            
        # Rotate if reasonable tilt detected (0.5 to 30 degrees)
        if 0.5 < abs(angle) < 30.0:
            deskew_angle = float(angle)
            h, w = gray.shape[:2]
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, deskew_angle, 1.0)
            gray = cv2.warpAffine(gray, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
            enhanced = cv2.warpAffine(enhanced, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
            thresh = cv2.warpAffine(thresh, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=0)

    # 7. Connected Components Analysis
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(thresh, connectivity=8)

    # 8. Contour Analysis
    contours, _ = cv2.findContours(thresh, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

    return PreprocessedImageData(
        original_bgr=img,
        gray=gray,
        denoised=denoised,
        enhanced=enhanced,
        binary_thresh=thresh,
        deskew_angle=deskew_angle,
        num_components=num_labels - 1, # omit background label 0
        labels=labels,
        stats=stats,
        centroids=centroids,
        contours=contours,
        laplacian_blur_var=laplacian_var
    )
