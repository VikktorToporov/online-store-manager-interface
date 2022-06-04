export interface BaseUser {
    id: string;

    username: string;

    email: string;

    password: string;
    
    active: boolean;

    dtype: string;
}