// Error taxonomy with standardized error codes and resolution pathways

export enum ErrorCategory {
  AUTHENTICATION = 'AUTH',
  NETWORK = 'NET',
  VALIDATION = 'VAL',
  PERMISSION = 'PERM',
  DATA_INTEGRITY = 'DATA',
  SYSTEM = 'SYS',
  PAYMENT = 'PAY',
  RATE_LIMIT = 'RATE',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface ErrorDefinition {
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  resolutionSteps: string[];
  retryable: boolean;
  requiresSupport: boolean;
}

export const ERROR_DEFINITIONS: Record<string, ErrorDefinition> = {
  // Authentication Errors
  AUTH_001: {
    code: 'AUTH_001',
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    message: 'Session expired',
    userMessage: 'Your session has expired. Please log in again.',
    resolutionSteps: [
      'Click the "Login" button',
      'Complete the authentication process',
      'Retry your previous action',
    ],
    retryable: true,
    requiresSupport: false,
  },
  AUTH_002: {
    code: 'AUTH_002',
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.HIGH,
    message: 'Invalid delegation',
    userMessage: 'Authentication failed. Please try logging in again.',
    resolutionSteps: [
      'Log out completely',
      'Clear browser cache',
      'Log in again',
      'If problem persists, contact support',
    ],
    retryable: true,
    requiresSupport: true,
  },
  AUTH_003: {
    code: 'AUTH_003',
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    message: 'User not authenticated',
    userMessage: 'You need to be logged in to perform this action.',
    resolutionSteps: [
      'Click the "Login" button',
      'Complete authentication',
      'Try again',
    ],
    retryable: true,
    requiresSupport: false,
  },

  // Network Errors
  NET_001: {
    code: 'NET_001',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    message: 'Network timeout',
    userMessage: 'The request took too long. Please check your connection and try again.',
    resolutionSteps: [
      'Check your internet connection',
      'Refresh the page',
      'Try again in a few moments',
    ],
    retryable: true,
    requiresSupport: false,
  },
  NET_002: {
    code: 'NET_002',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    message: 'Backend unavailable',
    userMessage: 'The service is temporarily unavailable. Please try again later.',
    resolutionSteps: [
      'Wait a few minutes',
      'Refresh the page',
      'Check system status',
      'Contact support if issue persists',
    ],
    retryable: true,
    requiresSupport: true,
  },

  // Validation Errors
  VAL_001: {
    code: 'VAL_001',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    message: 'Invalid input data',
    userMessage: 'Please check your input and try again.',
    resolutionSteps: [
      'Review the form fields',
      'Ensure all required fields are filled',
      'Check for any validation errors',
      'Submit again',
    ],
    retryable: true,
    requiresSupport: false,
  },
  VAL_002: {
    code: 'VAL_002',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.MEDIUM,
    message: 'Data integrity check failed',
    userMessage: 'The data could not be validated. Please try again.',
    resolutionSteps: [
      'Refresh the page',
      'Re-enter your data',
      'Contact support if problem persists',
    ],
    retryable: true,
    requiresSupport: true,
  },

  // Permission Errors
  PERM_001: {
    code: 'PERM_001',
    category: ErrorCategory.PERMISSION,
    severity: ErrorSeverity.MEDIUM,
    message: 'Insufficient permissions',
    userMessage: 'You do not have permission to perform this action.',
    resolutionSteps: [
      'Verify you are logged in with the correct account',
      'Contact an administrator for access',
    ],
    retryable: false,
    requiresSupport: true,
  },

  // Data Integrity Errors
  DATA_001: {
    code: 'DATA_001',
    category: ErrorCategory.DATA_INTEGRITY,
    severity: ErrorSeverity.HIGH,
    message: 'Data corruption detected',
    userMessage: 'A data integrity issue was detected. Our team has been notified.',
    resolutionSteps: [
      'Do not retry the operation',
      'Contact support immediately',
      'Provide your correlation ID',
    ],
    retryable: false,
    requiresSupport: true,
  },

  // System Errors
  SYS_001: {
    code: 'SYS_001',
    category: ErrorCategory.SYSTEM,
    severity: ErrorSeverity.CRITICAL,
    message: 'System error',
    userMessage: 'An unexpected system error occurred. Our team has been notified.',
    resolutionSteps: [
      'Refresh the page',
      'Try again in a few minutes',
      'Contact support if issue persists',
    ],
    retryable: true,
    requiresSupport: true,
  },

  // Payment Errors
  PAY_001: {
    code: 'PAY_001',
    category: ErrorCategory.PAYMENT,
    severity: ErrorSeverity.HIGH,
    message: 'Payment processing failed',
    userMessage: 'Your payment could not be processed. Please try again.',
    resolutionSteps: [
      'Check your payment details',
      'Ensure sufficient funds',
      'Try a different payment method',
      'Contact support if problem persists',
    ],
    retryable: true,
    requiresSupport: true,
  },

  // Rate Limit Errors
  RATE_001: {
    code: 'RATE_001',
    category: ErrorCategory.RATE_LIMIT,
    severity: ErrorSeverity.MEDIUM,
    message: 'Rate limit exceeded',
    userMessage: 'Too many requests. Please wait a moment and try again.',
    resolutionSteps: [
      'Wait 30 seconds',
      'Try your action again',
      'Avoid rapid repeated actions',
    ],
    retryable: true,
    requiresSupport: false,
  },
};

export function classifyError(error: Error): ErrorDefinition {
  const message = error.message.toLowerCase();
  
  // Authentication errors
  if (message.includes('delegation') || message.includes('expired') || message.includes('session')) {
    return ERROR_DEFINITIONS.AUTH_001;
  }
  if (message.includes('unauthorized') || message.includes('not authenticated')) {
    return ERROR_DEFINITIONS.AUTH_003;
  }
  
  // Network errors
  if (message.includes('timeout') || message.includes('timed out')) {
    return ERROR_DEFINITIONS.NET_001;
  }
  if (message.includes('unavailable') || message.includes('not available')) {
    return ERROR_DEFINITIONS.NET_002;
  }
  
  // Permission errors
  if (message.includes('permission') || message.includes('forbidden')) {
    return ERROR_DEFINITIONS.PERM_001;
  }
  
  // Validation errors
  if (message.includes('invalid') || message.includes('validation')) {
    return ERROR_DEFINITIONS.VAL_001;
  }
  
  // Rate limit errors
  if (message.includes('rate limit') || message.includes('too many')) {
    return ERROR_DEFINITIONS.RATE_001;
  }
  
  // Default to system error
  return ERROR_DEFINITIONS.SYS_001;
}

export function getErrorCode(error: Error): string {
  return classifyError(error).code;
}

export function getUserFriendlyError(error: Error): { message: string; steps: string[]; retryable: boolean } {
  const definition = classifyError(error);
  return {
    message: definition.userMessage,
    steps: definition.resolutionSteps,
    retryable: definition.retryable,
  };
}
