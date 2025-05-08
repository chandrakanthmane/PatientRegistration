export interface Patient {
    id?: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    phoneNumber: string;
    email: string;
    insuranceProvider?: string;
    medicalHistory?: string;
    registrationDate: string;
  }