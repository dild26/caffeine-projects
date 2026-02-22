export interface Scheme {
    id: bigint;
    name: string;
    ministry: string;
    category: string;
    description: string;
    tags: string[];
    sourceUrl: string;
}

export interface PaginatedSchemes {
    schemes: Scheme[];
    totalItems: bigint;
    totalPages: bigint;
    currentPage: bigint;
}

export interface BackendActor {
    searchSchemes: (
        searchText: string,
        ministryFilter: string | null,
        categoryFilter: string | null,
        page: bigint,
        pageSize: bigint
    ) => Promise<PaginatedSchemes>;
}

const MOCK_SCHEMES: Scheme[] = [
    {
        id: 1n,
        name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
        ministry: "Ministry of Finance",
        category: "Financial Assistance",
        description: "National Mission for Financial Inclusion to ensure access to financial services, namely, savings and deposit accounts, remittance, credit, insurance, pension in an affordable manner.",
        tags: ["Banking", "Savings", "Insurance"],
        sourceUrl: "https://pmjdy.gov.in/"
    },
    {
        id: 2n,
        name: "Pradhan Mantri Awas Yojana (PMAY)",
        ministry: "Ministry of Urban Development",
        category: "Social Welfare",
        description: "Mission to provide 'Housing for All' in urban areas. Provides assistance to implementing agencies through States/Union Territories and Central Nodal Agencies.",
        tags: ["Housing", "Urban Development", "Subsidy"],
        sourceUrl: "https://pmay-urban.gov.in/"
    },
    {
        id: 3n,
        name: "Ayushman Bharat - PMJAY",
        ministry: "Ministry of Health",
        category: "Healthcare",
        description: "The world's largest health insurance/ assurance scheme fully financed by the government. It provides a cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.",
        tags: ["Health", "Insurance", "Medical"],
        sourceUrl: "https://pmjay.gov.in/"
    },
    {
        id: 4n,
        name: "PM-Kisan Samman Nidhi",
        ministry: "Ministry of Agriculture",
        category: "Agriculture",
        description: "A central sector scheme that provides income support to all landholding farmers' families in the country to supplement their financial needs for procuring various inputs.",
        tags: ["Agriculture", "Income Support", "Farmers"],
        sourceUrl: "https://pmkisan.gov.in/"
    },
    {
        id: 5n,
        name: "Skill India Mission",
        ministry: "Ministry of Education",
        category: "Employment",
        description: "A mission launched to create and implement comprehensive skill development training programs that would help bridge the gap between industry demands and skill availability.",
        tags: ["Skills", "Employment", "Training"],
        sourceUrl: "https://www.skillindia.gov.in/"
    }
];

export const mockBackend: BackendActor = {
    searchSchemes: async (searchText, ministryFilter, categoryFilter, page, pageSize) => {
        let filtered = MOCK_SCHEMES.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchText.toLowerCase()) ||
                s.description.toLowerCase().includes(searchText.toLowerCase());
            const matchesMinistry = !ministryFilter || s.ministry === ministryFilter;
            const matchesCategory = !categoryFilter || s.category === categoryFilter;
            return matchesSearch && matchesMinistry && matchesCategory;
        });

        const start = Number(page) * Number(pageSize);
        const paginated = filtered.slice(start, start + Number(pageSize));

        return {
            schemes: paginated,
            totalItems: BigInt(filtered.length),
            totalPages: BigInt(Math.ceil(filtered.length / Number(pageSize))),
            currentPage: page
        };
    }
};
