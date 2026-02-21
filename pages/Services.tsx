
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  X, 
  Briefcase,
  Clock,
  DollarSign,
  Tag,
  AlertCircle,
  Stethoscope,
  Activity,
  Syringe,
  Layers,
  Package
} from 'lucide-react';
import { MOCK_SERVICES } from '../constants';
import { ClinicalService } from '../types';

const Services: React.FC = () => {
  const [services, setServices] = useState<ClinicalService[]>(MOCK_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ClinicalService | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ClinicalService>>({
    name: '',
    category: 'CONSULTA',
    price: 0,
    duration: 30,
    status: 'ACTIVE'
  });

  const filteredServices = useMemo(() => {
    return services.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...formData } as ClinicalService : s));
    } else {
      const newService: ClinicalService = {
        id: `s-${Date.now()}`,
        name: formData.name!,
        category: formData.category as any,
        price: Number(formData.price),
        duration: Number(formData.duration),
        status: 'ACTIVE'
      };
      setServices([newService, ...services]);
    }

    closeModal();
  };

  const openModal = (service?: ClinicalService) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({ name: '', category: 'CONSULTA', price: 0, duration: 30, status: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente excluir este serviço?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  // Helper to get icon and color based on category
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'CONSULTA':
        return { icon: Stethoscope, color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-600' };
      case 'EXAME':
        return { icon: Activity, color: 'emerald', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600' };
      case 'PROCEDIMENTO':
        return { icon: Syringe, color: 'indigo', bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' };
      default:
        return { icon: Package, color: 'slate', bgColor: 'bg-slate-100', textColor: 'text-slate-600' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-outfit font-bold text-petrol-dark tracking-tight">Catálogo de Serviços</h2>
          <p className="text-slate-500">Cadastre consultas, exames e procedimentos com seus respectivos valores.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-petrol-vibrant text-white rounded-2xl text-sm font-bold hover:bg-petrol-dark transition-all shadow-lg shadow-petrol-vibrant/20"
        >
          <Plus size={20} /> Novo Serviço
        </button>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/60 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-petrol-vibrant/10 text-petrol-vibrant flex items-center justify-center">
            <Tag size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Serviços</p>
            <h3 className="text-2xl font-bold text-petrol-dark font-outfit">{services.length}</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/60 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Ticket Médio</p>
            <h3 className="text-2xl font-bold text-petrol-dark font-outfit">
              R$ {(services.reduce((acc, s) => acc + s.price, 0) / services.length || 0).toFixed(2)}
            </h3>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/60 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Serviços Ativos</p>
            <h3 className="text-2xl font-bold text-petrol-dark font-outfit">
              {services.filter(s => s.status === 'ACTIVE').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-petrol-vibrant transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Buscar por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} /> Filtros
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const config = getCategoryConfig(service.category);
          const Icon = config.icon;
          
          return (
            <div key={service.id} className="glass p-8 rounded-[2.5rem] border border-white/60 bg-white/60 hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(service)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-petrol-vibrant transition-all shadow-sm"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-rose-500 transition-all shadow-sm"><Trash2 size={16} /></button>
               </div>

               <div>
                  <div className="flex items-center gap-3 mb-4">
                     <div className={`p-3 rounded-2xl ${config.bgColor} ${config.textColor} shadow-inner`}>
                        <Icon size={24} />
                     </div>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${config.textColor}/70`}>{service.category}</span>
                  </div>
                  
                  <h4 className="text-xl font-bold font-outfit text-petrol-dark mb-2 leading-tight group-hover:text-petrol-vibrant transition-colors">{service.name}</h4>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 italic mb-6">
                     {service.description || 'Nenhuma descrição detalhada fornecida para este serviço clínico.'}
                  </p>
               </div>

               <div className="flex items-end justify-between border-t border-slate-100 pt-6">
                  <div>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Duração Est.</p>
                     <div className="flex items-center gap-1.5 text-sm font-bold text-petrol-dark">
                        <Clock size={14} className="text-petrol-vibrant" /> {service.duration} min
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Valor</p>
                     <div className="text-2xl font-bold text-petrol-dark font-outfit">
                        <span className="text-xs mr-0.5">R$</span> {service.price.toFixed(2)}
                     </div>
                  </div>
               </div>

               {service.status === 'INACTIVE' && (
                 <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Inativo</span>
                 </div>
               )}
            </div>
          );
        })}

        {/* Add Service Placeholder */}
        <button 
          onClick={() => openModal()}
          className="rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-petrol-vibrant/30 hover:bg-petrol-vibrant/5 transition-all flex flex-col items-center justify-center p-12 gap-4 group min-h-[300px]"
        >
          <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-petrol-vibrant/10 group-hover:text-petrol-vibrant transition-all">
             <Plus size={32} />
          </div>
          <div className="text-center">
             <p className="text-sm font-bold text-slate-500">Novo Serviço</p>
             <p className="text-[10px] text-slate-400 uppercase font-black mt-1">Clique para cadastrar</p>
          </div>
        </button>
      </div>

      {/* Modal: Cadastro de Serviço */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-petrol-dark/80 backdrop-blur-md" onClick={closeModal}></div>
          <div className="glass w-full max-w-xl rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-200/50 flex justify-between items-center bg-white/50">
               <div>
                  <h3 className="text-2xl font-bold font-outfit text-petrol-dark">{editingService ? 'Editar Serviço' : 'Cadastrar Serviço'}</h3>
                  <p className="text-sm text-slate-500 mt-1">Defina os detalhes operacionais e financeiros.</p>
               </div>
               <button onClick={closeModal} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                  <X size={24} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="space-y-5">
                  <div className="space-y-2">
                     <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nome do Serviço</label>
                     <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Ex: Consulta Dermatológica Premium"
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-medium"
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
                           <option value="CONSULTA">Consulta</option>
                           <option value="EXAME">Exame</option>
                           <option value="PROCEDIMENTO">Procedimento</option>
                           <option value="OUTRO">Outro</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Status</label>
                        <select 
                           value={formData.status}
                           onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                           className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-medium appearance-none"
                        >
                           <option value="ACTIVE">Ativo</option>
                           <option value="INACTIVE">Inativo</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Valor (R$)</label>
                        <div className="relative">
                           <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                           <input 
                              type="number" 
                              required
                              value={formData.price}
                              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                              placeholder="0.00"
                              step="0.01"
                              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-bold"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Duração (Minutos)</label>
                        <div className="relative">
                           <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                           <input 
                              type="number" 
                              required
                              value={formData.duration}
                              onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                              placeholder="30"
                              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-bold"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Descrição Breve</label>
                     <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Ex: Avaliação completa com análise de exames e conduta terapêutica..."
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-medium resize-none h-24"
                     />
                  </div>
               </div>

               <div className="pt-6 flex gap-4">
                  <button 
                     type="button" 
                     onClick={closeModal}
                     className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-[11px]"
                  >
                     Cancelar
                  </button>
                  <button 
                     type="submit" 
                     className="flex-[2] py-4 bg-petrol-vibrant text-white rounded-2xl font-bold hover:bg-petrol-dark transition-all shadow-xl shadow-petrol-vibrant/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
                  >
                     <CheckCircle2 size={18} /> {editingService ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
