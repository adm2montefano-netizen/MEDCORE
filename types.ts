
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT = 'PATIENT'
}

export enum SpecialtyType {
  GENERAL = 'GENERAL',
  CARDIOLOGY = 'CARDIOLOGY',
  DERMATOLOGY = 'DERMATOLOGY',
  PSYCHOLOGY = 'PSYCHOLOGY'
}

export type GlossaryCategory = 'EXAM' | 'PROCEDURE' | 'PATHOLOGY' | 'PROTOCOL';

export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  category: GlossaryCategory;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW'; // Para patologias/procedimentos
  manchesterColor?: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE'; // Para protocolos
  tags: string[];
}

export interface DynamicField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number';
  placeholder?: string;
}

export interface Clinic {
  id: string;
  name: string;
  cnpj: string;
  specialty: SpecialtyType;
  themeColor: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  clinicId: string;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  history: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  date: string;
  startTime: string;
  type: 'IN_PERSON' | 'TELEMEDICINE';
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface ConsultationLog {
  id: string;
  appointmentId: string;
  anamnesis: string;
  diagnosis: string;
  prescription: string;
  images: string[]; // Base64 or URLs
}

export interface ClinicalService {
  id: string;
  name: string;
  category: 'CONSULTA' | 'EXAME' | 'PROCEDIMENTO' | 'OUTRO';
  price: number;
  duration: number; // in minutes
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  createdAt: string;
}
