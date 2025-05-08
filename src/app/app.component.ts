// src/app/app.component.ts
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../services/data-base.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'Patient Registration App';
  dbReady = false;
  private isBrowser: boolean;
  
  constructor(private dbService: DatabaseService) {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }
  
  ngOnInit() {
    // Skip database initialization in server environment
    if (!this.isBrowser) {
      this.dbReady = true;
      return;
    }
    
    // Initialize database after the component is fully initialized
    // Use a longer timeout to ensure the browser environment is fully ready
    setTimeout(() => {
      this.initializeDatabase();
    }, 1000);
    
    this.dbService.dbReady$.subscribe(ready => {
      this.dbReady = ready;
    });
  }
  
  async initializeDatabase() {
    if (this.isBrowser) {
      await this.dbService.initializeDatabaseOnDemand();
    }
  }
}