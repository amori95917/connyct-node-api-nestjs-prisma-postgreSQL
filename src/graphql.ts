
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum BranchType {
    CORPORATE = "CORPORATE",
    BRANCH_OFFICE = "BRANCH_OFFICE"
}

export enum OrderDirection {
    asc = "asc",
    desc = "desc"
}

export enum CommentOrderBy {
    createdAt = "createdAt"
}

export enum RatingStatus {
    NEUTRAL = "NEUTRAL",
    UPVOTED = "UPVOTED",
    DOWNVOTED = "DOWNVOTED"
}

export enum UsersOrderBy {
    username = "username",
    createdAt = "createdAt",
    email = "email"
}

export enum FollowedCompanyOrderBy {
    createdAt = "createdAt"
}

export enum CompaniesOrderBy {
    name = "name",
    legalName = "legalName",
    createdAt = "createdAt"
}

export enum TagOrderBy {
    createdAt = "createdAt"
}

export enum ReactionsOrderBy {
    createdAt = "createdAt"
}

export enum CommentReactionsOrderBy {
    createdAt = "createdAt"
}

export class PaginationArgs {
    skip: number;
    take: number;
}

export class OrderCommentsList {
    direction: OrderDirection;
    orderBy: CommentOrderBy;
}

export class OrderListUsers {
    direction: OrderDirection;
    orderBy: UsersOrderBy;
}

export class FilterListUsers {
    omni?: Nullable<string>;
    isValid?: Nullable<boolean>;
}

export class OrderFollowedCompanyList {
    direction: OrderDirection;
    orderBy: FollowedCompanyOrderBy;
}

export class OrderListCompanies {
    direction: OrderDirection;
    orderBy: CompaniesOrderBy;
}

export class FilterListCompanies {
    omni?: Nullable<string>;
}

export class OrderTagList {
    direction: OrderDirection;
    orderBy: TagOrderBy;
}

export class TagQuery {
    name?: Nullable<string>;
}

export class ReactionsOrderList {
    direction: OrderDirection;
    orderBy: ReactionsOrderBy;
}

export class CommentReactionsOrderList {
    direction: OrderDirection;
    orderBy?: Nullable<CommentReactionsOrderBy>;
}

export class UpdateStatusUserInput {
    userId: string;
    status: boolean;
}

export class UpdateUserInput {
    userId?: Nullable<string>;
    fullName?: Nullable<string>;
}

export class ChangePasswordInput {
    oldPassword: string;
    newPassword: string;
}

export class SignupInput {
    fullName?: Nullable<string>;
    email: string;
    password: string;
    isCompanyAccount?: Nullable<boolean>;
    legalName?: Nullable<string>;
}

export class LoginInput {
    emailOrUsername: string;
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

export class CompanyEditInput {
    legalName?: Nullable<string>;
    name?: Nullable<string>;
    registrationNumber: string;
    establishedDate: DateTime;
    companyStage?: Nullable<string>;
    description?: Nullable<string>;
    mission?: Nullable<string>;
    vision?: Nullable<string>;
    ownership?: Nullable<string>;
    contactEmail: string;
    numberOfemployees?: Nullable<number>;
    transactions?: Nullable<number>;
    website?: Nullable<string>;
    contactNumber?: Nullable<string>;
    slogan?: Nullable<string>;
}

export class CompanyBranchInput {
    type: BranchType;
    name?: Nullable<string>;
    contactEmail: string;
    contactNumber: string;
    country?: Nullable<string>;
    city?: Nullable<string>;
    zipCode?: Nullable<string>;
    state?: Nullable<string>;
    street1?: Nullable<string>;
    street2?: Nullable<string>;
}

export class CompanyBranchEditInput {
    type?: Nullable<BranchType>;
    name?: Nullable<string>;
    contactEmail?: Nullable<string>;
    contactNumber?: Nullable<string>;
    country?: Nullable<string>;
    city?: Nullable<string>;
    zipCode?: Nullable<string>;
    state?: Nullable<string>;
    street1?: Nullable<string>;
    street2?: Nullable<string>;
}

export class CreatePostInput {
    text: string;
    tags?: Nullable<string[]>;
    metaTitle?: Nullable<string>;
    description?: Nullable<string>;
}

export class UpdatePostInput {
    text: string;
    tags?: Nullable<string[]>;
    metaTitle?: Nullable<string>;
    description?: Nullable<string>;
}

export class CreateCommentInput {
    text: string;
}

export class CreateMentionsInput {
    mentionIds?: Nullable<string[]>;
}

export class InvitedEmployeeInput {
    invitedEmail: string;
    role: string;
}

export class UserEmployeeInput {
    isInviteAccepted: boolean;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

export class FollowCompanyInput {
    followedToId: string;
}

export class UnfollowCompanyInput {
    companyId: string;
}

export class FollowUserToUserInput {
    followedToID: string;
}

export class UnfollowUserInput {
    userId: string;
}

export class IndustryInput {
    type: string;
    description?: Nullable<string>;
}

export class LikesInput {
    postId: string;
    reactionType: string;
}

export class CommentReactionsInput {
    reactionType: string;
    commentId: string;
}

export interface MutationPayload {
    errors?: Nullable<UserError[]>;
}

export class Branch {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name?: Nullable<string>;
    type: BranchType;
    contactEmail: string;
    contactNumber: string;
    country: string;
    city: string;
    zipCode?: Nullable<string>;
    state?: Nullable<string>;
    street1?: Nullable<string>;
    street2?: Nullable<string>;
}

export class Company {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    name?: Nullable<string>;
    legalName: string;
    registrationNumber?: Nullable<string>;
    establishedDate?: Nullable<DateTime>;
    companyStage?: Nullable<string>;
    description?: Nullable<string>;
    ownership?: Nullable<string>;
    mission?: Nullable<string>;
    vision?: Nullable<string>;
    addresses?: Nullable<JSON>;
    numberOfemployees?: Nullable<number>;
    contactEmail?: Nullable<string>;
    transactions?: Nullable<number>;
    isActive?: Nullable<boolean>;
    isVerified?: Nullable<boolean>;
    ownerId?: Nullable<string>;
    website?: Nullable<string>;
    contactNumber?: Nullable<string>;
    followers?: Nullable<number>;
    slogan?: Nullable<string>;
    branches?: Nullable<Branch[]>;
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

export class RepliesToReplies {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    text?: Nullable<string>;
    creatorId?: Nullable<string>;
    repliedToCommentId?: Nullable<string>;
    repliedToReplyId?: Nullable<string>;
    repliedToParentComment?: Nullable<Comment>;
    creator?: Nullable<User>;
}

export class RepliesToRepliesEdge {
    cursor: string;
    node: RepliesToReplies;
}

export class RepliesToRepliesPagination {
    edges?: Nullable<RepliesToRepliesEdge[]>;
    nodes?: Nullable<RepliesToReplies[]>;
    totalCount: number;
    hasNextPage: boolean;
}

export class Replies {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    text?: Nullable<string>;
    postId?: Nullable<string>;
    creatorId?: Nullable<string>;
    repliedToCommentId?: Nullable<string>;
    repliedTo: Comment;
    replies: RepliesToRepliesPagination;
    creator: User;
    mentions: User[];
    post?: Nullable<Post>;
}

export class RepliesEdge {
    cursor: string;
    node: Replies;
}

export class RepliesPagination {
    edges?: Nullable<RepliesEdge[]>;
    nodes?: Nullable<Replies[]>;
    totalCount: number;
    hasNextPage: boolean;
}

export class Comment {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    text: string;
    creatorId: string;
    postId?: Nullable<string>;
    repliedToCommentId?: Nullable<string>;
    repliedToReplyId?: Nullable<string>;
    rating?: Nullable<number>;
    replies?: Nullable<RepliesPagination>;
    myRatingStatus: RatingStatus;
    creator: User;
    mentions: User[];
    post?: Nullable<Post>;
}

export class CommentEdge {
    cursor: string;
    node: Comment;
}

export class CommentPagination {
    edges?: Nullable<CommentEdge[]>;
    nodes?: Nullable<Comment[]>;
    totalCount: number;
    hasNextPage: boolean;
}

export class PostImage {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    metaTitle?: Nullable<string>;
    imageURL?: Nullable<string>;
    description?: Nullable<string>;
    postId?: Nullable<string>;
}

export class Tag {
    id: string;
    name: string;
}

export class Post {
    id: string;
    text: string;
    creator: User;
    rating: number;
    createdAt: DateTime;
    myRatingStatus: RatingStatus;
    creatorId: string;
    comments: Comment[];
    isSaleAble?: Nullable<boolean>;
    companyId?: Nullable<string>;
    postImage: PostImage[];
    tags: Tag[];
}

export class User {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    fullName?: Nullable<string>;
    username?: Nullable<string>;
    email: string;
    isValid?: Nullable<boolean>;
    isSuperuser?: Nullable<boolean>;
    confirm?: Nullable<boolean>;
    emailToken?: Nullable<string>;
    posts?: Nullable<Post[]>;
    company?: Nullable<Company[]>;
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
    role: string;
    company?: Nullable<Company[]>;
}

export class UserError {
    message: string;
    field?: Nullable<string>;
    code?: Nullable<string>;
    status?: Nullable<number>;
}

export class RatePayload implements MutationPayload {
    errors?: Nullable<UserError[]>;
    isRateSuccessful: boolean;
}

export class NewReplyPayload implements MutationPayload {
    errors?: Nullable<UserError[]>;
    comment?: Nullable<Comment>;
}

export class CommentPaginationPayload {
    errors?: Nullable<UserError[]>;
    comments?: Nullable<CommentPagination>;
}

export class CustomError {
    message: string;
    code?: Nullable<string>;
    statusCode?: Nullable<number>;
}

export class CreatePostPayload {
    errors?: Nullable<CustomError[]>;
    post?: Nullable<Post>;
    postImage?: Nullable<PostImage[]>;
    tags?: Nullable<Tag[]>;
}

export class DeletePostPayload {
    errors?: Nullable<CustomError[]>;
    isDeleteSuccessful?: Nullable<boolean>;
}

export class UpdatePostPayload {
    errors?: Nullable<CustomError[]>;
    post?: Nullable<Post>;
    postImage?: Nullable<PostImage>;
    tags?: Nullable<Tag[]>;
}

export class TagEdge {
    cursor: string;
    node: Tag;
}

export class TagPagination {
    edges?: Nullable<TagEdge[]>;
    nodes?: Nullable<Tag[]>;
    totalCount: number;
    hasNextPage: boolean;
}

export class InvitedEmployee {
    id: string;
    invitedId: string;
    invitedEmail: string;
    invitedRoleId: string;
    isInviteAccepted: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class FollowUserToUser {
    id: string;
    followedToId: string;
    followedById: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class FollowCompany {
    id: string;
    followedById: string;
    followedToId: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class Industry {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    type: string;
    description?: Nullable<string>;
    isActive?: Nullable<boolean>;
}

export class IndustryPayload {
    error?: Nullable<string>;
    industries?: Nullable<Industry[]>;
    industry?: Nullable<Industry>;
    isDeletedSuccessful?: Nullable<boolean>;
}

export class Reactions {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    reactionType: string;
}

export class Likes {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    postId: string;
    reactionId: string;
    userId: string;
    reactions?: Nullable<Reactions>;
    user?: Nullable<User>;
}

export class LikesEdge {
    cursor: string;
    node: Likes;
}

export class ReactionsPagination {
    edges?: Nullable<LikesEdge[]>;
    nodes?: Nullable<Likes[]>;
    totalCount: number;
    hasNextPage: boolean;
}

export class LikesPayload {
    likes?: Nullable<Likes>;
    isDisliked?: Nullable<boolean>;
}

export class ReplyToCommentPayload {
    errors?: Nullable<CustomError[]>;
    replies?: Nullable<Replies>;
}

export class RepliesToRepliesPayload {
    errors?: Nullable<CustomError[]>;
    replies?: Nullable<RepliesToReplies>;
}

export class CommentReactions {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    reactionId?: Nullable<string>;
    commentId?: Nullable<string>;
    creatorId?: Nullable<string>;
    comment?: Nullable<Comment>;
    reactors?: Nullable<User[]>;
}

export class CommentReactionsEdge {
    cursor: string;
    node: CommentReactions;
}

export class CommentReactionsPagination {
    edges?: Nullable<CommentReactionsEdge[]>;
    nodes?: Nullable<CommentReactions[]>;
    totalCount: number;
    hasNextPage: boolean;
}

export class CommentReactionsPayload {
    errors?: Nullable<CustomError[]>;
    commentReactions?: Nullable<CommentReactions>;
    isDisliked?: Nullable<boolean>;
}

export class CommentReactionPaginationPayload {
    errors?: Nullable<CustomError[]>;
    reactions?: Nullable<CommentReactionsPagination>;
}

export abstract class IQuery {
    abstract listUsers(paginate?: Nullable<PaginationArgs>, order?: Nullable<OrderListUsers>, filter?: Nullable<FilterListUsers>): UserPaginated | Promise<UserPaginated>;

    abstract me(): User | Promise<User>;

    abstract getUser(userId: string): User | Promise<User>;

    abstract getCompanysFollowedByUser(paginate?: Nullable<PaginationArgs>, order?: Nullable<OrderFollowedCompanyList>): Nullable<CompanyPaginated> | Promise<Nullable<CompanyPaginated>>;

    abstract companiesSuggestions(paginate?: Nullable<PaginationArgs>, order?: Nullable<OrderListCompanies>, filter?: Nullable<FilterListCompanies>): CompanyPaginated | Promise<CompanyPaginated>;

    abstract companies(paginate?: Nullable<PaginationArgs>, order?: Nullable<OrderListCompanies>, filter?: Nullable<FilterListCompanies>): CompanyPaginated | Promise<CompanyPaginated>;

    abstract getCompanyById(id: string): Company | Promise<Company>;

    abstract getBranchesByCompanyId(id: string): Branch[] | Promise<Branch[]>;

    abstract getTags(paginate?: Nullable<PaginationArgs>, order?: Nullable<OrderTagList>, query?: Nullable<TagQuery>): TagPagination | Promise<TagPagination>;

    abstract postsByCompanyId(id: string): Post[] | Promise<Post[]>;

    abstract companyPostsFollowedByUser(): Nullable<Post[]> | Promise<Nullable<Post[]>>;

    abstract comments(postId: string, paginate?: Nullable<PaginationArgs>, order?: Nullable<OrderCommentsList>): CommentPaginationPayload | Promise<CommentPaginationPayload>;

    abstract getIndustry(): IndustryPayload | Promise<IndustryPayload>;

    abstract getReactions(): Reactions[] | Promise<Reactions[]>;

    abstract getLikesByPost(postId: string, paginate?: Nullable<PaginationArgs>, order?: Nullable<ReactionsOrderList>): ReactionsPagination | Promise<ReactionsPagination>;

    abstract getUsersByPostReaction(reactionType: string, paginate?: Nullable<PaginationArgs>, order?: Nullable<ReactionsOrderList>): ReactionsPagination | Promise<ReactionsPagination>;

    abstract commentReactions(commentId: string, paginate?: Nullable<PaginationArgs>, order?: Nullable<CommentReactionsOrderList>): CommentReactionPaginationPayload | Promise<CommentReactionPaginationPayload>;
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

    abstract logout(): boolean | Promise<boolean>;

    abstract createCompany(data: CreateCompanyInput): Company | Promise<Company>;

    abstract createCompanyGeneralInfo(data: CreateCompanyGeneralInput): Company | Promise<Company>;

    abstract editCompany(id: string, data: CompanyEditInput): Company | Promise<Company>;

    abstract createCompanyBranch(id: string, data: CompanyBranchInput): Branch | Promise<Branch>;

    abstract editCompanyBranch(id: string, data: CompanyBranchEditInput): Branch | Promise<Branch>;

    abstract deleteCompanyBranch(id: string, companyId: string): Branch | Promise<Branch>;

    abstract post(data: CreatePostInput, companyId: string, file?: Nullable<Upload[]>): CreatePostPayload | Promise<CreatePostPayload>;

    abstract postUpdate(id: string, imageURL?: Nullable<string>, input?: Nullable<UpdatePostInput>, file?: Nullable<Upload>): UpdatePostPayload | Promise<UpdatePostPayload>;

    abstract postDelete(postId: string): DeletePostPayload | Promise<DeletePostPayload>;

    abstract upvotePost(postId: number): RatePayload | Promise<RatePayload>;

    abstract downvotePost(postId: number): RatePayload | Promise<RatePayload>;

    abstract removeRatingFromPost(postId: number): RatePayload | Promise<RatePayload>;

    abstract commentToPost(postId: string, input: CreateCommentInput, mention?: Nullable<CreateMentionsInput>): NewReplyPayload | Promise<NewReplyPayload>;

    abstract upvoteComment(commentId: string): RatePayload | Promise<RatePayload>;

    abstract downvoteComment(commentId: string): RatePayload | Promise<RatePayload>;

    abstract removeRatingFromComment(commentId: string): RatePayload | Promise<RatePayload>;

    abstract inviteEmployee(data: InvitedEmployeeInput): InvitedEmployee | Promise<InvitedEmployee>;

    abstract createEmployee(data: UserEmployeeInput): User | Promise<User>;

    abstract followCompany(data: FollowCompanyInput): FollowCompany | Promise<FollowCompany>;

    abstract unfollowCompany(data: UnfollowCompanyInput): string | Promise<string>;

    abstract followUserToUser(data: FollowUserToUserInput): FollowUserToUser | Promise<FollowUserToUser>;

    abstract unfollowUser(data: UnfollowUserInput): string | Promise<string>;

    abstract createIndustry(data: IndustryInput): IndustryPayload | Promise<IndustryPayload>;

    abstract updateIndustry(id: string, data: IndustryInput): IndustryPayload | Promise<IndustryPayload>;

    abstract deleteIndustry(id: string): IndustryPayload | Promise<IndustryPayload>;

    abstract activeOrDeactiveIndustry(id: string): IndustryPayload | Promise<IndustryPayload>;

    abstract createLikes(data: LikesInput): LikesPayload | Promise<LikesPayload>;

    abstract removeLike(postId: string): Likes | Promise<Likes>;

    abstract commentReply(commentId: string, input: CreateCommentInput, mention?: Nullable<CreateMentionsInput>): ReplyToCommentPayload | Promise<ReplyToCommentPayload>;

    abstract replyToReply(commentId: string, input: CreateCommentInput, mention?: Nullable<CreateMentionsInput>): RepliesToRepliesPayload | Promise<RepliesToRepliesPayload>;

    abstract commentReaction(input: CommentReactionsInput): CommentReactionsPayload | Promise<CommentReactionsPayload>;
}

export type DateTime = any;
export type JSON = any;
export type Upload = any;
type Nullable<T> = T | null;
