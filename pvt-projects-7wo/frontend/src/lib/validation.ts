import { UserProfile, Column } from '../backend';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// UserProfile Schema Validation
export function validateUserProfile(profile: Partial<UserProfile>): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation
  if (!profile.name) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (typeof profile.name !== 'string') {
    errors.push({ field: 'name', message: 'Name must be a string' });
  } else if (profile.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name cannot be empty' });
  } else if (profile.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  } else if (profile.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name must not exceed 100 characters' });
  } else if (!/^[a-zA-Z\s'-]+$/.test(profile.name.trim())) {
    errors.push({ field: 'name', message: 'Name can only contain letters, spaces, hyphens, and apostrophes' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Task Schema Validation
export interface TaskInput {
  title: string;
  description: string;
  column: Column;
}

export function validateTask(task: Partial<TaskInput>): ValidationResult {
  const errors: ValidationError[] = [];

  // Title validation
  if (!task.title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (typeof task.title !== 'string') {
    errors.push({ field: 'title', message: 'Title must be a string' });
  } else if (task.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title cannot be empty' });
  } else if (task.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
  } else if (task.title.trim().length > 200) {
    errors.push({ field: 'title', message: 'Title must not exceed 200 characters' });
  }

  // Description validation
  if (task.description !== undefined) {
    if (typeof task.description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    } else if (task.description.trim().length > 2000) {
      errors.push({ field: 'description', message: 'Description must not exceed 2000 characters' });
    }
  }

  // Column validation
  if (!task.column) {
    errors.push({ field: 'column', message: 'Column is required' });
  } else if (typeof task.column !== 'string') {
    errors.push({ field: 'column', message: 'Column must be a valid value' });
  } else if (![Column.toDo, Column.inProgress, Column.done].includes(task.column)) {
    errors.push({ field: 'column', message: 'Column must be one of: To Do, In Progress, or Done' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Helper function to format validation errors for display
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0].message;
  return errors.map((err) => `• ${err.message}`).join('\n');
}

// Helper function to get field-specific error
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  const error = errors.find((err) => err.field === field);
  return error?.message;
}
