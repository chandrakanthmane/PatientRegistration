import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../../services/data-base.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-patient-query',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-query.component.html',
  styleUrl: './patient-query.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
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
  
  // Example queries
  useExample(type: string) {
    switch (type) {
      case 'all':
        this.sqlQuery = 'SELECT * FROM patients';
        break;
      case 'orderByDate':
        this.sqlQuery = 'SELECT * FROM patients ORDER BY registrationDate DESC';
        break;
      case 'searchName':
        this.sqlQuery = "SELECT * FROM patients WHERE firstName LIKE '%John%' OR lastName LIKE '%Doe%'";
        break;
      case 'limit':
        this.sqlQuery = 'SELECT * FROM patients LIMIT 5';
        break;
      default:
        break;
    }
  }
  
  // Export results to CSV
  exportToCSV() {
    if (this.queryResults.length === 0) return;
    
    const columns = this.getColumnNames();
    const header = columns.join(',');
    
    const rows = this.queryResults.map(row => {
      return columns.map(column => {
        const value = row[column];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',');
    });
    
    const csv = [header, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'patient_query_results.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
