import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../../services/data-base.service';

@Component({
  selector: 'app-patient-query',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-query.component.html',
  styleUrl: './patient-query.component.scss'
})
export class PatientQueryComponent {
  sqlQuery = 'SELECT * FROM patients LIMIT 10';
  queryResults: any[] = [];
  isLoading = false;
  errorMessage = '';
  
  constructor(private dbService: DatabaseService) {}
  
  async executeQuery() {
    this.isLoading = true;
    this.errorMessage = '';
    this.queryResults = [];
    
    try {
      this.queryResults = await this.dbService.executeQuery(this.sqlQuery);
    } catch (error: any) {
      this.errorMessage = `Query error: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }
  
  // Helper method to get column names from the results
  getColumnNames(): string[] {
    if (this.queryResults.length === 0) {
      return [];
    }
    return Object.keys(this.queryResults[0]);
  }
}
