import { Principal } from "@dfinity/principal";

export type Time = bigint;

export enum Status {
    checking = "checking",
    completed = "completed",
    failed = "failed",
}

export interface Product {
    id: bigint;
    name: string;
    description: string;
    price: bigint;
    category: string;
    image: string;
}

export interface Category {
    name: string;
    description: string;
    image: string | null;
    productCount: bigint;
}

export interface PaginationResult {
    items: Product[];
    totalItems: bigint;
    totalPages: bigint;
    currentPage: bigint;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginationResult_1 {
    items: Category[];
    totalItems: bigint;
    totalPages: bigint;
    currentPage: bigint;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface Actor {
    isAdmin(): Promise<boolean>;
    getProducts(page: bigint, limit: bigint): Promise<PaginationResult>;
    getProductsByCategory(category: string, page: bigint, limit: bigint): Promise<PaginationResult>;
    getAllCategories(): Promise<string[]>;
    getCategories(page: bigint, limit: bigint): Promise<PaginationResult_1>;
    getTransactions(): Promise<Array<[string, Status]>>;
    getTransactionsByPrincipal(): Promise<Array<[string, Status]>>;
    addProduct(name: string, description: string, price: bigint, category: string, image: string): Promise<void>;
    editProduct(id: bigint, name: string, description: string, price: bigint, category: string, image: string | null): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    addCategory(name: string, description: string, image: string | null): Promise<void>;
    deleteCategory(name: string): Promise<void>;
    clearAllProducts(): Promise<void>;
    clearAllCategories(): Promise<void>;
    deleteTransaction(sessionId: string): Promise<void>;
    clearAllTransactions(): Promise<void>;
    addTransaction(sessionId: string): Promise<any>;
    getTransactionLineItems(sessionId: string, startingAfter: string | null): Promise<any>;
    getTransaction(sessionId: string): Promise<Status | undefined>;
    setAuthorization(apiKey: string): Promise<void>;
    createCheckoutSession(lineItems: Array<{ product_id: bigint, quantity: bigint }>, successUrl: string, cancelUrl: string): Promise<any>;
    setUser(name: string): Promise<void>;
    getUser(): Promise<string | undefined>;
    addAdmin(principal: Principal): Promise<void>;
    removeAdmin(principal: Principal): Promise<void>;
    getAdmins(): Promise<Principal[]>;
    getAllowedOrigins(): Promise<string[]>;
    addAllowedOrigin(origin: string): Promise<void>;
    removeAllowedOrigin(origin: string): Promise<void>;
}
