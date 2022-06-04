import { UserRole } from "../enums/user.enum";
import { BaseUser } from "./base-user.model";

export interface User extends BaseUser {
    role: UserRole
}