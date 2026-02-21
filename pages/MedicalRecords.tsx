
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Clock, 
  ChevronRight, 
  Filter, 
  Calendar, 
  User, 
  ArrowUpRight,
  Download,
  MoreVertical,
  History,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';

const mockEvolutions = [
  {
    id: 'ev-1',
    patientName: 'Ana Silva',
    date: '24/05/2024',
    time: '14:30',
    type: 'Consulta de Retorno',
    summary: 'Paciente apresenta melhora significativa nas lesões cutâneas após início do tratamento com corticóide tópico. Sem queixas de prurido.',
    author: 'Dr. Roberto Almeida'
  },
  {
    id: 'ev-2',
    patientName: 'João Pereira',
    date: '23/05/2024',
    time: '09:15',
    type: 'Primeira Consulta',
    summary: 'Relato de dor precordial atípica aos esforços. Solicitado ECG e Teste Ergométrico. Prescrito AAS profilático.',
    author: 'Dr. Roberto Almeida'
  },
  {
    id: 'ev-3',
    patientName: 'Maria Souza',
    date: '22/05/2024',
    time: '11:00',
    type: 'Teleconsulta',
    summary: 'Acompanhamento de quadro ansioso. Paciente refere melhora no padrão do sono. Mantida dosagem de ISRS.',
    author: 'Dra. Helena Costa'
  },
  {
    id: 'ev-4',
    patientName: 'Ricardo Lima',
    date: '20/05/2024',
    time: '16:45',
    type: 'Procedimento',
    summary: 'Crioterapia em lesão verrucosa em dorso de mão direita. Procedimento sem intercorrências.',
    author: 'Dr. Roberto Almeida'
  }
];

const MedicalRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredEvolutions = useMemo(() => {
    return mockEvolutions.filter(ev => 
      ev.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-outfit font-bold text-petrol-dark">Prontuários</h2>
          <p className="text-slate-500">Arquivo histórico e evolução clínica de todos os pacientes.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-petrol-vibrant transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar paciente ou evolução..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol-vibrant/20 w-full md:w-80 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/60 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-petrol-vibrant/10 text-petrol-vibrant flex items-center justify-center">
            <ClipboardList size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total de Evoluções</p>
            <h3 className="text-2xl font-bold text-petrol-dark font-outfit">4.829</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/60 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <History size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Este Mês</p>
            <h3 className="text-2xl font-bold text-petrol-dark font-outfit">152</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/60 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Sparkles size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Resumos por IA</p>
            <h3 className="text-2xl font-bold text-petrol-dark font-outfit">842</h3>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Recent Evolutions Feed */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold font-outfit text-petrol-dark flex items-center gap-2">
               <History className="text-petrol-vibrant" size={24} /> Feed Cronológico
            </h3>
            <div className="flex gap-2">
               <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-petrol-dark transition-all">
                 <Filter size={18} />
               </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredEvolutions.map((ev) => (
              <div key={ev.id} className="glass p-6 rounded-[2rem] border border-white/60 bg-white/60 hover:shadow-lg transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 flex gap-2">
                   <button className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-petrol-vibrant transition-all shadow-sm">
                     <Download size={16} />
                   </button>
                   <button className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-petrol-vibrant transition-all shadow-sm">
                     <MoreVertical size={16} />
                   </button>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-petrol-neutral flex flex-col items-center justify-center text-center shrink-0 border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{ev.date.split('/')[1]}</span>
                    <span className="text-xl font-bold text-petrol-dark leading-none">{ev.date.split('/')[0]}</span>
                    <span className="text-[10px] font-bold text-petrol-medium mt-0.5">{ev.time}</span>
                  </div>
                  <div className="flex-1 pr-16">
                    <div className="flex items-center gap-3 mb-2">
                       <h4 className="font-bold text-xl text-petrol-dark group-hover:text-petrol-vibrant transition-colors">{ev.patientName}</h4>
                       <span className="px-3 py-1 bg-petrol-vibrant/10 text-petrol-vibrant text-[10px] font-black uppercase tracking-widest rounded-full">{ev.type}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 italic mb-4">
                      "{ev.summary}"
                    </p>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <User size={14} className="text-slate-300" /> Responsável: <span className="text-petrol-dark font-bold">{ev.author}</span>
                       </div>
                       <button className="flex items-center gap-1.5 text-xs font-bold text-petrol-vibrant hover:underline group/btn">
                         Abrir Prontuário Completo <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-4 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm hover:border-petrol-vibrant/30 hover:text-petrol-vibrant transition-all uppercase tracking-widest bg-white/40">
            Carregar Evoluções Anteriores
          </button>
        </div>

        {/* Side Panel: Records Insights */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm">
            <h3 className="text-xl font-bold font-outfit text-petrol-dark mb-6">Prontuários Recentes</h3>
            <div className="space-y-4">
              {MOCK_PATIENTS.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-slate-100 hover:border-petrol-vibrant/20 hover:bg-white transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-petrol-dark text-white flex items-center justify-center font-bold">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-petrol-dark text-sm">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Ult. Acesso: Hoje</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-petrol-vibrant transition-colors" />
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-xs font-bold text-petrol-vibrant hover:underline uppercase tracking-widest text-center">Ver Todos os Pacientes</button>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/60 bg-petrol-dark shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                 <Sparkles size={24} className="text-petrol-soft" />
              </div>
              <h4 className="text-xl font-bold font-outfit mb-3">Assistente de Prontuário IA</h4>
              <p className="text-sm text-petrol-soft leading-relaxed mb-6">
                O MedCore utiliza Inteligência Artificial para resumir evoluções complexas e sugerir códigos CID-10 baseados no relato clínico.
              </p>
              <button className="w-full py-3.5 bg-white text-petrol-dark rounded-xl text-sm font-bold hover:bg-petrol-soft transition-all shadow-lg">
                Ativar Sugestões Inteligentes
              </button>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/60 bg-white/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-emerald-500" size={24} />
              <h3 className="text-xl font-bold font-outfit text-petrol-dark">Arquivos DICOM</h3>
            </div>
            <div className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
               <p className="text-xs font-bold text-slate-400">Arraste exames para o arquivo global</p>
               <button className="text-[10px] font-black uppercase text-petrol-vibrant tracking-widest px-3 py-1 bg-white border border-slate-200 rounded-lg">Selecionar Arquivos</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
