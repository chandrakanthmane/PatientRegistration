// src/app/services/database.service.ts
import { Injectable } from '@angular/core';
import { PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Patient } from '../modals/patients.modal';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: any = null;
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  public patients$ = this.patientsSubject.asObservable();
  private dbReady = new BehaviorSubject<boolean>(false);
  public dbReady$ = this.dbReady.asObservable();
  private isBrowser: boolean;
  
  constructor() {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);
  }
  
  // This will be called by a component when the app is ready
  public async initializeDatabaseOnDemand() {
    // Skip database initialization in server environment
    if (!this.isBrowser) {
      console.log('Skipping database initialization in server environment');
      this.dbReady.next(true);
      return;
    }
    
    if (this.db) {
      return; // Already initialized
    }
    
    try {
      // Dynamically import PGLite only when called explicitly and in browser
      const { PGlite } = await import('@electric-sql/pglite');
      
      const wasmModule = await WebAssembly.compileStreaming(
        fetch('/assets/pglite.wasm')
      );
      
      // Then use it with the create method
      this.db = await PGlite.create({
        dataDir: 'memory://patient-registration-db',
        wasmModule
      });
      
      // Wait for database to be fully ready
      await this.db.waitReady;
      
      // Create patients table
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          dateOfBirth TEXT NOT NULL,
          gender TEXT NOT NULL,
          address TEXT NOT NULL,
          phoneNumber TEXT NOT NULL,
          email TEXT NOT NULL,
          insuranceProvider TEXT,
          medicalHistory TEXT,
          registrationDate TEXT NOT NULL
        );
      `);
      
      console.log('Database initialized successfully');
      this.dbReady.next(true);
      
      // Load initial data
      await this.loadPatients();
      
      // Set up broadcast channel
      this.setupBroadcastChannel();
    } catch (error) {
      console.error('Database initialization failed:', error);
      // Fall back to localStorage if PGLite fails
      this.initializeLocalStorageFallback();
    }
  }
  
  // Fallback to localStorage if PGLite doesn't work
  private initializeLocalStorageFallback() {
    // Skip localStorage in server environment
    if (!this.isBrowser) {
      console.log('Skipping localStorage fallback in server environment');
      this.dbReady.next(true);
      return;
    }
    
    console.log('Using localStorage fallback for data storage');
    
    // Load existing patients from localStorage
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      this.patientsSubject.next(JSON.parse(storedPatients));
    }
    
    this.dbReady.next(true);
  }
  
  async loadPatients() {
    if (!this.isBrowser) {
      return;
    }
    
    try {
      if (this.db) {
        // PGLite is available
        const result = await this.db.query('SELECT * FROM patients ORDER BY id DESC');
        this.patientsSubject.next(result.rows as Patient[]);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  }
  
  async addPatient(patient: Patient): Promise<number> {
    if (!this.isBrowser) {
      return 0;
    }
    
    try {
      if (this.db) {
        // PGLite is available
        const result = await this.db.query(
          `INSERT INTO patients (
            firstName, lastName, dateOfBirth, gender, 
            address, phoneNumber, email, 
            insuranceProvider, medicalHistory, registrationDate
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
          [
            patient.firstName,
            patient.lastName,
            patient.dateOfBirth,
            patient.gender,
            patient.address,
            patient.phoneNumber,
            patient.email,
            patient.insuranceProvider || '',
            patient.medicalHistory || '',
            patient.registrationDate
          ]
        );
        
        const patientId = result.rows[0].id;
        
        // Broadcast change to other tabs
        this.broadcastDatabaseChange();
        
        // Reload patients
        await this.loadPatients();
        
        return patientId;
      } else {
        // Fallback to localStorage
        const patients = this.patientsSubject.getValue();
        const newId = patients.length > 0 
          ? Math.max(...patients.map(p => p.id || 0)) + 1 
          : 1;
        
        const newPatient: Patient = {
          ...patient,
          id: newId
        };
        
        const updatedPatients = [newPatient, ...patients];
        this.patientsSubject.next(updatedPatients);
        
        // Save to localStorage
        localStorage.setItem('patients', JSON.stringify(updatedPatients));
        
        // Broadcast change
        this.broadcastDatabaseChange();
        
        return newId;
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  }
  
  async executeQuery(sqlQuery: string): Promise<any> {
    if (!this.isBrowser) {
      return [];
    }
    
    try {
      if (!sqlQuery.trim().toLowerCase().startsWith('select')) {
        throw new Error('Only SELECT queries are allowed');
      }
      
      if (this.db) {
        // PGLite is available
        const result = await this.db.query(sqlQuery);
        return result.rows;
      } else {
        // Fallback implementation for basic queries
        const patients = this.patientsSubject.getValue();
        // This is a very simple fallback that just returns all patients
        return patients;
      }
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
  
  // Multi-tab synchronization
  private broadcastChannel: BroadcastChannel | null = null;
  
  private setupBroadcastChannel() {
    if (!this.isBrowser) {
      return;
    }
    
    try {
      this.broadcastChannel = new BroadcastChannel('patient-registration-app');
      this.broadcastChannel.onmessage = (event) => {
        if (event.data === 'database-changed') {
          if (this.db) {
            this.loadPatients();
          } else {
            // Reload from localStorage
            const storedPatients = localStorage.getItem('patients');
            if (storedPatients) {
              this.patientsSubject.next(JSON.parse(storedPatients));
            }
          }
        }
      };
    } catch (error) {
      console.error('BroadcastChannel not supported:', error);
    }
  }
  
  private broadcastDatabaseChange() {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage('database-changed');
    }
  }
}