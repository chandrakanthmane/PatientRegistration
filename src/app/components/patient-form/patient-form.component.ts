import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../../services/data-base.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('sectionAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms {{delay}}ms ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ]
})
export class PatientFormComponent {
  patientForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private dbService: DatabaseService
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      insuranceProvider: [''],
      medicalHistory: ['']
    });
  }
  
  async onSubmit() {
    if (this.patientForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    try {
      const patientData = {
        ...this.patientForm.value,
        registrationDate: new Date().toISOString()
      };
      
      await this.dbService.addPatient(patientData);
      
      this.successMessage = 'Patient registered successfully!';
      this.patientForm.reset();
    } catch (error: any) {
      this.errorMessage = `Registration failed: ${error.message}`;
    } finally {
      this.isSubmitting = false;
    }
  }

}
