import { User, Patient, Clinician } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development - in production this would connect to a real backend
const mockClinicians: Clinician[] = [
  {
    id: 'clinician-1',
    email: 'mel@eatwell.com',
    role: 'clinician',
    name: 'Mel Richardson',
    createdAt: new Date('2024-01-01'),
    patients: ['patient-1', 'patient-2']
  }
];

const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    email: 'john@example.com',
    role: 'patient',
    name: 'John Doe',
    clinicianId: 'clinician-1',
    accessCode: 'ABC123',
    age: 35,
    sex: 'male',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'patient-2',
    email: 'jane@example.com',
    role: 'patient',
    name: 'Jane Smith',
    clinicianId: 'clinician-1',
    accessCode: 'XYZ789',
    age: 28,
    sex: 'female',
    createdAt: new Date('2024-01-20')
  }
];

const STORAGE_KEY = 'eatwell_current_user';

class AuthService {
  async getCurrentUser(): Promise<User | null> {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  }

  async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication for clinician
    const clinician = mockClinicians.find(c => c.email === email);
    if (clinician && password === 'password') { // Mock password check
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clinician));
      return clinician;
    }

    // Mock authentication for patients with email/password
    const patient = mockPatients.find(p => p.email === email);
    if (patient && password === 'password') { // Mock password check
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patient));
      return patient;
    }

    throw new Error('Invalid credentials');
  }

  async loginWithCode(accessCode: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const patient = mockPatients.find(p => p.accessCode === accessCode);
    if (patient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patient));
      return patient;
    }

    throw new Error('Invalid access code');
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  async createPatient(patientData: {
    name: string;
    email?: string;
    age?: number;
    sex?: 'male' | 'female' | 'other';
    height?: number;
    weight?: number;
    notes?: string;
  }, clinicianId: string): Promise<Patient> {
    // Generate unique access code
    const accessCode = this.generateAccessCode();
    
    const newPatient: Patient = {
      id: uuidv4(),
      email: patientData.email || '',
      role: 'patient',
      name: patientData.name,
      clinicianId,
      accessCode,
      age: patientData.age,
      sex: patientData.sex,
      height: patientData.height,
      weight: patientData.weight,
      notes: patientData.notes,
      createdAt: new Date()
    };

    // In production, this would be saved to a database
    mockPatients.push(newPatient);
    
    return newPatient;
  }

  private generateAccessCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async getPatients(clinicianId: string): Promise<Patient[]> {
    return mockPatients.filter(p => p.clinicianId === clinicianId);
  }

  async getPatient(patientId: string): Promise<Patient | null> {
    return mockPatients.find(p => p.id === patientId) || null;
  }
}

export const authService = new AuthService();