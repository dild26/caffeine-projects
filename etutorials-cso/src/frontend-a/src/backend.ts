export interface Theme {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
}

export interface NavigationItem {
    id: string;
    navLabel: string;
    url: string;
    parentId?: string;
    order: bigint;
    type: 'menu' | 'sitemap';
    children: NavigationItem[];
    isPublic: boolean;
}

export interface Resource {
    id: string;
    title: string;
    category: string;
    hashtags: string[];
    // Added fields based on usage in ResourcesPage.tsx
    feeUsd: number;
    feeRs: number;
    verified: boolean;
    topics: string[];
}

export interface Instructor {
    id: string;
    name: string;
    hashtags: string[];
}

export interface Learner {
    id: string;
    name: string;
}

export interface Appointment {
    id: string;
    instructorId: string;
    learnerId: string;
    time: string;
}

export interface UserProfile {
    id: string;
    username: string;
    themePreference: string;
}

// Actor interface
export interface BackendActor {
    getThemes: () => Promise<Theme[]>;
    getNavigationItems: () => Promise<NavigationItem[]>;
    addTheme: (theme: Theme) => Promise<void>;
    addNavigationItem: (item: NavigationItem) => Promise<void>;
    updateNavigationItem: (item: NavigationItem) => Promise<void>;
    deleteNavigationItem: (id: string) => Promise<void>;

    getResources: () => Promise<Resource[]>;
    searchResourcesByHashtag: (tag: string) => Promise<Resource[]>;
    getResourceMatrixByCategory: (category: string) => Promise<any>;
    addResource: (res: Resource) => Promise<void>;
    verifyResource: (id: string) => Promise<void>;

    getInstructors: () => Promise<Instructor[]>;
    searchInstructorsByHashtag: (tag: string) => Promise<Instructor[]>;
    addInstructor: (inst: Instructor) => Promise<void>;

    getLearners: () => Promise<Learner[]>;
    addLearner: (learner: Learner) => Promise<void>;

    getAppointments: () => Promise<Appointment[]>;
    bookAppointment: (apt: Appointment) => Promise<void>;

    getCallerUserProfile: () => Promise<UserProfile | null>;
    saveCallerUserProfile: (profile: UserProfile) => Promise<void>;
    updateCallerThemePreference: (themeId: string) => Promise<void>;

    syncContactPage: () => Promise<void>;
    isCallerAdmin: () => Promise<boolean>;
}
