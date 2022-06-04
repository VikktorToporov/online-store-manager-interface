import { Client } from "./client.model";

export interface BankAccount {
    id: string;

    bankName: string;

    number: string;

    client: Client;
}