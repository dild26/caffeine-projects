/**
 * Automated Backup Scheduling System
 * Supports incremental and full backups with compression and encryption
 */

import type { BackupSchedule, BackupManifest } from '../types';

const SCHEDULE_STORAGE_KEY = 'backup_schedules';
const MANIFEST_STORAGE_KEY = 'backup_manifests';

// Get all backup schedules
export function getBackupSchedules(): BackupSchedule[] {
  try {
    const stored = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!stored) return getDefaultSchedules();
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load backup schedules:', error);
    return getDefaultSchedules();
  }
}

// Get default backup schedules
function getDefaultSchedules(): BackupSchedule[] {
  const now = Date.now() * 1000000;
  const oneHour = 3600 * 1000 * 1000000;
  const oneDay = 24 * oneHour;
  const oneWeek = 7 * oneDay;
  
  return [
    {
      id: 'incremental_hourly',
      type: 'incremental',
      frequency: 'hourly',
      enabled: true,
      nextRun: BigInt(now + oneHour),
      retentionDays: 7,
      compressionEnabled: true,
      encryptionEnabled: true,
      replicaCount: 3,
    },
    {
      id: 'incremental_daily',
      type: 'incremental',
      frequency: 'daily',
      enabled: true,
      nextRun: BigInt(now + oneDay),
      retentionDays: 30,
      compressionEnabled: true,
      encryptionEnabled: true,
      replicaCount: 3,
    },
    {
      id: 'full_weekly',
      type: 'full',
      frequency: 'weekly',
      enabled: true,
      nextRun: BigInt(now + oneWeek),
      retentionDays: 90,
      compressionEnabled: true,
      encryptionEnabled: true,
      replicaCount: 3,
    },
  ];
}

// Save backup schedules
export function saveBackupSchedules(schedules: BackupSchedule[]): void {
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error('Failed to save backup schedules:', error);
  }
}

// Update a specific schedule
export function updateBackupSchedule(schedule: BackupSchedule): void {
  const schedules = getBackupSchedules();
  const index = schedules.findIndex(s => s.id === schedule.id);
  if (index !== -1) {
    schedules[index] = schedule;
    saveBackupSchedules(schedules);
  }
}

// Get all backup manifests
export function getBackupManifests(): BackupManifest[] {
  try {
    const stored = localStorage.getItem(MANIFEST_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load backup manifests:', error);
    return [];
  }
}

// Save backup manifest
export function saveBackupManifest(manifest: BackupManifest): void {
  try {
    const manifests = getBackupManifests();
    manifests.push(manifest);
    
    // Keep only recent manifests (last 100)
    const sorted = manifests.sort((a, b) => Number(b.timestamp - a.timestamp));
    const trimmed = sorted.slice(0, 100);
    
    localStorage.setItem(MANIFEST_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save backup manifest:', error);
  }
}

// Check if any backup is due
export function getSchedulesDue(): BackupSchedule[] {
  const schedules = getBackupSchedules();
  const now = BigInt(Date.now() * 1000000);
  
  return schedules.filter(s => s.enabled && s.nextRun <= now);
}

// Calculate next run time
export function calculateNextRun(schedule: BackupSchedule): bigint {
  const now = Date.now() * 1000000;
  const oneHour = 3600 * 1000 * 1000000;
  const oneDay = 24 * oneHour;
  const oneWeek = 7 * oneDay;
  
  switch (schedule.frequency) {
    case 'hourly':
      return BigInt(now + oneHour);
    case 'daily':
      return BigInt(now + oneDay);
    case 'weekly':
      return BigInt(now + oneWeek);
    default:
      return BigInt(now + oneDay);
  }
}

// Clean up old backups based on retention policy
export function cleanupOldBackups(): number {
  const manifests = getBackupManifests();
  const now = Date.now() * 1000000;
  let removed = 0;
  
  const filtered = manifests.filter(manifest => {
    const schedule = getBackupSchedules().find(s => s.type === manifest.type);
    if (!schedule) return true;
    
    const retentionPeriod = BigInt(schedule.retentionDays * 24 * 3600 * 1000 * 1000000);
    const age = BigInt(now) - manifest.timestamp;
    
    if (age > retentionPeriod) {
      removed++;
      return false;
    }
    return true;
  });
  
  if (removed > 0) {
    localStorage.setItem(MANIFEST_STORAGE_KEY, JSON.stringify(filtered));
  }
  
  return removed;
}

// Get backup statistics
export function getBackupStatistics(): {
  totalBackups: number;
  incrementalBackups: number;
  fullBackups: number;
  totalSize: bigint;
  lastBackup?: BackupManifest;
  nextScheduled?: BackupSchedule;
} {
  const manifests = getBackupManifests();
  const schedules = getBackupSchedules();
  
  const incrementalBackups = manifests.filter(m => m.type === 'incremental').length;
  const fullBackups = manifests.filter(m => m.type === 'full').length;
  const totalSize = manifests.reduce((sum, m) => sum + m.size, BigInt(0));
  
  const sortedManifests = [...manifests].sort((a, b) => Number(b.timestamp - a.timestamp));
  const lastBackup = sortedManifests[0];
  
  const enabledSchedules = schedules.filter(s => s.enabled);
  const sortedSchedules = [...enabledSchedules].sort((a, b) => Number(a.nextRun - b.nextRun));
  const nextScheduled = sortedSchedules[0];
  
  return {
    totalBackups: manifests.length,
    incrementalBackups,
    fullBackups,
    totalSize,
    lastBackup,
    nextScheduled,
  };
}

