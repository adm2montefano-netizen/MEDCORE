
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Filter, 
  StickyNote, 
  X, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  MoreVertical,
  Palette
} from 'lucide-react';
import { Note } from '../types';

const INITIAL_NOTES: Note[] = [
  { id: 'n-1', title: 'Ligar para Dr. André', content: 'Confirmar participação na cirurgia de amanhã às 08h.', priority: 'HIGH', createdAt: '2024-05-24T10:00:00' },
  { id: 'n-2', title: 'Reposição de Insumos', content: 'Verificar estoque de gazes e anestésicos locais.', priority: 'MEDIUM', createdAt: '2024-05-24T11:30:00' },
  { id: 'n-3', title: 'Atualizar Prontuário Ana', content: 'Anexar laudo da ressonância magnética recebido hoje.', priority: 'LOW', createdAt: '2024-05-23T15:00:00' },
  { id: 'n-4', title: 'Congresso Dermatologia', content: 'Inscrições abertas até o final do mês. Conferir passagens.', priority: 'INFO', createdAt: '2024-05-22T09:00:00' },
];

const PRIORITY_CONFIG = {
  HIGH: { color: 'rose', label: 'Alta Prioridade', icon: AlertCircle },
  MEDIUM: { color: 'amber', label: 'Médio Prazo', icon: Clock },
  LOW: { color: 'emerald', label: 'Baixa Prioridade', icon: CheckCircle2 },
  INFO: { color: 'blue', label: 'Informação', icon: StickyNote },
};

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Note>>({
    title: '',
    content: '',
    priority: 'INFO'
  });

  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || n.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }, [notes, searchTerm, filterPriority]);

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setFormData(note);
    } else {
      setEditingNote(null);
      setFormData({ title: '', content: '', priority: 'INFO' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? { ...n, ...formData } as Note : n));
    } else {
      const newNote: Note = {
        id: `n-${Date.now()}`,
        title: formData.title!,
        content: formData.content!,
        priority: (formData.priority as any) || 'INFO',
        createdAt: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir esta anotação permanentemente?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-outfit font-bold text-petrol-dark tracking-tight">Anotações & Lembretes</h2>
          <p className="text-slate-500 font-medium">Organize suas tarefas e pensamentos rápidos por prioridade.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-petrol-vibrant text-white rounded-2xl text-sm font-bold hover:bg-petrol-dark transition-all shadow-xl shadow-petrol-vibrant/20 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Criar Nota
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-petrol-vibrant transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Buscar nas anotações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all shadow-sm"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          {['all', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filterPriority === p 
                  ? 'bg-white text-petrol-dark shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {p === 'all' ? 'Todas' : PRIORITY_CONFIG[p as keyof typeof PRIORITY_CONFIG].label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNotes.map((note) => {
          const config = PRIORITY_CONFIG[note.priority];
          const Icon = config.icon;
          return (
            <div 
              key={note.id} 
              className={`glass p-6 rounded-[2.5rem] border-t-8 border-${config.color}-500 bg-white/60 hover:shadow-2xl transition-all group flex flex-col justify-between min-h-[240px] relative`}
            >
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(note)}
                  className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-petrol-vibrant transition-all shadow-sm"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(note.id)}
                  className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-rose-500 transition-all shadow-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-2 rounded-lg bg-${config.color}-500/10 text-${config.color}-500`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest text-${config.color}-600`}>
                    {config.label}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold font-outfit text-petrol-dark mb-2 leading-tight group-hover:text-petrol-vibrant transition-colors">
                  {note.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {note.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">
                  {new Date(note.createdAt).toLocaleDateString('pt-BR')} às {new Date(note.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className={`w-2 h-2 rounded-full bg-${config.color}-500 animate-pulse`}></div>
              </div>
            </div>
          );
        })}

        {/* Empty State / Add Card */}
        <button 
          onClick={() => handleOpenModal()}
          className="rounded-[2.5rem] border-4 border-dashed border-slate-200 hover:border-petrol-vibrant/30 hover:bg-petrol-vibrant/5 transition-all flex flex-col items-center justify-center p-12 gap-4 group min-h-[240px]"
        >
          <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-petrol-vibrant/10 group-hover:text-petrol-vibrant transition-all">
             <Plus size={32} />
          </div>
          <div className="text-center">
             <p className="text-sm font-bold text-slate-500">Nova Anotação</p>
             <p className="text-[10px] text-slate-400 uppercase font-black mt-1">Lembrete rápido</p>
          </div>
        </button>
      </div>

      {/* Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-petrol-dark/80 backdrop-blur-md" onClick={handleCloseModal}></div>
          <div className="glass w-full max-w-lg rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-200/50 flex justify-between items-center bg-white/50">
               <div>
                  <h3 className="text-2xl font-bold font-outfit text-petrol-dark">
                    {editingNote ? 'Editar Anotação' : 'Criar Nova Nota'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Capture suas ideias rapidamente.</p>
               </div>
               <button onClick={handleCloseModal} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                  <X size={24} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Título</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Reunião com equipe"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Conteúdo</label>
                  <textarea 
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Escreva sua anotação aqui..."
                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-petrol-dark focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 transition-all font-medium h-32 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Prioridade & Cor</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({...formData, priority: p})}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                          formData.priority === p 
                            ? `bg-${PRIORITY_CONFIG[p].color}-500 text-white border-transparent shadow-lg` 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${formData.priority === p ? 'bg-white/20' : `bg-${PRIORITY_CONFIG[p].color}-500/10`}`}>
                          {React.createElement(PRIORITY_CONFIG[p].icon, { size: 14 })}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{PRIORITY_CONFIG[p].label.split(' ')[0]}</span>
                      </button>
                    ))}
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
                  <CheckCircle2 size={18} /> {editingNote ? 'Salvar Alterações' : 'Criar Anotação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
