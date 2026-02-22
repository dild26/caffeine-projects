import { useRef, useState } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import {
    BackendActor,
    SpecFormat,
    Theme,
    FileType,
    SubscriptionStatus,
    FileUploadStatus,
    ExternalBlob,
    ParsingError,
    Workflow,
    UserProfile,
    LogEntry,
    Referral,
    Fixture,
    Dashboard,
    SpecFile,
    ManifestLog,
    DeduplicationLog,
    Page,
    SecoinfiApp,
    SitemapAuditLog
} from '../backend';

// Re-export enums for compatibility if needed, though best to import from backend.ts
export { SpecFormat, Theme, FileType, SubscriptionStatus, FileUploadStatus };

export function useActor() {
    const { identity } = useInternetIdentity();
    const [isFetching, setIsFetching] = useState(false);

    // Mock actor implementation
    const actor = useRef<BackendActor>({
        getCallerUserProfile: async () => null,
        saveCallerUserProfile: async (profile) => { },
        isCallerAdmin: async () => true,
        getPublicWorkflows: async () => [],
        getWorkflows: async () => [],
        addWorkflow: async (workflow) => { console.log("Mock addWorkflow", workflow); },
        getLogs: async () => [],
        getReferrals: async () => [],
        getParsingErrors: async () => [],
        logParsingError: async (error) => { console.log("Mock logParsingError", error); },
        applySuggestedFix: async (fileName, fix) => { },
        getFixtures: async () => [],
        addFixture: async (fixture) => { },
        updateFixtureStatus: async (fixtureId, status) => { },
        getAdminDashboard: async () => ({ totalWorkflows: 0, activeUsers: 0, totalExecutions: 0 }),
        getSpecFiles: async () => [],
        addSpecFile: async (specFile) => { },
        updateSpecFileStatus: async (specFileId, status, conversionLog) => { },
        convertSpecMdToMl: async (specFileId) => { },
        validateSpecFile: async (specFileId) => { },
        promoteSpecFileToLeaderboard: async (specFileId) => { },
        processSpecFile: async (specFileId) => { },
        getManifestLogs: async () => [],
        addManifestLog: async (manifestLog) => { },
        updateManifestLogStatus: async (manifestLogId, status, errors, schemaCompliance, conversionLog) => { },
        getDeduplicationLogs: async () => [],
        runDeduplicationCheck: async () => { },
        deduplicateSpecFiles: async (fileIds) => { },
        getDeduplicationStatistics: async () => ({
            totalSpecFiles: 0n,
            duplicateGroups: 0n,
            normalizedFiles: 0n,
            pendingDeduplication: 0n
        }),
        compareSchemaRevisions: async (fileId1, fileId2) => null,
        normalizeSpecFile: async (specFileId) => { },
        getPages: async () => [],
        getSitemap: async () => ({ autoRoutes: [], adminPages: [], appRoutes: [] }),
        addPage: async (slug, title, description, priority) => { },
        getSecoinfiApps: async () => [],
        addSecoinfiApp: async (app) => { },
        assignRoutesToApp: async (appSlug, routes) => { },
        getSitemapAuditLogs: async () => [],
    });

    return { actor: actor.current, isFetching };
}
