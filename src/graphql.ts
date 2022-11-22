
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

export enum DiscussionAnswerOrderBy {
    createdAt = "createdAt"
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

export enum PostsOrderBy {
    createdAt = "createdAt"
}

export enum ReactionsOrderBy {
    createdAt = "createdAt"
}

export enum CommentReactionsOrderBy {
    createdAt = "createdAt"
}

export enum DiscussionOrderBy {
    createdAt = "createdAt"
}

export class OrderCommentsList {
    direction: OrderDirection;
    orderBy: CommentOrderBy;
}

export class OrderListDiscussionAnswer {
    direction: OrderDirection;
    orderBy: DiscussionAnswerOrderBy;
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

export class PaginationArgs {
    skip: number;
    take: number;
}

export class OrderTagList {
    direction: OrderDirection;
    orderBy: TagOrderBy;
}

export class TagQuery {
    name?: Nullable<string>;
}

export class OrderPosts {
    direction: OrderDirection;
    orderBy: PostsOrderBy;
}

export class ReactionsOrderList {
    direction: OrderDirection;
    orderBy: ReactionsOrderBy;
}

export class CommentReactionsOrderList {
    direction: OrderDirection;
    orderBy?: Nullable<CommentReactionsOrderBy>;
}

export class OrderListDiscussion {
    direction: OrderDirection;
    orderBy: DiscussionOrderBy;
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

export class UserProfileInput {
    address: string;
    phoneNo: string;
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

export class CompanyAccountStatus {
    accountStatus: string;
    reason?: Nullable<string>;
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

export class CompanyDiscussionInput {
    title: string;
    description: string;
    companyId: string;
}

export class CompanyDiscussionUpdateInput {
    title: string;
    description: string;
}

export class DiscussionVoteInput {
    discussionId: string;
    vote: string;
}

export class DiscussionAnswerInput {
    answer: string;
    discussionId: string;
}

export class DiscussionAnswerUpdateInput {
    answer: string;
}

export class ReplyToAnswerInput {
    repliedToAnswerId: string;
    answer: string;
    discussionId: string;
}

export class DiscussionAnswerVoteInput {
    discussionId: string;
    discussionAnswerId: string;
    vote: string;
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
    avatar?: Nullable<string>;
    accountStatus?: Nullable<string>;
    reason?: Nullable<string>;
}

export class CompanyPaginated {
    edges?: Nullable<CompanyEdge[]>;
    pageInfo?: Nullable<CompanyPageInfo>;
    totalCount: number;
}

export class CompanyEdge {
    cursor?: Nullable<string>;
    node?: Nullable<Company>;
}

export class CompanyPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
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

export class RepliesToRepliesPagination {
    edges?: Nullable<RepliesToRepliesEdge[]>;
    pageInfo?: Nullable<RepliesToRepliesPageInfo>;
    totalCount: number;
}

export class RepliesToRepliesEdge {
    cursor?: Nullable<string>;
    node?: Nullable<RepliesToReplies>;
}

export class RepliesToRepliesPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
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

export class RepliesPagination {
    edges?: Nullable<RepliesEdge[]>;
    pageInfo?: Nullable<RepliesPageInfo>;
    totalCount: number;
}

export class RepliesEdge {
    cursor?: Nullable<string>;
    node?: Nullable<Replies>;
}

export class RepliesPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
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

export class CommentPagination {
    edges?: Nullable<CommentEdge[]>;
    pageInfo?: Nullable<CommentPageInfo>;
    totalCount: number;
}

export class CommentEdge {
    cursor?: Nullable<string>;
    node?: Nullable<Comment>;
}

export class CommentPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
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
    company?: Nullable<Company>;
}

export class PostPagination {
    edges?: Nullable<PostEdge[]>;
    pageInfo?: Nullable<PostPageInfo>;
    totalCount: number;
}

export class PostEdge {
    cursor?: Nullable<string>;
    node?: Nullable<Post>;
}

export class PostPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
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
    isEmailVerified?: Nullable<boolean>;
    posts?: Nullable<Post[]>;
    company?: Nullable<Company[]>;
    isAdmin: boolean;
}

export class UserPaginated {
    edges?: Nullable<UserEdge[]>;
    pageInfo?: Nullable<UserPageInfo>;
    totalCount: number;
}

export class UserEdge {
    cursor?: Nullable<string>;
    node?: Nullable<User>;
}

export class UserPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class CustomError {
    message: string;
    code?: Nullable<string>;
    statusCode?: Nullable<number>;
}

export class OTP {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    otp?: Nullable<number>;
    expirationDate?: Nullable<DateTime>;
    userId?: Nullable<string>;
}

export class OTPPayload {
    errors?: Nullable<CustomError[]>;
    otp?: Nullable<OTP>;
    otpCheck?: Nullable<boolean>;
}

export class Token {
    accessToken?: Nullable<string>;
    refreshToken?: Nullable<string>;
}

export class Auth {
    accessToken?: Nullable<string>;
    refreshToken?: Nullable<string>;
    errors?: Nullable<CustomError[]>;
    user?: Nullable<User>;
    role?: Nullable<string>;
    otp?: Nullable<OTP>;
    company?: Nullable<Company[]>;
}

export class UserProfile {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    address?: Nullable<string>;
    phoneNo?: Nullable<string>;
    profileImage?: Nullable<string>;
    user?: Nullable<User>;
}

export class UserProfilePayload {
    errors?: Nullable<CustomError>;
    userProfile?: Nullable<UserProfile>;
}

export class CompanyPayload {
    errors?: Nullable<CustomError[]>;
    company?: Nullable<Company>;
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

export class DiscussionAnswer {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    answer?: Nullable<string>;
    discussionId?: Nullable<string>;
    discussion?: Nullable<CompanyDiscussion>;
    userId?: Nullable<string>;
    user?: Nullable<User>;
    reply?: Nullable<DiscussionAnswer[]>;
}

export class DiscussionAnswerPaginated {
    edges?: Nullable<DiscussionAnswerEdge[]>;
    pageInfo?: Nullable<DiscussionAnswerPageInfo>;
    totalCount: number;
}

export class DiscussionAnswerEdge {
    cursor?: Nullable<string>;
    node?: Nullable<DiscussionAnswer>;
}

export class DiscussionAnswerPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class CompanyDiscussion {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    title?: Nullable<string>;
    description?: Nullable<string>;
    companyId?: Nullable<string>;
    company?: Nullable<Company>;
    discussionAnswer: DiscussionAnswerPaginated;
}

export class DiscussionPaginated {
    edges?: Nullable<CompanyDiscussionEdge[]>;
    pageInfo?: Nullable<CompanyDiscussionPageInfo>;
    totalCount: number;
}

export class CompanyDiscussionEdge {
    cursor?: Nullable<string>;
    node?: Nullable<CompanyDiscussion>;
}

export class CompanyDiscussionPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class CompanyDiscussionPayload {
    errors?: Nullable<CustomError[]>;
    companyDiscussion?: Nullable<CompanyDiscussion>;
}

export class CompanyDiscussionDeletePayload {
    errors?: Nullable<CustomError[]>;
    isDeleted?: Nullable<boolean>;
}

export class DiscussionAnswerVote {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    vote?: Nullable<string>;
    discussionId?: Nullable<string>;
    discussion?: Nullable<CompanyDiscussion>;
    userId?: Nullable<string>;
    user?: Nullable<User>;
    discussionAnswer?: Nullable<DiscussionAnswer>;
}

export class DiscussionAnswerVotePayload {
    errors?: Nullable<CustomError[]>;
    discussionAnswerVote?: Nullable<DiscussionAnswerVote>;
}

export class DiscussionAnswerPayload {
    errors?: Nullable<CustomError[]>;
    discussionAnswer?: Nullable<DiscussionAnswer>;
}

export class DiscussionAnswerDeletePayload {
    errors?: Nullable<CustomError[]>;
    isDeleted?: Nullable<boolean>;
}

export class DiscussionVote {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    vote?: Nullable<string>;
    userId?: Nullable<string>;
    user?: Nullable<User[]>;
    discussionId?: Nullable<string>;
    discussion?: Nullable<CompanyDiscussion>;
}

export class DiscussionVotePayload {
    errors?: Nullable<CustomError[]>;
    discussionVote?: Nullable<DiscussionVote>;
}

export abstract class IQuery {
    abstract listUsers(before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListUsers>, filter?: Nullable<FilterListUsers>): UserPaginated | Promise<UserPaginated>;

    abstract me(): User | Promise<User>;

    abstract getUser(userId: string): User | Promise<User>;

    abstract getCompanysFollowedByUser(before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderFollowedCompanyList>): Nullable<CompanyPaginated> | Promise<Nullable<CompanyPaginated>>;

    abstract companiesSuggestions(before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListCompanies>, filter?: Nullable<FilterListCompanies>): CompanyPaginated | Promise<CompanyPaginated>;

    abstract companies(before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListCompanies>, filter?: Nullable<FilterListCompanies>): CompanyPaginated | Promise<CompanyPaginated>;

    abstract getCompanyById(id: string): Company | Promise<Company>;

    abstract getBranchesByCompanyId(id: string): Branch[] | Promise<Branch[]>;

    abstract getTags(paginate?: Nullable<PaginationArgs>, order?: Nullable<OrderTagList>, query?: Nullable<TagQuery>): TagPagination | Promise<TagPagination>;

    abstract postsByCompanyId(id: string, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>): PostPagination | Promise<PostPagination>;

    abstract companyPostsFollowedByUser(before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderPosts>): Nullable<PostPagination> | Promise<Nullable<PostPagination>>;

    abstract comments(postId: string, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderCommentsList>): CommentPaginationPayload | Promise<CommentPaginationPayload>;

    abstract getIndustry(): IndustryPayload | Promise<IndustryPayload>;

    abstract getReactions(): Reactions[] | Promise<Reactions[]>;

    abstract getLikesByPost(postId: string, paginate?: Nullable<PaginationArgs>, order?: Nullable<ReactionsOrderList>): ReactionsPagination | Promise<ReactionsPagination>;

    abstract getUsersByPostReaction(reactionType: string, paginate?: Nullable<PaginationArgs>, order?: Nullable<ReactionsOrderList>): ReactionsPagination | Promise<ReactionsPagination>;

    abstract commentReactions(commentId: string, paginate?: Nullable<PaginationArgs>, order?: Nullable<CommentReactionsOrderList>): CommentReactionPaginationPayload | Promise<CommentReactionPaginationPayload>;

    abstract getCompanyDiscussion(companyId: string, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListDiscussion>): DiscussionPaginated | Promise<DiscussionPaginated>;

    abstract getCompanyDiscussionByUser(): CompanyDiscussion[] | Promise<CompanyDiscussion[]>;

    abstract getDiscussionAnswer(discussionId: string, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListDiscussionAnswer>): DiscussionAnswerPaginated | Promise<DiscussionAnswerPaginated>;
}

export abstract class IMutation {
    abstract updateStatusUser(data: UpdateStatusUserInput): User | Promise<User>;

    abstract updateUser(data: UpdateUserInput): User | Promise<User>;

    abstract changePassword(data: ChangePasswordInput): User | Promise<User>;

    abstract editUserProfile(userProfile: UserProfileInput, file?: Nullable<Upload>): UserProfilePayload | Promise<UserProfilePayload>;

    abstract signup(data: SignupInput): Auth | Promise<Auth>;

    abstract login(data: LoginInput): Auth | Promise<Auth>;

    abstract loginLinkAccess(data: LoginLinkAccessInput): boolean | Promise<boolean>;

    abstract refreshToken(token: string): Token | Promise<Token>;

    abstract confirmEmail(token: string): Token | Promise<Token>;

    abstract requestConfirmEmail(data: RequestConfirmEmailInput): boolean | Promise<boolean>;

    abstract resetPassword(data: ResetPasswordInput): Token | Promise<Token>;

    abstract requestResetPassword(data: RequestResetPasswordInput): boolean | Promise<boolean>;

    abstract logout(): boolean | Promise<boolean>;

    abstract otpVerification(otp: number): OTPPayload | Promise<OTPPayload>;

    abstract resendOtp(): OTPPayload | Promise<OTPPayload>;

    abstract createCompany(data: CreateCompanyInput): Company | Promise<Company>;

    abstract createCompanyGeneralInfo(data: CreateCompanyGeneralInput): Company | Promise<Company>;

    abstract editCompany(id: string, data: CompanyEditInput, file?: Nullable<Upload>): CompanyPayload | Promise<CompanyPayload>;

    abstract createCompanyBranch(id: string, data: CompanyBranchInput): Branch | Promise<Branch>;

    abstract editCompanyBranch(id: string, data: CompanyBranchEditInput): Branch | Promise<Branch>;

    abstract deleteCompanyBranch(id: string, companyId: string): Branch | Promise<Branch>;

    abstract companyAccountStatus(data: CompanyAccountStatus, companyId: string): CompanyPayload | Promise<CompanyPayload>;

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

    abstract companyDiscussion(input: CompanyDiscussionInput): CompanyDiscussionPayload | Promise<CompanyDiscussionPayload>;

    abstract updateCompanyDiscussion(input: CompanyDiscussionUpdateInput, id: string): CompanyDiscussionPayload | Promise<CompanyDiscussionPayload>;

    abstract deleteCompanyDiscussion(id: string): CompanyDiscussionDeletePayload | Promise<CompanyDiscussionDeletePayload>;

    abstract discussionVote(input: DiscussionVoteInput): DiscussionVotePayload | Promise<DiscussionVotePayload>;

    abstract createDiscussionAnswer(answer: DiscussionAnswerInput): DiscussionAnswerPayload | Promise<DiscussionAnswerPayload>;

    abstract updateAnswer(updateAnswer: DiscussionAnswerUpdateInput, id: string): DiscussionAnswerPayload | Promise<DiscussionAnswerPayload>;

    abstract deleteAnswer(id: string): DiscussionAnswerDeletePayload | Promise<DiscussionAnswerDeletePayload>;

    abstract replyToAnswer(input: ReplyToAnswerInput): DiscussionAnswerDeletePayload | Promise<DiscussionAnswerDeletePayload>;

    abstract discussionAnswerVote(input: DiscussionAnswerVoteInput): DiscussionAnswerVotePayload | Promise<DiscussionAnswerVotePayload>;
}

export type DateTime = any;
export type JSON = any;
export type Upload = any;
type Nullable<T> = T | null;
