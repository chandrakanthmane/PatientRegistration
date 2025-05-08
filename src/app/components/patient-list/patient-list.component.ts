import { Component, OnInit } from '@angular/core';
import { Patient } from '../../../modals/patients.modal';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../../services/data-base.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        query('.patient-card', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('rowAnimation', [
      transition(':enter', [
        query('tr', [
          style({ opacity: 0, transform: 'translateX(-10px)' }),
          stagger(30, [
            animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  isLoading = true;
  searchTerm = '';
  viewMode = 'card'; // 'card' or 'table'
  expandedPatientId: number | null = null;
  
  constructor(private dbService: DatabaseService) {}
  
  ngOnInit() {
    this.dbService.patients$.subscribe(patients => {
      this.patients = patients;
      this.filteredPatients = patients;
      this.isLoading = false;
    });
  }
  
  applyFilter() {
    if (!this.searchTerm) {
      this.filteredPatients = this.patients;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(patient => 
      patient.firstName.toLowerCase().includes(term) ||
      patient.lastName.toLowerCase().includes(term) ||
      patient.email.toLowerCase().includes(term) ||
      patient.phoneNumber.includes(term)
    );
  }
  
  clearSearch() {
    this.searchTerm = '';
    this.applyFilter();
  }
  
  toggleDetails(patient: Patient) {
    if (this.expandedPatientId === patient.id) {
      this.expandedPatientId = null;
    } else {
      this.expandedPatientId = patient.id!;
    }
  }

  switchViewMode(mode: 'card' | 'table') {
    // Only switch if not already in that mode
    if (this.viewMode !== mode) {
      this.viewMode = mode;
    }
  }
}