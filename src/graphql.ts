
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum OrderDirection {
    asc = "asc",
    desc = "desc"
}

export enum UsersOrderBy {
    username = "username",
    createdAt = "createdAt",
    email = "email"
}

export enum CompaniesOrderBy {
    name = "name",
    legalName = "legalName",
    createdAt = "createdAt"
}

export class PaginationArgs {
    skip: number;
    take: number;
}

export class OrderListUsers {
    direction: OrderDirection;
    orderBy: UsersOrderBy;
}

export class FilterListUsers {
    omni?: Nullable<string>;
    isValid?: Nullable<boolean>;
}

export class OrderListCompanies {
    direction: OrderDirection;
    orderBy: CompaniesOrderBy;
}

export class FilterListCompanies {
    omni?: Nullable<string>;
}

export class UpdateStatusUserInput {
    userId: string;
    status: boolean;
}

export class UpdateUserInput {
    userId?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
}

export class ChangePasswordInput {
    oldPassword: string;
    newPassword: string;
}

export class SignupInput {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    isCompanyAccount: boolean;
}

export class LoginInput {
    email: string;
    password: string;
}

export class LoginLinkAccessInput {
    email: string;
}

export class RequestConfirmEmailInput {
    email: string;
}

export class ResetPasswordInput {
    newPassword: string;
    token: string;
}

export class RequestResetPasswordInput {
    email: string;
}

export class CreateCompanyInput {
    name: string;
    legalName: string;
    registrationNumber: string;
    establishedDate: DateTime;
    businessType: string;
    ownership: string;
    companyStage: string;
    branches: number;
    numberOfemployees: number;
    transactions: number;
}

export class CreateCompanyGeneralInput {
    name: string;
    legalName: string;
    registrationNumber: string;
    establishedDate: DateTime;
    businessType: string;
    ownership: string;
    companyStage: string;
}

export class CreateCompanyAddressInput {
    id: string;
    country: string;
    city: string;
    state?: Nullable<string>;
    zipCode: string;
    address1: string;
    address2: string;
}

export class User {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    firstName: string;
    lastName: string;
    email: string;
    isValid: boolean;
    isSuperuser?: Nullable<boolean>;
    confirm: boolean;
    isAdmin: boolean;
}

export class UserEdge {
    cursor: string;
    node: User;
}

export class UserPaginated {
    edges?: Nullable<UserEdge[]>;
    nodes?: Nullable<User[]>;
    totalCount: number;
    hasNextPage: boolean;
}

export class Token {
    accessToken: string;
    refreshToken: string;
}

export class Auth {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export class GeneralCompany {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
    legalName: string;
    registrationNumber: string;
    establishedDate: DateTime;
    businessType: string;
    ownership: string;
    companyStage: string;
}

export class Company {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name: string;
    legalName: string;
    registrationNumber: string;
    establishedDate: DateTime;
    businessType: string;
    ownership: string;
    companyStage: string;
    country: string;
    city: string;
    state: string;
    zipCode: string;
    address1: string;
    address2: string;
}

export class CompanyEdge {
    cursor: string;
    node: Company;
}

export class CompanyPaginated {
    edges?: Nullable<CompanyEdge[]>;
    nodes?: Nullable<Company[]>;
    totalCount: number;
    hasNextPage: boolean;
}

export abstract class IQuery {
    abstract listUsers(paginate?: Nullable<PaginationArgs>, order?: Nullable<OrderListUsers>, filter?: Nullable<FilterListUsers>): UserPaginated | Promise<UserPaginated>;

    abstract me(): User | Promise<User>;

    abstract getUser(userId: string): User | Promise<User>;

    abstract companies(paginate?: Nullable<PaginationArgs>, order?: Nullable<OrderListCompanies>, filter?: Nullable<FilterListCompanies>): CompanyPaginated | Promise<CompanyPaginated>;
}

export abstract class IMutation {
    abstract updateStatusUser(data: UpdateStatusUserInput): User | Promise<User>;

    abstract updateUser(data: UpdateUserInput): User | Promise<User>;

    abstract changePassword(data: ChangePasswordInput): User | Promise<User>;

    abstract signup(data: SignupInput): Auth | Promise<Auth>;

    abstract login(data: LoginInput): Auth | Promise<Auth>;

    abstract loginLinkAccess(data: LoginLinkAccessInput): boolean | Promise<boolean>;

    abstract refreshToken(token: string): Token | Promise<Token>;

    abstract confirmEmail(token: string): Token | Promise<Token>;

    abstract requestConfirmEmail(data: RequestConfirmEmailInput): boolean | Promise<boolean>;

    abstract resetPassword(data: ResetPasswordInput): Token | Promise<Token>;

    abstract requestResetPassword(data: RequestResetPasswordInput): boolean | Promise<boolean>;

    abstract createCompany(data: CreateCompanyInput): Company | Promise<Company>;

    abstract createCompanyGeneralInfo(data: CreateCompanyGeneralInput): GeneralCompany | Promise<GeneralCompany>;

    abstract createCompanyAddress(data: CreateCompanyAddressInput): GeneralCompany | Promise<GeneralCompany>;
}

export type DateTime = any;
type Nullable<T> = T | null;
