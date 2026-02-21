
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  BookOpen, 
  Activity, 
  ShieldAlert, 
  Stethoscope, 
  X, 
  ChevronRight, 
  Tag,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Settings,
  Filter
} from 'lucide-react';
import { GlossaryItem, GlossaryCategory } from '../types';

const INITIAL_GLOSSARY: GlossaryItem[] = [
  { id: 'g1', term: 'Protocolo de Manchester - Vermelho', definition: 'Atendimento imediato. Risco de morte iminente. Exemplos: Parada cardiorrespiratória, politraumatismo grave.', category: 'PROTOCOL', manchesterColor: 'RED', tags: ['Emergência', 'Triagem'] },
  { id: 'g2', term: 'Protocolo de Manchester - Laranja', definition: 'Atendimento muito urgente. Tempo de espera: até 10 minutos. Exemplos: Dor precordial intensa, arritmias agudas.', category: 'PROTOCOL', manchesterColor: 'ORANGE', tags: ['Muito Urgente', 'Triagem'] },
  { id: 'g3', term: 'Protocolo de Manchester - Amarelo', definition: 'Atendimento urgente. Tempo de espera: até 60 minutos. Exemplos: Vômitos persistentes, dor moderada.', category: 'PROTOCOL', manchesterColor: 'YELLOW', tags: ['Urgente', 'Triagem'] },
  { id: 'g4', term: 'Hemograma Completo', definition: 'Exame de sangue que avalia as células que compõem o sangue: glóbulos vermelhos, brancos e plaquetas.', category: 'EXAM', priority: 'LOW', tags: ['Laboratorial', 'Rotina'] },
  { id: 'g5', term: 'Eletrocardiograma (ECG)', definition: 'Avaliação da atividade elétrica do coração através de eletrodos fixados na pele.', category: 'EXAM', priority: 'MEDIUM', tags: ['Cardiologia', 'Diagnóstico'] },
  { id: 'g6', term: 'Hipertensão Arterial Sistêmica', definition: 'Doença crônica caracterizada pelos níveis elevados da pressão sanguínea nas artérias.', category: 'PATHOLOGY', priority: 'HIGH', tags: ['Crônica', 'Cardiovascular'] },
  { id: 'g7', term: 'Biópsia Incisional', definition: 'Procedimento cirúrgico para remoção de uma pequena parte de uma lesão para análise.', category: 'PROCEDURE', priority: 'MEDIUM', tags: ['Cirúrgico', 'Dermatologia'] },
];

const MANCHESTER_COLORS = {
  RED: { bg: 'bg-rose-600', text: 'text-white', label: 'Emergência (Imediato)' },
  ORANGE: { bg: 'bg-orange-500', text: 'text-white', label: 'Muito Urgente (10 min)' },
  YELLOW: { bg: 'bg-yellow-400', text: 'text-petrol-dark', label: 'Urgente (60 min)' },
  GREEN: { bg: 'bg-emerald-500', text: 'text-white', label: 'Pouco Urgente (120 min)' },
  BLUE: { bg: 'bg-blue-500', text: 'text-white', label: 'Não Urgente (240 min)' },
};

const CATEGORY_ICONS = {
  EXAM: Stethoscope,
  PROCEDURE: Settings,
  PATHOLOGY: Activity,
  PROTOCOL: ShieldAlert,
};

const GlossaryPage: React.FC = () => {
  const [items, setItems] = useState<GlossaryItem[]>(INITIAL_GLOSSARY);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<GlossaryItem>>({
    term: '',
    definition: '',
    category: 'EXAM',
    tags: [],
    priority: 'LOW'
  });

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, activeCategory]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ term: '', definition: '', category: 'EXAM', tags: [], priority: 'LOW' });
  };

  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term || !formData.definition) return;
    
    const newItem: GlossaryItem = {
      id: `g-${Date.now()}`,
      term: formData.term!,
      definition: formData.definition!,
      category: formData.category as GlossaryCategory,
      priority: formData.priority as any,
      tags: formData.tags || [],
    };
    
    setItems([newItem, ...items]);
    handleCloseModal();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-outfit font-bold text-petrol-dark tracking-tight">Glossário & Protocolos</h2>
          <p className="text-slate-500 font-medium">Enciclopédia interna de patologias, exames e guias de triagem.</p>
        </div>
        
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-6 py-3 bg-petrol-vibrant text-white rounded-2xl text-sm font-bold hover:bg-petrol-dark transition-all shadow-xl shadow-petrol-vibrant/20"
        >
          <Plus size={20} /> Cadastrar Termo
        </button>
      </header>

      {/* Quick Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 p-4 rounded-[2rem] border border-white/60">
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto w-full md:w-auto">
          {['ALL', 'PROTOCOL', 'PATHOLOGY', 'EXAM', 'PROCEDURE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-white text-petrol-dark shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {cat === 'ALL' ? 'Todos' : 
               cat === 'PROTOCOL' ? 'Protocolos' :
               cat === 'PATHOLOGY' ? 'Patologias' :
               cat === 'EXAM' ? 'Exames' : 'Procedimentos'}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-petrol-vibrant transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Buscar termo, CID ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Glossary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const Icon = CATEGORY_ICONS[item.category];
          const manchester = item.manchesterColor ? MANCHESTER_COLORS[item.manchesterColor] : null;
          
          return (
            <div 
              key={item.id} 
              className={`glass p-8 rounded-[3rem] border border-white/60 bg-white/60 hover:shadow-2xl transition-all group flex flex-col justify-between min-h-[300px] overflow-hidden relative`}
            >
              {manchester && (
                <div className={`absolute top-0 right-0 left-0 h-2 ${manchester.bg}`}></div>
              )}
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl bg-slate-100 text-petrol-vibrant`}>
                    <Icon size={24} />
                  </div>
                  {item.priority && (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                      item.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' :
                      item.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      Prioridade {item.priority}
                    </span>
                  )}
                  {manchester && (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${manchester.bg} ${manchester.text}`}>
                      {manchester.label}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold font-outfit text-petrol-dark mb-3 group-hover:text-petrol-vibrant transition-colors">
                  {item.term}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6 line-clamp-4">
                  {item.definition}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 uppercase tracking-tighter">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-petrol-dark/80 backdrop-blur-md" onClick={handleCloseModal}></div>
          <div className="glass w-full max-w-xl rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-200/50 flex justify-between items-center bg-white/50">
               <div>
                  <h3 className="text-2xl font-bold font-outfit text-petrol-dark">Novo Termo Médico</h3>
                  <p className="text-sm text-slate-500 mt-1">Padronize os conhecimentos da sua clínica.</p>
               </div>
               <button onClick={handleCloseModal} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                  <X size={24} />
               </button>
            </div>

            <form onSubmit={handleAddTerm} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Termo / Nome</label>
                  <input 
                    type="text" 
                    required
                    value={formData.term}
                    onChange={(e) => setFormData({...formData, term: e.target.value})}
                    placeholder="Ex: Ultrassonografia de Abdômen Total"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Categoria</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-medium appearance-none"
                    >
                      <option value="EXAM">Exame</option>
                      <option value="PROCEDIMENTO">Procedimento</option>
                      <option value="PATHOLOGY">Patologia</option>
                      <option value="PROTOCOL">Protocolo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Importância</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-medium appearance-none"
                    >
                      <option value="LOW">Informativa</option>
                      <option value="MEDIUM">Intermediária</option>
                      <option value="HIGH">Alta Incidência / Grave</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Definição / Protocolo</label>
                  <textarea 
                    required
                    value={formData.definition}
                    onChange={(e) => setFormData({...formData, definition: e.target.value})}
                    placeholder="Descreva o termo, procedimentos envolvidos ou critérios de diagnóstico..."
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-medium h-32 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Tags (separadas por vírgula)</label>
                  <div className="relative">
                    <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                      placeholder="Ex: Cardiovascular, Triagem, Urgente"
                      className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-[11px]"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 bg-petrol-vibrant text-white rounded-2xl font-bold hover:bg-petrol-dark transition-all shadow-xl shadow-petrol-vibrant/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
                >
                  <CheckCircle2 size={18} /> Adicionar ao Glossário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlossaryPage;
