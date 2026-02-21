
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  User, 
  FileText, 
  History, 
  Paperclip, 
  ChevronRight, 
  X, 
  Calendar, 
  CreditCard, 
  Phone, 
  Mail,
  Filter,
  UserPlus
} from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';
import { Patient } from '../types';

interface PatientsProps {
  onStartConsultation: () => void;
}

const Patients: React.FC<PatientsProps> = ({ onStartConsultation }) => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    phone: '',
    email: ''
  });

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.cpf.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.cpf) return;

    const patientToAdd: Patient = {
      id: `p-${Date.now()}`,
      ...newPatient,
      history: []
    };

    setPatients([patientToAdd, ...patients]);
    setSelectedPatient(patientToAdd);
    setIsModalOpen(false);
    setNewPatient({ name: '', cpf: '', birthDate: '', phone: '', email: '' });
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] overflow-hidden">
      {/* Search & List - 4 Columns */}
      <div className="lg:col-span-4 glass rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold font-outfit text-white">Pacientes</h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2.5 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`w-full p-5 flex items-center justify-between transition-all group border-b border-white/5 ${
                  selectedPatient?.id === patient.id 
                    ? 'bg-blue-600/20 border-l-4 border-l-blue-500' 
                    : 'hover:bg-white/[0.03] border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all ${
                    selectedPatient?.id === patient.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white/5 text-gray-400 group-hover:bg-white/10'
                  }`}>
                    {patient.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className={`font-bold tracking-tight transition-colors ${selectedPatient?.id === patient.id ? 'text-white' : 'text-gray-300'}`}>
                      {patient.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">CPF: {patient.cpf}</p>
                  </div>
                </div>
                <ChevronRight size={18} className={`transition-all ${selectedPatient?.id === patient.id ? 'text-blue-400 translate-x-1' : 'text-gray-700 opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-600">
                <Filter size={32} />
              </div>
              <p className="text-gray-400 font-medium">Nenhum paciente encontrado</p>
              <p className="text-xs text-gray-600 mt-1">Tente ajustar seus termos de busca</p>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-white/[0.02] border-t border-white/5">
           <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest text-center">
             {filteredPatients.length} pacientes listados
           </p>
        </div>
      </div>

      {/* Detail View (PEP) - 8 Columns */}
      <div className="lg:col-span-8 glass rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        {selectedPatient ? (
          <>
            <div className="p-8 border-b border-white/10 bg-white/[0.02]">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6 text-center md:text-left">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-blue-600/20 border border-white/10">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-white font-outfit tracking-tight">{selectedPatient.name}</h2>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400 font-medium justify-center md:justify-start">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-400" /> {new Date(selectedPatient.birthDate).toLocaleDateString()}</span>
                      <span className="text-gray-700">|</span>
                      <span className="flex items-center gap-1.5"><CreditCard size={14} className="text-blue-400" /> {selectedPatient.cpf}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onStartConsultation}
                  className="px-8 py-4 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 group"
                >
                  <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Nova Consulta
                </button>
              </div>

              <div className="flex gap-10 mt-10 border-b border-white/10">
                {['Prontuário', 'Histórico', 'Exames', 'Dados Cadastrais'].map((tab, i) => (
                  <button 
                    key={tab} 
                    className={`pb-5 px-1 text-sm font-bold tracking-wide transition-all relative ${i === 0 ? 'text-blue-400' : 'text-gray-500 hover:text-white'}`}
                  >
                    {tab}
                    {i === 0 && <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full shadow-[0_-2px_8px_rgba(59,130,246,0.5)]"></span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-10">
              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black">Telefone</p>
                      <p className="text-sm font-bold text-gray-200">{selectedPatient.phone}</p>
                    </div>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black">E-mail</p>
                      <p className="text-sm font-bold text-gray-200">{selectedPatient.email}</p>
                    </div>
                 </div>
              </div>

              {/* Tab Content: Histórico */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-outfit font-bold text-xl text-white flex items-center gap-2">
                    <History className="text-blue-400" size={24} /> Resumo de Atendimentos
                  </h4>
                  <button className="text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">Visualizar Todos</button>
                </div>
                
                <div className="grid gap-5">
                  {selectedPatient.history.length > 0 ? (
                    selectedPatient.history.map((item, idx) => (
                      <div key={idx} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-start gap-5 hover:border-white/10 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                          <FileText size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                            <p className="font-bold text-white text-lg">{item.split(' - ')[0]}</p>
                            <span className="text-xs text-gray-500 font-bold bg-white/5 px-2.5 py-1 rounded-lg uppercase tracking-tight">{item.split(' - ')[1]}</span>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            Registro de atendimento efetuado conforme protocolos clínicos. Paciente apresenta quadro estável com indicação de continuidade terapêutica.
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/10 hover:text-white transition-all">Ver Detalhes</button>
                            <button className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/10 hover:text-white transition-all">Baixar PDF</button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 rounded-3xl border border-dashed border-white/10 text-center flex flex-col items-center">
                       <FileText size={40} className="text-gray-700 mb-4" />
                       <p className="text-gray-500 font-medium">Nenhum histórico registrado para este paciente.</p>
                       <p className="text-xs text-gray-600 mt-1">Inicie uma nova consulta para registrar o primeiro atendimento.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-6 pb-10">
                <h4 className="font-outfit font-bold text-xl text-white flex items-center gap-2">
                  <Paperclip className="text-emerald-400" size={24} /> Galeria de Exames & Documentos
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[1, 2].map(i => (
                    <div key={i} className="aspect-square rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group cursor-pointer">
                      <img 
                        src={`https://picsum.photos/400/400?random=${i}&grayscale=1`} 
                        className="w-full h-full object-cover opacity-60 group-hover:scale-125 group-hover:opacity-90 transition-all duration-700" 
                        alt="Exame" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">RX_TORAX_0{i}.PNG</p>
                        <p className="text-[9px] text-gray-400 uppercase">24 de Mai, 2024</p>
                      </div>
                      <div className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                         <Search size={16} />
                      </div>
                    </div>
                  ))}
                  <button className="aspect-square rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-gray-500 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-600/5 transition-all group">
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                       <Plus size={28} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Upload</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full"></div>
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 text-gray-600 relative border border-white/10">
                <User size={48} />
              </div>
            </div>
            <h3 className="text-3xl font-bold font-outfit text-white mb-3">Gerenciamento de Pacientes</h3>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Selecione um perfil da lista lateral para acessar o Prontuário Eletrônico do Paciente (PEP), 
              histórico clínico completo e documentação digital.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 px-8 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2"
            >
              <UserPlus size={18} /> Cadastrar Primeiro Paciente
            </button>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#0D1B2A]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass w-full max-w-xl rounded-[2.5rem] border border-white/20 shadow-[0_0_100px_rgba(59,130,246,0.3)] relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h3 className="text-2xl font-bold font-outfit text-white">Cadastrar Paciente</h3>
                <p className="text-sm text-gray-500 mt-1">Preencha os dados fundamentais para o prontuário.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddPatient} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    value={newPatient.name}
                    onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                    placeholder="Ex: Maria Oliveira Santos"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">CPF</label>
                    <input 
                      required
                      type="text" 
                      value={newPatient.cpf}
                      onChange={e => setNewPatient({...newPatient, cpf: e.target.value})}
                      placeholder="000.000.000-00"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nascimento</label>
                    <input 
                      required
                      type="date" 
                      value={newPatient.birthDate}
                      onChange={e => setNewPatient({...newPatient, birthDate: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Telefone</label>
                    <input 
                      type="tel" 
                      value={newPatient.phone}
                      onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">E-mail</label>
                    <input 
                      type="email" 
                      value={newPatient.email}
                      onChange={e => setNewPatient({...newPatient, email: e.target.value})}
                      placeholder="paciente@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-white/10 rounded-2xl font-bold text-gray-400 hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-blue-600 rounded-2xl font-bold text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Concluir Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
