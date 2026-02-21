
import React, { useState } from 'react';
import { 
  Building2, 
  UserCog, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Save, 
  CheckCircle2,
  Stethoscope,
  Heart,
  Sparkles,
  Brain,
  Calendar,
  Globe,
  Mail,
  Smartphone,
  ChevronRight,
  ExternalLink,
  Shield
} from 'lucide-react';
import { SpecialtyType, Clinic, UserRole } from '../types';

interface SettingsProps {
  clinic: Clinic;
  setClinic: (clinic: Clinic) => void;
}

const Settings: React.FC<SettingsProps> = ({ clinic, setClinic }) => {
  const [formData, setFormData] = useState<Clinic>({ ...clinic });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeSubTab, setActiveSubTab] = useState('clinic');
  const [googleSync, setGoogleSync] = useState(false);

  const specialties = [
    { type: SpecialtyType.GENERAL, label: 'Clínica Geral', icon: Stethoscope, color: 'blue' },
    { type: SpecialtyType.CARDIOLOGY, label: 'Cardiologia', icon: Heart, color: 'emerald' },
    { type: SpecialtyType.DERMATOLOGY, label: 'Dermatologia', icon: Sparkles, color: 'amber' },
    { type: SpecialtyType.PSYCHOLOGY, label: 'Psicologia', icon: Brain, color: 'indigo' },
  ];

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setClinic(formData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 1200);
  };

  const tabs = [
    { id: 'clinic', label: 'Dados da Clínica', icon: Building2 },
    { id: 'users', label: 'Equipe & Permissões', icon: UserCog },
    { id: 'integrations', label: 'Integrações (API)', icon: Globe },
    { id: 'billing', label: 'Plano & Faturamento', icon: CreditCard },
    { id: 'notifications', label: 'Comunicação', icon: Mail },
    { id: 'security', label: 'Segurança & LGPD', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-outfit font-bold text-white tracking-tight">Configurações</h2>
          <p className="text-gray-400 mt-1">Gerencie as diretrizes, marca e usuários da sua clínica.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saveStatus !== 'idle'}
          className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50 group"
        >
          {saveStatus === 'saving' ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : saveStatus === 'saved' ? (
            <CheckCircle2 size={20} className="animate-bounce" />
          ) : (
            <Save size={20} className="group-hover:scale-110 transition-transform" />
          )}
          {saveStatus === 'saving' ? 'Processando...' : saveStatus === 'saved' ? 'Configurações Salvas!' : 'Salvar Alterações'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 glass rounded-3xl border border-white/10 p-2 space-y-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                activeSubTab === item.id 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
              {activeSubTab === item.id && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-8">
          {activeSubTab === 'clinic' && (
            <div className="space-y-8">
              {/* Clinic Branding Section */}
              <div className="glass p-8 rounded-3xl border border-white/10 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full"></div>
                <h3 className="text-xl font-bold font-outfit text-white border-b border-white/5 pb-4 flex items-center gap-2">
                   <Building2 className="text-blue-400" size={24} /> Identidade & Especialidade
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Nome Fantasia</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">CNPJ do Estabelecimento</label>
                    <input 
                      type="text" 
                      value={formData.cnpj}
                      onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white font-medium"
                    />
                  </div>
                </div>

                {/* White Label Specialty Selector */}
                <div className="space-y-5 pt-4">
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                    Customização Visual (White Label)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {specialties.map((spec) => (
                      <button
                        key={spec.type}
                        onClick={() => setFormData({...formData, specialty: spec.type})}
                        className={`p-5 rounded-3xl border transition-all flex flex-col items-center gap-4 text-center group ${
                          formData.specialty === spec.type
                            ? `bg-${spec.color}-500/10 border-${spec.color}-500/50 ring-4 ring-${spec.color}-500/10`
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${formData.specialty === spec.type ? `bg-${spec.color}-500 text-white shadow-lg` : 'bg-white/10 text-gray-400'}`}>
                          <spec.icon size={28} />
                        </div>
                        <div>
                          <p className={`text-sm font-bold tracking-tight ${formData.specialty === spec.type ? 'text-white' : 'text-gray-400'}`}>{spec.label}</p>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase font-black opacity-60">Layout {spec.type}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Sparkles size={16} className="text-indigo-400" />
                    </div>
                    <p className="text-xs text-indigo-300/80 leading-relaxed">
                      A tecnologia <strong>White Label</strong> do MedCore adapta automaticamente o dashboard, as cores e os campos de anamnese baseados na sua especialidade selecionada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'integrations' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="glass p-8 rounded-3xl border border-white/10">
                <h3 className="text-xl font-bold font-outfit text-white mb-6 flex items-center gap-2">
                  <Globe className="text-blue-400" size={24} /> Sincronização e APIs
                </h3>
                
                <div className="space-y-6">
                  {/* Google Calendar Integration */}
                  <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center shadow-inner">
                        <Calendar size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">Google Calendar Sync</p>
                        <p className="text-sm text-gray-500">Sincronização bidirecional de agendas médicas.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setGoogleSync(!googleSync)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        googleSync 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {googleSync ? 'CONECTADO' : 'CONECTAR OAUTH'}
                    </button>
                  </div>

                  {/* WhatsApp Integration */}
                  <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:border-white/10 transition-all opacity-60">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                        <Smartphone size={28} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">WhatsApp Business API</p>
                        <p className="text-sm text-gray-500">Lembretes automáticos via mensagens diretas.</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg">Em breve</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'users' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold font-outfit text-white">Equipe & Permissões</h3>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-blue-400 transition-all">
                    Convidar Profissional
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Dr. Roberto Almeida', role: 'Médico Administrador', status: 'Ativo', email: 'roberto@medcore.com' },
                    { name: 'Julia Santos', role: 'Recepcionista Master', status: 'Ativo', email: 'julia.recep@medcore.com' },
                    { name: 'Dra. Helena Costa', role: 'Médico Especialista', status: 'Férias', email: 'helena.dermato@medcore.com' },
                  ].map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-blue-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white tracking-tight">{user.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{user.role} • {user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {user.status}
                        </span>
                        <button className="p-2.5 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
                          <UserCog size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'billing' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="glass p-10 rounded-[2.5rem] border border-white/10 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-10">
                  <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.15em] shadow-lg">Plano Profissional</div>
                </div>
                
                <h3 className="text-2xl font-bold font-outfit text-white mb-8">Status da Conta</h3>
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-2xl shadow-blue-600/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <CreditCard size={44} />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-bold text-white font-outfit">MedCore Premium SaaS</p>
                    <p className="text-gray-400 mt-1">Sua clínica está em dia. Próximo ciclo em <strong>12 de Julho, 2024</strong>.</p>
                    <div className="flex gap-4 mt-6">
                      <button className="px-6 py-2.5 bg-white text-[#0D1B2A] rounded-xl text-sm font-bold hover:bg-blue-50 transition-all">Alterar Plano</button>
                      <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">Histórico de Notas</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="glass p-6 rounded-3xl border border-white/10">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Uso de Armazenamento (DICOM/Imagens)</p>
                    <div className="flex justify-between text-sm font-bold text-white mb-2">
                      <span>42.8 GB utilizados</span>
                      <span>de 100 GB</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-blue-600 w-[42.8%] shadow-lg shadow-blue-600/30"></div>
                    </div>
                 </div>
                 <div className="glass p-6 rounded-3xl border border-white/10">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Limite de Teleconsultas / Mês</p>
                    <div className="flex justify-between text-sm font-bold text-white mb-2">
                      <span>184 realizadas</span>
                      <span>ILIMITADO</span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-emerald-500 w-[60%] shadow-lg shadow-emerald-500/30"></div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeSubTab === 'security' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div className="glass p-8 rounded-3xl border border-white/10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-outfit text-white">Segurança & LGPD</h3>
                      <p className="text-sm text-gray-500">Configurações avançadas de proteção de dados sensíveis.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                       <div>
                         <p className="font-bold text-white">Autenticação em Dois Fatores (2FA)</p>
                         <p className="text-xs text-gray-500">Obrigatório para todos os médicos e administradores.</p>
                       </div>
                       <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                       <div>
                         <p className="font-bold text-white">Logs de Acesso ao Prontuário</p>
                         <p className="text-xs text-gray-500">Rastreabilidade total de quem acessou os dados de pacientes.</p>
                       </div>
                       <button className="text-xs font-bold text-blue-400 hover:underline">Ver Auditoria</button>
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                       <div>
                         <p className="font-bold text-white">Criptografia de Repouso (AES-256)</p>
                         <p className="text-xs text-gray-500">Ativa por padrão em todos os documentos e imagens.</p>
                       </div>
                       <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                         <CheckCircle2 size={14} /> Ativado
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
