# Student Records & Results Portal

A lightweight academic management web app for registering students, entering subject-wise marks, and tracking results in a clean dashboard-style interface.

## Overview

This project helps educational institutions or departments manage:

- Student registration details
- Subject marks for six core courses
- Automatic result calculation
- Search and filtering of records
- Record editing and deletion
- JSON import/export support
- Class-level summary analytics

The application runs entirely in the browser and stores data in `localStorage`, so there is no backend or database required.

## Features

- Student form with personal and academic information
- Subject marks entry for:
  - Agentic AI
  - Fullstack
  - DSA
  - SQL/NO SQL
  - Linux
  - Python
- Automatic total and percentage calculation
- Grade assignment based on academic performance
- Pass/Fail determination using the rule:
  - minimum 40 marks in each subject
  - overall aggregate of at least 40%
- Search by student name or roll number
- Filter records by course and result status
- Add, edit, delete, and view student records
- Export data to JSON
- Import records from JSON files
- Load sample demo records for quick testing
- Summary dashboard with class performance metrics

## Project Structure

```text
.
├── app.js              # Application logic and data handling
├── index.html          # UI layout and forms
├── styles.css          # Styling and responsive layout
├── Readme.md           # Project documentation
└── .gitignore          # Optional repository ignore rules (if added later)
```

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`

## Getting Started

### Option 1: Open directly in the browser

1. Download or clone the project.
2. Open `index.html` in your browser.
3. Start using the application immediately.

### Option 2: Run a local web server

```bash
cd /path/to/project
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How to Use

### Register a Student

1. Go to the Registration & marks section.
2. Fill in the required student details.
3. Enter marks for all six subjects.
4. Click `Register student`.

### View and Manage Records

1. Open the Student records section.
2. Use the search box to find a student by name or roll number.
3. Filter by course or pass/fail status.
4. Use:
   - `View` to open the marksheet
   - `Edit` to update the student data
   - `Delete` to remove the record

### Export and Import Data

- Use `Export JSON` to download all currently saved student records.
- Use `Import JSON` to load records from a valid JSON file.

### Summary Dashboard

The Class summary page displays:

- total enrolled students
- pass rate
- average percentage
- highest scorer
- grade distribution
- course-wise enrollment
- subject-wise performance trends

## Data Storage

Student records are stored in the browser using `localStorage`. This means:

- data persists between page refreshes in the same browser
- data is not sent to a backend server
- clearing browser storage will remove saved records

## Result Rules

Each record is evaluated with the following logic:

- total marks = sum of all six subjects
- percentage = total / 6
- pass requires:
  - minimum 40 marks in every subject
  - overall percentage at least 40%

## License

This project is provided as-is for educational and demonstration purposes.

## Author

Built as a student records and academic performance portal using plain web technologies.
