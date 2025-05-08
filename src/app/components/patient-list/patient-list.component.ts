import { Component, OnInit } from '@angular/core';
import { Patient } from '../../../modals/patients.modal';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../services/data-base.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  isLoading = true;
  
  constructor(private dbService: DatabaseService) {}
  
  ngOnInit() {
    this.dbService.patients$.subscribe(patients => {
      this.patients = patients;
      this.isLoading = false;
    });
  }
}
