
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Video, 
  Settings, 
  LogOut,
  Stethoscope,
  DollarSign,
  FileText,
  TrendingUp,
  Briefcase,
  Zap,
  ShieldAlert,
  FileSignature,
  StickyNote,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },
    { id: 'patients', label: 'Pacientes', icon: Users, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },
    { id: 'records', label: 'Prontuários', icon: FileText, roles: [UserRole.ADMIN, UserRole.DOCTOR] },
    { id: 'calendar', label: 'Agenda', icon: Calendar, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },
    { id: 'consultation', label: 'Atendimento', icon: Stethoscope, roles: [UserRole.DOCTOR] },
    { id: 'notes', label: 'Anotações', icon: StickyNote, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },
    { id: 'glossary', label: 'Glossário', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },
    { id: 'services', label: 'Serviços', icon: Briefcase, roles: [UserRole.ADMIN, UserRole.DOCTOR] },
    { id: 'finance', label: 'Fluxo de Caixa', icon: TrendingUp, roles: [UserRole.ADMIN] },
    { id: 'fiscal', label: 'Fiscal', icon: FileSignature, roles: [UserRole.ADMIN] },
    { id: 'telemed', label: 'Teleconsulta', icon: Video, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT] },
    { id: 'admin', label: 'ADM', icon: ShieldAlert, roles: [UserRole.ADMIN] },
    { id: 'subscriptions', label: 'Assinatura', icon: Zap, roles: [UserRole.ADMIN] },
    { id: 'settings', label: 'Configurações', icon: Settings, roles: [UserRole.ADMIN] },
    { id: 'help', label: 'Ajuda', icon: HelpCircle, roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.PATIENT] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 h-screen bg-petrol-dark border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-petrol-vibrant rounded-lg flex items-center justify-center shadow-lg shadow-black/10">
          <Stethoscope className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white font-outfit">MedCore</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAdminTab = item.id === 'admin';
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-white/10 text-white border border-white/20' 
                  : isAdminTab 
                    ? 'text-amber-400/70 hover:bg-amber-400/10 hover:text-amber-400'
                    : 'text-petrol-soft hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? "text-petrol-soft" : isAdminTab ? "text-amber-400" : ""} />
              <span className="font-medium">{item.label}</span>
              {isAdminTab && !isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-petrol-soft hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
