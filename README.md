# Eat Well With Mel - IBS Food & Symptom Tracker

A comprehensive web application for tracking meals, symptoms, and wellness factors to help identify IBS triggers through intelligent correlation analysis. Built with React, TypeScript, and Material-UI.

## Features

### 🔐 Dual User System
- **Clinician Access**: Full patient management and data analysis
- **Patient Access**: Personal tracking with unique access codes
- Secure authentication with role-based permissions

### 📱 Five Main Sections
1. **Diary** - Chronological view of all entries with rich filtering
2. **Reports** - Visual analytics with correlation charts and trend analysis
3. **Add Entry** - Quick logging of food, drinks, symptoms, exercise, and wellness
4. **My Library** - Custom items and favorites with smart search
5. **Profile** - Settings, data export, and account management

### 🍎 Comprehensive Tracking
- **Food Logging**: Searchable database with portion suggestions and meal categorization
- **Drink Tracking**: Beverages with amount tracking and category filtering
- **Symptom Recording**: Bristol Stool Chart, severity scales (1-10), and duration tracking
- **Wellness Monitoring**: Sleep quality, stress, energy, and mood tracking
- **Exercise Logging**: Activity types with duration and category organization
- **Supplement Tracking**: Dosage and timing with common dose suggestions

### 📊 Intelligent Analysis
- **Trigger Correlation**: 6-hour window analysis for symptom-food correlations
- **Visual Charts**: Bar charts for triggers, line charts for trends
- **Pattern Recognition**: Statistical analysis of consumption vs symptoms
- **Risk Periods**: Identification of high-risk times based on historical data

### 📄 Data Export
- **PDF Reports**: Comprehensive health reports with recommendations
- **CSV Export**: Raw data for external analysis
- **GDPR Compliant**: Secure data handling and export capabilities

### 🎨 Design & UX
- **Custom Styling**: Warm color palette (#fdf6f5 background, #fa7888 primary)
- **Typography**: Playfair Display for headings, Avenir Light for body text
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Accessibility**: WCAG 2.1 AA compliant interface

## Technology Stack

- **Frontend**: React 18, TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Charts**: Recharts for data visualization
- **PDF Generation**: jsPDF for report exports
- **Date Handling**: date-fns for date operations
- **State Management**: React Context API
- **Styling**: Material-UI theming with custom colors

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Demo Credentials

**Clinician Login:**
- Email: `mel@eatwell.com`
- Password: `password`

**Patient Access Codes:**
- `ABC123` (John Doe)
- `XYZ789` (Jane Smith)

## Available Scripts

### `npm start`
Runs the app in the development mode.

### `npm test`
Launches the test runner in the interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/           # React components organized by feature
│   ├── auth/            # Authentication components
│   ├── navigation/      # Bottom navigation and layout
│   ├── diary/           # Diary page and entry components
│   ├── reports/         # Analytics and visualization components
│   ├── add/             # Entry creation forms
│   ├── library/         # Custom items and favorites
│   └── profile/         # Profile and settings
├── contexts/            # React Context providers
├── services/            # Business logic and API services
├── data/               # Static data and search functionality
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and validation
```

## Key Features Implementation

### Food Database & Search
- Pre-populated database with 35+ common foods
- Category-based organization (Grains, Proteins, Dairy, etc.)
- Smart search with autocomplete
- Common portion size suggestions
- Custom food item support

### Correlation Analysis Engine
- Configurable time window (default: 6 hours)
- Statistical correlation calculation
- Minimum exposure threshold filtering
- Severity-weighted analysis
- Multi-symptom support

### Bristol Stool Chart Integration
- Complete 7-type classification
- Visual descriptions for each type
- Easy selection interface
- Historical tracking and analysis

### Export Functionality
- PDF reports with charts and recommendations
- CSV data export for external analysis
- Customizable date ranges
- GDPR-compliant data handling

## Built With

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and enhanced with:

- Material-UI for modern, accessible components
- Recharts for interactive data visualizations
- jsPDF for client-side PDF generation
- TypeScript for type safety and better developer experience

## Security & Privacy

- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **GDPR Compliance**: Full data portability and deletion capabilities
- **Role-based Access**: Strict permission controls between clinician and patient roles
- **Audit Trails**: Complete logging of data access and modifications
