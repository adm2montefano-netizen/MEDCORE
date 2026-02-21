
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, User, StickyNote, Briefcase, ChevronRight, X, Command } from 'lucide-react';
import { MOCK_PATIENTS, MOCK_SERVICES } from '../constants';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setIsSearching(true);
      // Simulando processamento/indexação
      const timer = setTimeout(() => {
        setIsSearching(false);
        setShowResults(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setShowResults(false);
      setIsSearching(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = {
    patients: MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(debouncedQuery.toLowerCase())),
    services: MOCK_SERVICES.filter(s => s.name.toLowerCase().includes(debouncedQuery.toLowerCase())),
    // Mocking some notes result context
    notes: [
      { id: '1', title: 'Reunião ADM' },
      { id: '2', title: 'Checkup Dr. André' }
    ].filter(n => n.title.toLowerCase().includes(debouncedQuery.toLowerCase()))
  };

  const hasResults = results.patients.length > 0 || results.services.length > 0 || results.notes.length > 0;

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <div className={`relative flex items-center transition-all duration-300 ${showResults ? 'z-50' : ''}`}>
        <div className="absolute left-5 text-slate-400">
          {isSearching ? <Loader2 size={18} className="animate-spin text-petrol-vibrant" /> : <Search size={18} />}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setShowResults(true)}
          placeholder="Busque pacientes, notas, serviços ou comandos... (CMD+K)"
          className={`w-full bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-[1.5rem] pl-14 pr-12 py-4 text-sm font-medium text-petrol-dark focus:outline-none focus:ring-4 focus:ring-petrol-vibrant/10 focus:bg-white focus:border-petrol-vibrant/30 transition-all shadow-sm ${showResults ? 'shadow-2xl' : ''}`}
        />

        {query && (
          <button 
            onClick={() => {setQuery(''); setShowResults(false);}}
            className="absolute right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(46,68,107,0.25)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-h-[480px] overflow-y-auto p-4 custom-scrollbar">
            {!hasResults ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Command size={32} />
                </div>
                <p className="text-sm font-bold text-slate-500">Nenhum resultado para "{debouncedQuery}"</p>
                <p className="text-[10px] text-slate-400 uppercase font-black mt-1">Tente termos mais genéricos</p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.patients.length > 0 && (
                  <div>
                    <h4 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <User size={12} /> Pacientes
                    </h4>
                    <div className="space-y-1">
                      {results.patients.map(p => (
                        <button key={p.id} className="w-full flex items-center justify-between p-4 hover:bg-petrol-vibrant/5 rounded-2xl transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-petrol-dark font-bold text-xs group-hover:bg-petrol-vibrant group-hover:text-white transition-all">
                              {p.name.charAt(0)}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-petrol-dark">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">CPF: {p.cpf}</p>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-petrol-vibrant transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.notes.length > 0 && (
                  <div>
                    <h4 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <StickyNote size={12} /> Anotações
                    </h4>
                    <div className="space-y-1">
                      {results.notes.map(n => (
                        <button key={n.id} className="w-full flex items-center justify-between p-4 hover:bg-amber-500/5 rounded-2xl transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                              <StickyNote size={18} />
                            </div>
                            <p className="text-sm font-bold text-petrol-dark">{n.title}</p>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-amber-500 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.services.length > 0 && (
                  <div>
                    <h4 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Briefcase size={12} /> Serviços
                    </h4>
                    <div className="space-y-1">
                      {results.services.map(s => (
                        <button key={s.id} className="w-full flex items-center justify-between p-4 hover:bg-emerald-500/5 rounded-2xl transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                              R$
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-petrol-dark">{s.name}</p>
                              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Ativo</p>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navegação Inteligente MedCore</span>
            <div className="flex items-center gap-3">
               <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500"><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[8px]">↑↓</kbd> Navegar</span>
               <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500"><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[8px]">Enter</kbd> Selecionar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
