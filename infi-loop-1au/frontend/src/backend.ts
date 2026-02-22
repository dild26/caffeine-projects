export type UserProfile = {
    username: string;
    role: string;
    joinedAt: bigint;
};

export interface _SERVICE {
    getCallerUserProfile(): Promise<UserProfile | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    canAccessAdminPages(): Promise<boolean>;
    canAccessFeaturesPage(): Promise<boolean>;
    checkGodsEyeNetAccess(): Promise<{ hasAccess: boolean; reason: string }>;
    checkAdvancedGodsEyeAccess(): Promise<{ hasAccess: boolean; reason: string }>;
    checkIPCameraAccess(): Promise<{ hasAccess: boolean; reason: string }>;
    getThemePreference(): Promise<string>;
    setThemePreference(theme: string): Promise<void>;
}
