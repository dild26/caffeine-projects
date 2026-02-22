# Private Project Board Application

## Overview
A personal task management application with a Kanban-style board featuring three columns: "To Do", "In Progress", and "Done". Users can manage their private tasks with drag-and-drop functionality, with comprehensive schema validation and logging.

## Authentication
- User authentication is required
- Each user can only see and manage their own tasks
- Tasks are private to the logged-in user

## Core Features

### Board Layout
- Three columns displayed horizontally: "To Do", "In Progress", "Done"
- Each column displays tasks assigned to it in a vertical stack
- Clean, organized layout with clear column separation

### Task Management
- Users can create new tasks in any column
- Each task has a title and description
- Tasks can be created by:
  - Selecting a target column when creating
  - Using a create button within each specific column
- Each task displays its title and description on the card
- Delete functionality available on each task card

### Drag and Drop
- Tasks can be dragged between columns
- When a task is moved to a new column, its assignment updates immediately
- Column changes persist after page refresh
- Smooth drag-and-drop user experience

## Schema Validation and Management

### Data Schema Validation
- Strict schema validation for both user profile and task data
- Backend validates all incoming data against predefined schemas before processing
- Frontend validates data before sending to backend
- Clear error messages displayed for invalid input on frontend
- All data must conform to well-defined schemas to be accepted

### Schema Change Management
- Backend generates manifest logs for all schema changes
- Logs capture when new fields are added or data types are changed
- Schema change logs include timestamps and change descriptions
- Endpoint available to retrieve schema change history

### Markdown to YAML Conversion
- Process to convert Markdown-based specifications (.md, .spec.md, .ml) to normalized YAML format
- YAML format used for schema ingestion and validation instructions
- Conversion process supports AI-driven features and schema management
- All conversion steps are logged for traceability

### Validation Logging
- All schema ingestion and validation steps are logged
- Unambiguous logging for complete traceability
- Validation errors and successes are recorded with timestamps

## Backend Data Storage
- Store tasks with the following information:
  - Task title
  - Task description  
  - Column assignment ("To Do", "In Progress", "Done")
  - User ownership (to ensure privacy)
- Store user profile data with schema validation
- Store schema change manifest logs with timestamps and descriptions
- Backend operations:
  - Create new task (with schema validation)
  - Update task column assignment (with schema validation)
  - Delete task
  - Retrieve user's tasks
  - Retrieve schema change logs
  - Validate data against current schemas
  - Convert Markdown specifications to YAML format

## User Interface
- Application content in English
- Responsive design for different screen sizes
- Intuitive drag-and-drop interface
- Clear visual feedback for user actions
- Clear error messages for schema validation failures
- User-friendly display of validation errors with specific field information
