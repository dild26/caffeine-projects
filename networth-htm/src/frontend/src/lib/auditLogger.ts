// Structured JSON logging system with correlation IDs for audit-ready operations

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
export type OperationType = 
  | 'property_management' 
  | 'blog_operation' 
  | 'authentication' 
  | 'payment_processing'
  | 'node_management'
  | 'feature_tracking'
  | 'data_integrity'
  | 'system_health';

export interface AuditLogEntry {
  timestamp: string;
  correlationId: string;
  level: LogLevel;
  operationType: OperationType;
  operation: string;
  userId?: string;
  metadata?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
  performance?: {
    duration: number;
    startTime: number;
    endTime: number;
  };
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxLogs = 1000;

  generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  log(entry: Omit<AuditLogEntry, 'timestamp' | 'correlationId'> & { correlationId?: string }): string {
    const correlationId = entry.correlationId || this.generateCorrelationId();
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      correlationId,
    };

    this.logs.push(logEntry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with structured format
    const consoleMethod = entry.level === 'error' || entry.level === 'critical' ? 'error' : 
                         entry.level === 'warn' ? 'warn' : 'log';
    console[consoleMethod]('[AUDIT]', JSON.stringify(logEntry, null, 2));

    return correlationId;
  }

  debug(operationType: OperationType, operation: string, metadata?: Record<string, any>, correlationId?: string): string {
    return this.log({ level: 'debug', operationType, operation, metadata, correlationId });
  }

  info(operationType: OperationType, operation: string, metadata?: Record<string, any>, correlationId?: string): string {
    return this.log({ level: 'info', operationType, operation, metadata, correlationId });
  }

  warn(operationType: OperationType, operation: string, metadata?: Record<string, any>, correlationId?: string): string {
    return this.log({ level: 'warn', operationType, operation, metadata, correlationId });
  }

  error(operationType: OperationType, operation: string, error: Error, metadata?: Record<string, any>, correlationId?: string): string {
    return this.log({
      level: 'error',
      operationType,
      operation,
      metadata,
      correlationId,
      error: {
        code: (error as any).code || 'UNKNOWN_ERROR',
        message: error.message,
        stack: error.stack,
      },
    });
  }

  critical(operationType: OperationType, operation: string, error: Error, metadata?: Record<string, any>, correlationId?: string): string {
    return this.log({
      level: 'critical',
      operationType,
      operation,
      metadata,
      correlationId,
      error: {
        code: (error as any).code || 'CRITICAL_ERROR',
        message: error.message,
        stack: error.stack,
      },
    });
  }

  startOperation(operationType: OperationType, operation: string, metadata?: Record<string, any>): { correlationId: string; startTime: number } {
    const correlationId = this.generateCorrelationId();
    const startTime = Date.now();
    
    this.info(operationType, `${operation} - START`, { ...metadata, startTime }, correlationId);
    
    return { correlationId, startTime };
  }

  endOperation(
    operationType: OperationType,
    operation: string,
    correlationId: string,
    startTime: number,
    success: boolean,
    metadata?: Record<string, any>
  ): void {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    this.log({
      level: success ? 'info' : 'warn',
      operationType,
      operation: `${operation} - END`,
      correlationId,
      metadata: { ...metadata, success },
      performance: { duration, startTime, endTime },
    });
  }

  getLogs(filter?: { level?: LogLevel; operationType?: OperationType; limit?: number }): AuditLogEntry[] {
    let filtered = [...this.logs];
    
    if (filter?.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }
    
    if (filter?.operationType) {
      filtered = filtered.filter(log => log.operationType === filter.operationType);
    }
    
    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }
    
    return filtered;
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const auditLogger = new AuditLogger();
