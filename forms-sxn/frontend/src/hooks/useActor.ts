import { useState, useEffect, useMemo } from 'react';
import { BackendActor, FormSchema, FormSubmission, UserProfile, FieldType } from '../backend';

// Mock Data
let mockSchemas: FormSchema[] = [
    {
        id: 'schema-1',
        name: 'Customer Feedback',
        description: 'Collect customer feedback',
        fields: [
            {
                id: 'f1',
                fieldLabel: 'Name',
                fieldType: FieldType.text,
                helpText: 'Your full name',
                defaultValue: null,
                options: null,
                arrayCount: null,
                required: true,
                pattern: null,
                min: null,
                max: null,
                enumValues: null,
                units: null,
                rounding: null,
            },
            {
                id: 'f2',
                fieldLabel: 'Rating',
                fieldType: FieldType.number_,
                helpText: 'Rate us 1-5',
                defaultValue: null,
                options: null,
                arrayCount: null,
                required: true,
                pattern: null,
                min: 1,
                max: 5,
                enumValues: null,
                units: null,
                rounding: null,
            }
        ],
        validations: [],
        calculations: [],
        visibilityRules: [],
        createdBy: { toText: () => '2vxsx-fae' },
        createdAt: BigInt(Date.now()),
    }
];

let mockSubmissions: FormSubmission[] = [];
let mockUserProfile: UserProfile | null = {
    name: 'Dev User',
    email: 'dev@example.com',
    organization: 'Acme Corp',
    role: 'Admin'
};

export function useActor() {
    const [actor, setActor] = useState<BackendActor | null>(null);

    useEffect(() => {
        const mockActor: BackendActor = {
            initializeAccessControl: async () => { },
            getCallerUserRole: async () => ({ admin: null }),
            isCallerAdmin: async () => true,
            getCallerUserProfile: async () => mockUserProfile,
            saveCallerUserProfile: async (profile) => { mockUserProfile = profile; },
            getAllFormSchemas: async () => [...mockSchemas],
            getFormSchema: async (id) => mockSchemas.find(s => s.id === id) || null,
            createFormSchema: async (schema) => {
                mockSchemas.push(schema);
            },
            updateFormSchema: async (schema) => {
                const index = mockSchemas.findIndex(s => s.id === schema.id);
                if (index !== -1) mockSchemas[index] = schema;
            },
            deleteFormSchema: async (id) => {
                mockSchemas = mockSchemas.filter(s => s.id !== id);
            },
            submitForm: async (submission) => {
                mockSubmissions.push(submission);
            },
            getAllFormSubmissions: async () => [...mockSubmissions],
            getFormSubmission: async (id) => mockSubmissions.find(s => s.id === id) || null,
            getAuditLogs: async () => [],
            importJsonSchema: async (url) => 'schema-' + Date.now(),
        };
        setActor(mockActor);
    }, []);

    return { actor, isFetching: false };
}
