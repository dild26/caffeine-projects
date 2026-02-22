import { useMemo } from 'react';
import type {
    BackendActor,
    Theme,
    NavigationItem,
    Resource,
    Instructor,
    Learner,
    Appointment,
    UserProfile
} from '../backend';

// Mock data storage
let mockThemes: Theme[] = [];
let mockNavItems: NavigationItem[] = [];
let mockResources: Resource[] = [
    {
        id: 'res-1',
        title: 'Advanced React Patterns',
        category: 'development',
        hashtags: ['react', 'frontend'],
        feeUsd: 49.99,
        feeRs: 4500,
        verified: true,
        topics: ['Hooks', 'Context', 'Performance']
    },
    {
        id: 'res-2',
        title: 'System Design Interview Guide',
        category: 'career',
        hashtags: ['interview', 'system-design'],
        feeUsd: 79.00,
        feeRs: 7100,
        verified: false,
        topics: ['Scalability', 'Distributed Systems']
    }
];
let mockInstructors: Instructor[] = [];
let mockLearners: Learner[] = [];
let mockAppointments: Appointment[] = [];
let mockUserProfile: UserProfile | null = { id: 'mock-user', username: 'Guest', themePreference: 'vibgyor' };

export function useActor() {
    const actor = useMemo<BackendActor>(() => ({
        getThemes: async () => [...mockThemes],
        getNavigationItems: async () => [...mockNavItems],
        addTheme: async (theme: Theme) => { mockThemes.push(theme); },
        addNavigationItem: async (item: NavigationItem) => { mockNavItems.push(item); },
        updateNavigationItem: async (item: NavigationItem) => { /* mock update */ },
        deleteNavigationItem: async (id: string) => { /* mock delete */ },

        getResources: async () => [...mockResources],
        searchResourcesByHashtag: async () => [],
        getResourceMatrixByCategory: async () => ({}),
        addResource: async (res: Resource) => { mockResources.push(res); },
        verifyResource: async (id: string) => { /* mock verify */ },

        getInstructors: async () => [...mockInstructors],
        searchInstructorsByHashtag: async () => [],
        addInstructor: async (inst: Instructor) => { mockInstructors.push(inst); },

        getLearners: async () => [...mockLearners],
        addLearner: async (learner: Learner) => { mockLearners.push(learner); },

        getAppointments: async () => [...mockAppointments],
        bookAppointment: async (apt: Appointment) => { mockAppointments.push(apt); },

        getCallerUserProfile: async () => mockUserProfile,
        saveCallerUserProfile: async (profile: UserProfile) => { mockUserProfile = profile; },
        updateCallerThemePreference: async (themeId: string) => { if (mockUserProfile) mockUserProfile.themePreference = themeId; },

        syncContactPage: async () => { /* mock sync */ },
        isCallerAdmin: async () => true,
    }), []);

    return { actor, isFetching: false };
}
