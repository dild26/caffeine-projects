export interface CaffeineProject {
    id: string;          // Extracted project slug (e.g., 'etutorial-lgc')
    url: string;         // Full URL
    port: number;        // Auto-assigned port
    status: 'active' | 'archived' | 'maintenance' | 'disabled';
}

/**
 * Single Source of Truth for Caffeine Projects.
 * DO NOT MODIFY MANUALLY (unless adding new rows).
 * Use `pnpm run caffeine:manage` to sync.
 */
export const projects: CaffeineProject[] = [
    { id: "etutorial-lgc", url: "https://etutorial-lgc.caffeine.xyz/", port: 3001, status: "active" },
    { id: "etutorials-cso", url: "https://etutorials-cso.caffeine.xyz/", port: 3002, status: "active" },
    { id: "secoin-ep6", url: "https://secoin-ep6.caffeine.xyz/", port: 3003, status: "active" },
    { id: "sec-epay-am0", url: "https://sec-epay-am0.caffeine.xyz/", port: 3004, status: "active" },
    { id: "voice-invoice-au1", url: "https://voice-invoice-au1.caffeine.xyz/", port: 3005, status: "active" },
    { id: "ia-niqaw-947", url: "https://ia-niqaw-947.caffeine.xyz/", port: 3006, status: "active" },
    { id: "multi-apps-unify-app-hbc", url: "https://multi-apps-unify-app-hbc.caffeine.xyz/", port: 3007, status: "active" },
    { id: "moap-app-6ag", url: "https://moap-app-6ag.caffeine.xyz/", port: 3008, status: "active" },
    { id: "networth-htm", url: "https://networth-htm.caffeine.xyz/", port: 3009, status: "active" },
    { id: "n8n-workflows-6sy", url: "https://n8n-workflows-6sy.caffeine.xyz/", port: 3010, status: "active" },
    { id: "e-contract-lwf", url: "https://e-contract-lwf.caffeine.xyz/", port: 3011, status: "active" },
    { id: "n8n-tasks-c2i", url: "https://n8n-tasks-c2i.caffeine.xyz/", port: 3012, status: "active" },
    { id: "forms-sxn", url: "https://forms-sxn.caffeine.xyz/", port: 3013, status: "active" },
    { id: "e-contracts-bqe", url: "https://e-contracts-bqe.caffeine.xyz/", port: 3014, status: "active" },
    { id: "terror-uproot-97d", url: "https://terror-uproot-97d.caffeine.xyz/", port: 3015, status: "active" },
    { id: "sitemaps-fwh", url: "https://sitemaps-fwh.caffeine.xyz/", port: 3016, status: "active" },
    { id: "sitemap-hub-sy0", url: "https://sitemap-hub-sy0.caffeine.xyz/", port: 3017, status: "active" },
    { id: "sitemap-nya", url: "https://sitemap-nya.caffeine.xyz/", port: 3018, status: "active" },
    { id: "sitemap-subs-app-j3h", url: "https://sitemap-subs-app-j3h.caffeine.xyz/", port: 3019, status: "active" },
    { id: "trends-63c", url: "https://trends-63c.caffeine.xyz/", port: 3020, status: "active" },
    { id: "trends-d1l", url: "https://trends-d1l.caffeine.xyz/", port: 3021, status: "active" },
    { id: "xcaller-0aw", url: "https://xcaller-0aw.caffeine.xyz/", port: 3022, status: "active" },
    { id: "infi-loop-1au", url: "https://infi-loop-1au.caffeine.xyz/", port: 3023, status: "active" },
    { id: "infytask-mia", url: "https://infytask-mia.caffeine.xyz/", port: 3024, status: "active" },
    { id: "sec-build-0bj", url: "https://sec-build-0bj.caffeine.xyz/", port: 3025, status: "active" },
    { id: "map-56b", url: "https://map-56b.caffeine.xyz/", port: 3026, status: "active" },
    { id: "key-unlock-5hx", url: "https://key-unlock-5hx.caffeine.xyz/", port: 3027, status: "active" },
    { id: "ipfs-lrm", url: "https://ipfs-lrm.caffeine.xyz/", port: 3028, status: "active" },
    { id: "yo-data-app-o7u", url: "https://yo-data-app-o7u.caffeine.xyz/", port: 3029, status: "active" },
    { id: "sec-jewelry-j03", url: "https://sec-jewelry-j03.caffeine.xyz/", port: 3030, status: "active" },
    { id: "sudeep-hotels-eu8", url: "https://sudeep-hotels-eu8.caffeine.xyz/", port: 3031, status: "active" },
    { id: "op-hotels-rests-ae0", url: "https://op-hotels-rests-ae0.caffeine.xyz/", port: 3032, status: "active" },
    { id: "sitemap-hub-fe2", url: "https://sitemap-hub-fe2.caffeine.xyz/", port: 3033, status: "active" },
    { id: "geo-map-w9s", url: "https://geo-map-w9s.caffeine.xyz/", port: 3034, status: "active" },
    // NOTE: icp-cloud-storage-hvk is now assigned port 3035 in this list.
    { id: "icp-cloud-storage-hvk", url: "https://icp-cloud-storage-hvk.caffeine.xyz/", port: 3035, status: "active" },
    { id: "golden-sec-vri", url: "https://golden-sec-vri.caffeine.xyz/", port: 3036, status: "active" },
    { id: "evolved-ai-o6e", url: "https://evolved-ai-o6e.caffeine.xyz/", port: 3037, status: "active" },
    { id: "pvt-projects-7wo", url: "https://pvt-projects-7wo.caffeine.xyz/", port: 3038, status: "active" },
    { id: "our-schemes-goi-nyl", url: "https://our-schemes-goi-nyl.caffeine.xyz/", port: 3039, status: "active" },
    { id: "openr-models-vs-4u0", url: "https://openr-models-vs-4u0.caffeine.xyz/", port: 3040, status: "active" },
];
