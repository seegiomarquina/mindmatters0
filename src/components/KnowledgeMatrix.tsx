import React, { useState } from 'react';
import {
  Compass,
  TrendingUp,
  Gauge,
  Layers,
  Clock,
  Activity,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { GRAPHOLOGY_KNOWLEDGE_BASE, KnowledgeEntry } from '../data/knowledge';

export const KnowledgeMatrix: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Slant Physics',
    'Zone Geometry',
    'Pressure & Haptics',
    'Baseline Trajectory',
    'Keystroke Micro-Dynamics',
  ];

  const filteredEntries = GRAPHOLOGY_KNOWLEDGE_BASE.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.psychologicalVector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scientificPrinciple.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Slant Physics':
        return <Compass className="w-4 h-4 text-[#00D1FF]" />;
      case 'Baseline Trajectory':
        return <TrendingUp className="w-4 h-4 text-[#00FF9D]" />;
      case 'Pressure & Haptics':
        return <Gauge className="w-4 h-4 text-[#FFB800]" />;
      case 'Zone Geometry':
        return <Layers className="w-4 h-4 text-[#00D1FF]" />;
      case 'Keystroke Micro-Dynamics':
        return <Activity className="w-4 h-4 text-[#00FF9D]" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/25">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">Grapho-Behavioral Knowledge Matrix</h2>
              <p className="text-xs text-slate-400">
                Scientific repository of micro-biometric indicators, Freudian zonal geometries, and motor rewiring principles.
              </p>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stroke indicators..."
            className="w-full bg-[#0A0A0B] border border-[#1F1F24] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-[#00D1FF] transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#00D1FF] text-black shadow-md'
                : 'bg-[#0F0F11] text-slate-400 border border-[#1F1F24] hover:text-white hover:bg-[#141418]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEntries.map((item) => (
          <div
            key={item.id}
            className="bg-[#0F0F11] border border-[#1F1F24] rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-4 hover:border-[#00D1FF]/40 transition-colors"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(item.category)}
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {item.category}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-[#00D1FF] font-medium">{item.subheading}</p>

              <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] text-xs text-slate-300 leading-relaxed mt-2">
                <strong className="text-white">Scientific Mechanism: </strong>
                {item.scientificPrinciple}
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0B] border border-[#1F1F24] text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Psychological Translation: </strong>
                {item.psychologicalVector}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F1F24] flex flex-col gap-2">
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF9D] shrink-0 mt-0.5" />
                <span className="text-[#00FF9D]">
                  <strong>Optimal: </strong>
                  {item.optimalMarker}
                </span>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF2E63] shrink-0 mt-0.5" />
                <span className="text-[#FF2E63]">
                  <strong>Pathology Risk: </strong>
                  {item.pathologyMarker}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/25 text-xs text-[#FFB800] flex items-start gap-2 mt-1">
                <Zap className="w-3.5 h-3.5 text-[#FFB800] shrink-0 mt-0.5" />
                <div>
                  <strong>Remediation Action: </strong>
                  {item.remediationAction}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
