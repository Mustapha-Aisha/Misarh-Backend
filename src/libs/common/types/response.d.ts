export interface UpdateResponse {
    id: string;
    status: boolean;
}
export interface CreateResponse {
    id: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        pageSize: number;
        currentPage: number;
    };
}
export declare const success: (data: Record<string, any> | string, message?: string, meta?: any) => {
    status: string;
    message: string;
    data: string | Record<string, any>;
    meta: any;
};
export declare const failed: (message?: string, meta?: any) => {
    status: string;
    data: any;
    message: string;
    meta: any;
};
