# PgLite

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Features
## Patient Registration

User-friendly form for adding new patient records
Comprehensive form validation
Intuitive UI with clear feedback messages
Multi-section layout for organizing patient information

## Patient Listing

Dual view modes (card and table) for patient records
Search functionality to filter patients by name, email, or phone
Interactive patient cards with expandable details
Smooth animations for a polished user experience

## SQL Query Tool

Execute SQL-like queries to filter and retrieve patient data
Pre-defined query examples for common operations
CSV export functionality for query results
Syntax highlighting and error handling

## Offline Functionality

All data persists across page refreshes using IndexedDB
No server dependency - everything runs in the browser
Multi-tab synchronization for real-time updates

## Technology Stack

Framework: Angular 18 (Standalone Components)
Database: IndexedDB (with PGLite-compatible API)
Styling: Custom SCSS with CSS variables
Animations: Angular Animations
Cross-tab Communication: BroadcastChannel API
Deployment: Netlify

## Setup Instructions
## Prerequisites

Node.js (v16 or higher)
npm (v8 or higher)

## Installation

Clone the repository:
bashgit clone https://github.com/chandrakanthmane/patient-registration-app.git
cd patient-registration-app

## Install dependencies:
npm install

Start the development server: ng serve

Access the application at: http://localhost:4200


## Building for Production
To build the application for production: ng build --configuration production
The build artifacts will be stored in the dist/ directory.