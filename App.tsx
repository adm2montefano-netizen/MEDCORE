
import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Consultation from './pages/Consultation';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import CashFlow from './pages/CashFlow';
import MedicalRecords from './pages/MedicalRecords';
import Telemedicine from './pages/Telemedicine';
import Services from './pages/Services';
import Subscriptions from './pages/Subscriptions';
import AdminPanel from './pages/AdminPanel';
import FiscalPanel from './pages/FiscalPanel';
import NotesPage from './pages/NotesPage';
import GlossaryPage from './pages/GlossaryPage';
import HelpPage from './pages/HelpPage';
import Sidebar from './components/Sidebar';
import GlobalSearch from './components/GlobalSearch';
import { UserRole, SpecialtyType, User, Clinic } from './types';
import { MOCK_USER, MOCK_CLINIC, THEMES } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clinic, setClinic] = useState<Clinic>(MOCK_CLINIC);

  const handleLogin = (email: string) => {
    // Simulate auth
    setCurrentUser(MOCK_USER);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen premium-gradient text-slate-800 flex specialty-theme-${clinic.specialty.toLowerCase()}`}>
      {/* Dynamic Background Blur */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-petrol-soft/20 blur-[150px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-petrol-vibrant/10 blur-[120px] rounded-full"></div>
      </div>

      <Sidebar 
        role={currentUser?.role || UserRole.DOCTOR} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-64 min-h-screen flex flex-col overflow-hidden">
        {/* Global Search Header Area */}
        <header className="p-8 pb-4 flex items-center justify-center sticky top-0 z-[40]">
           <GlobalSearch />
        </header>

        <div className="flex-1 p-8 pt-4 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'patients' && (
              <Patients onStartConsultation={() => setActiveTab('consultation')} />
            )}
            {activeTab === 'records' && <MedicalRecords />}
            {activeTab === 'calendar' && <Calendar />}
            {activeTab === 'consultation' && <Consultation specialty={clinic.specialty} />}
            {activeTab === 'notes' && <NotesPage />}
            {activeTab === 'glossary' && <GlossaryPage />}
            {activeTab === 'help' && <HelpPage />}
            {activeTab === 'services' && <Services />}
            {activeTab === 'finance' && <CashFlow />}
            {activeTab === 'fiscal' && <FiscalPanel />}
            {activeTab === 'telemed' && <Telemedicine onStartConsultation={() => setActiveTab('consultation')} />}
            {activeTab === 'admin' && <AdminPanel />}
            {activeTab === 'subscriptions' && <Subscriptions />}
            {activeTab === 'settings' && <Settings clinic={clinic} setClinic={setClinic} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
