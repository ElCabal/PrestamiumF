
export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    documentNumber: string;
    phone: string;
    address?: string;
    email?: string;
    status: boolean;
}

export interface ClientRequest {
    firstName: string;
    lastName: string;
    documentNumber: string;
    phone: string;
    address?: string;
    email?: string;
}