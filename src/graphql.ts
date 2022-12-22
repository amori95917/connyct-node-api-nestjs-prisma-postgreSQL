
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum BranchType {
    HEADQUARTER = "HEADQUARTER",
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

export enum CommunityMemberOrderBy {
    createdAt = "createdAt"
}

export enum CommunityPostCommentOrderBy {
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

export enum CommunityOrderBy {
    createdAt = "createdAt",
    name = "name"
}

export enum CommunityPostsOrderBy {
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

export class OrderListCommunityMember {
    direction: OrderDirection;
    orderBy: CommunityMemberOrderBy;
}

export class OrderCommentList {
    direction: OrderDirection;
    orderBy: CommunityPostCommentOrderBy;
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

export class OrderListCommunity {
    direction: OrderDirection;
    orderBy: CommunityOrderBy;
}

export class CommunityPostsOrderList {
    direction: OrderDirection;
    orderBy: CommunityPostsOrderBy;
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
    name?: Nullable<string>;
    legalName?: Nullable<string>;
    description?: Nullable<string>;
    registrationNumberType?: Nullable<string>;
    registrationNumber: string;
    establishedDate: DateTime;
    slogan?: Nullable<string>;
    companyStage?: Nullable<string>;
}

export class CompanyBranchInput {
    type: BranchType;
    contactEmail: string;
    contactNumber: string;
    country?: Nullable<string>;
    city?: Nullable<string>;
    zipCode?: Nullable<string>;
    state?: Nullable<string>;
    street?: Nullable<string>;
}

export class CompanyBranchEditInput {
    type?: Nullable<BranchType>;
    contactEmail?: Nullable<string>;
    contactNumber?: Nullable<string>;
    country?: Nullable<string>;
    city?: Nullable<string>;
    zipCode?: Nullable<string>;
    state?: Nullable<string>;
    street?: Nullable<string>;
}

export class CompanyAccountStatus {
    accountStatus: string;
    reason?: Nullable<string>;
}

export class CompanyDocumentInput {
    companyId: string;
    type: string;
}

export class CompanyDocumentEditInput {
    type: string;
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
    mentionIds?: Nullable<string[]>;
}

export class DiscussionAnswerUpdateInput {
    answer: string;
    mentionIds?: Nullable<string[]>;
}

export class DiscussionAnswerVoteInput {
    discussionId: string;
    discussionAnswerId: string;
    vote: string;
}

export class ReplyToAnswerInput {
    repliedToAnswerId: string;
    answer: string;
    discussionId: string;
}

export class CommunityInput {
    name: string;
    description: string;
    type: string;
    companyId: string;
}

export class CommunityEditInput {
    name?: Nullable<string>;
    description?: Nullable<string>;
    type?: Nullable<string>;
}

export class CommunityMemberInviteInput {
    communityId: string;
    companyId: string;
    memberId?: Nullable<string[]>;
}

export class CommunityMemberInput {
    communityId: string;
    companyId: string;
}

export class CommunityPolicyInput {
    title: string;
    description: string;
}

export class CommunityPolicyUpdateInput {
    title: string;
    description: string;
}

export class CommunityPostInput {
    text: string;
    communityId: string;
    tags?: Nullable<string[]>;
    metaTitle?: Nullable<string>;
    description?: Nullable<string>;
}

export class UpdateCommunityPostInput {
    text: string;
    tags?: Nullable<string[]>;
    metaTitle?: Nullable<string>;
    description?: Nullable<string>;
}

export class CommentInput {
    text: string;
}

export class MentionsInput {
    mentionIds?: Nullable<string[]>;
}

export interface MutationPayload {
    errors?: Nullable<UserError[]>;
}

export class Branch {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    name?: Nullable<string>;
    type: BranchType;
    contactEmail: string;
    contactNumber: string;
    country: string;
    city: string;
    zipCode?: Nullable<string>;
    state?: Nullable<string>;
    street?: Nullable<string>;
}

export class CompanyDocument {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    companyId?: Nullable<string>;
    type?: Nullable<string>;
    document?: Nullable<string>;
    company?: Nullable<Company>;
}

export class Company {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    name?: Nullable<string>;
    legalName?: Nullable<string>;
    registrationNumberType?: Nullable<string>;
    registrationNumber?: Nullable<string>;
    establishedDate?: Nullable<DateTime>;
    companyStage?: Nullable<string>;
    description?: Nullable<string>;
    ownership?: Nullable<string>;
    mission?: Nullable<string>;
    vision?: Nullable<string>;
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
    companyDocument?: Nullable<CompanyDocument[]>;
}

export class CompanyPaginated {
    edges?: Nullable<CompanyEdge[]>;
    pageInfo?: Nullable<CompanyPageInfo>;
    totalCount?: Nullable<number>;
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

export class Role {
    name: string;
}

export class RepliesToReplies {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
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
    totalCount?: Nullable<number>;
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
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
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
    totalCount?: Nullable<number>;
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
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
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
    totalCount?: Nullable<number>;
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
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
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
    totalCount?: Nullable<number>;
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

export class UserProfile {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    address?: Nullable<string>;
    phoneNo?: Nullable<string>;
    profileImage?: Nullable<string>;
    user?: Nullable<User>;
}

export class User {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
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
    userProfile?: Nullable<UserProfile>;
    role?: Nullable<Role>;
    isAdmin: boolean;
}

export class UserPaginated {
    edges?: Nullable<UserEdge[]>;
    pageInfo?: Nullable<UserPageInfo>;
    totalCount?: Nullable<number>;
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
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
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

export class UserProfilePayload {
    errors?: Nullable<CustomError>;
    userProfile?: Nullable<UserProfile>;
}

export class CompanyPayload {
    errors?: Nullable<CustomError[]>;
    company?: Nullable<Company>;
    companyDocument?: Nullable<CompanyDocument[]>;
}

export class CompanyDocumentEditPayload {
    errors?: Nullable<CustomError[]>;
    company?: Nullable<Company>;
    companyDocument?: Nullable<CompanyDocument>;
}

export class CompanyBranchPayload {
    errors?: Nullable<CustomError[]>;
    branch?: Nullable<Branch>;
}

export class GetCompanyBranchPayload {
    errors?: Nullable<CustomError[]>;
    branches?: Nullable<Branch[]>;
}

export class CompanyBranchDeletePayload {
    errors?: Nullable<CustomError[]>;
    isDeleted?: Nullable<boolean>;
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

export class CommentDeletePayload {
    errors?: Nullable<UserError[]>;
    isDeleted?: Nullable<boolean>;
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
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
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
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    reactionType: string;
}

export class Likes {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
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
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
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

export class CreatedBy {
    id?: Nullable<string>;
    fullName?: Nullable<string>;
    image?: Nullable<string>;
}

export class DiscussionAnswerReply {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    answer?: Nullable<string>;
    discussionId?: Nullable<string>;
    discussion?: Nullable<CompanyDiscussion>;
    userId?: Nullable<string>;
    user: User;
    repliedToAnswerId?: Nullable<string>;
    parentAnswer?: Nullable<DiscussionAnswer>;
    upVote?: Nullable<number>;
    createdBy?: Nullable<CreatedBy>;
}

export class DiscussionAnswerReplyPaginated {
    edges?: Nullable<DiscussionAnswerReplyEdge[]>;
    pageInfo?: Nullable<DiscussionAnswerReplyPageInfo>;
    totalCount?: Nullable<number>;
}

export class DiscussionAnswerReplyEdge {
    cursor?: Nullable<string>;
    node?: Nullable<DiscussionAnswerReply>;
}

export class DiscussionAnswerReplyPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class DiscussionAnswer {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    answer?: Nullable<string>;
    discussionId?: Nullable<string>;
    discussion?: Nullable<CompanyDiscussion>;
    userId?: Nullable<string>;
    user: User;
    answerReply?: Nullable<DiscussionAnswerReplyPaginated>;
    mentions?: Nullable<User[]>;
    upVote?: Nullable<number>;
    createdBy?: Nullable<CreatedBy>;
}

export class DiscussionAnswerPaginated {
    edges?: Nullable<DiscussionAnswerEdge[]>;
    pageInfo?: Nullable<DiscussionAnswerPageInfo>;
    totalCount?: Nullable<number>;
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

export class DiscussionVote {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    vote?: Nullable<string>;
    userId?: Nullable<string>;
    user?: Nullable<User[]>;
    discussionId?: Nullable<string>;
    discussion?: Nullable<CompanyDiscussion>;
}

export class CompanyDiscussion {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    companyId?: Nullable<string>;
    company?: Nullable<Company>;
    userId?: Nullable<string>;
    user: User;
    discussionAnswer?: Nullable<DiscussionAnswerPaginated>;
    discussionVote?: Nullable<DiscussionVote[]>;
    upVote?: Nullable<number>;
    createdBy?: Nullable<CreatedBy>;
}

export class DiscussionPaginated {
    edges?: Nullable<CompanyDiscussionEdge[]>;
    pageInfo?: Nullable<CompanyDiscussionPageInfo>;
    totalCount?: Nullable<number>;
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

export class DiscussionVotePayload {
    errors?: Nullable<CustomError[]>;
    discussionVote?: Nullable<DiscussionVote>;
    removeVote?: Nullable<boolean>;
}

export class DiscussionAnswerVote {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
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
    removeVote?: Nullable<boolean>;
}

export class DiscussionAnswerPayload {
    errors?: Nullable<CustomError[]>;
    discussionAnswer?: Nullable<DiscussionAnswer>;
}

export class DiscussionAnswerReplyPayload {
    errors?: Nullable<CustomError[]>;
    discussionAnswerReply?: Nullable<DiscussionAnswerReply>;
}

export class DiscussionAnswerDeletePayload {
    errors?: Nullable<CustomError[]>;
    isDeleted?: Nullable<boolean>;
}

export class CommunityRole {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    role?: Nullable<string>;
    communityId?: Nullable<string>;
    userId?: Nullable<string>;
    user?: Nullable<User>;
    community?: Nullable<Community>;
    company?: Nullable<Company>;
}

export class Community {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    type?: Nullable<string>;
    profile?: Nullable<string>;
    coverImage?: Nullable<string>;
    companyId?: Nullable<string>;
    creatorId?: Nullable<string>;
    slug?: Nullable<string>;
    company?: Nullable<Company>;
    createdBy?: Nullable<User>;
    members?: Nullable<CommunityMemberPaginated>;
    followersCount?: Nullable<number>;
    communityRole?: Nullable<CommunityRole[]>;
}

export class CommunityPaginated {
    edges?: Nullable<CommunityEdge[]>;
    pageInfo?: Nullable<CommunityPageInfo>;
    totalCount?: Nullable<number>;
}

export class CommunityEdge {
    cursor?: Nullable<string>;
    node?: Nullable<Community>;
}

export class CommunityPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class CommunityMember {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    communityId?: Nullable<string>;
    invitedById?: Nullable<string>;
    memberId?: Nullable<string>;
    community?: Nullable<Community>;
    member?: Nullable<User>;
    communityRole: CommunityRole;
}

export class CommunityMemberPaginated {
    edges?: Nullable<CommunityMemberEdge[]>;
    pageInfo?: Nullable<CommunityMemberPageInfo>;
    totalCount?: Nullable<number>;
}

export class CommunityMemberEdge {
    cursor?: Nullable<string>;
    node?: Nullable<CommunityMember>;
}

export class CommunityMemberPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class CommunityMemberPayload {
    errors?: Nullable<CustomError[]>;
    communityMember?: Nullable<CommunityMember[]>;
}

export class GetCommunityMemberPayload {
    errors?: Nullable<CustomError[]>;
    communityMember?: Nullable<CommunityMemberPaginated>;
}

export class JoinCommunityPayload {
    errors?: Nullable<CustomError[]>;
    joinCommunity?: Nullable<CommunityMember>;
}

export class AcceptInvitePayload {
    errors?: Nullable<CustomError[]>;
    isAccepted?: Nullable<boolean>;
}

export class CommunityPayload {
    errors?: Nullable<CustomError[]>;
    community?: Nullable<Community>;
}

export class GetCommunityPayload {
    errors?: Nullable<CustomError[]>;
    community?: Nullable<CommunityPaginated>;
}

export class CommunityDeletePayload {
    errors?: Nullable<CustomError[]>;
    isDeleted?: Nullable<boolean>;
}

export class CommunityPolicy {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    communityId?: Nullable<string>;
    title?: Nullable<string>;
    description?: Nullable<string>;
}

export class CommunityPolicyPaginated {
    edges?: Nullable<CommunityPolicyEdge[]>;
    pageInfo?: Nullable<CommunityPolicyPageInfo>;
    totalCount?: Nullable<number>;
}

export class CommunityPolicyEdge {
    cursor?: Nullable<string>;
    node?: Nullable<CommunityPolicy>;
}

export class CommunityPolicyPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class CommunityPoliciesPayload {
    errors?: Nullable<CustomError[]>;
    data?: Nullable<CommunityPolicyPaginated>;
}

export class CommunityPolicyPayload {
    errors?: Nullable<CustomError[]>;
    data?: Nullable<CommunityPolicy>;
}

export class CommunityPolicyDeletePayload {
    errors?: Nullable<CustomError[]>;
    isDeleted?: Nullable<boolean>;
}

export class CommunityPostMedia {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    metaTitle?: Nullable<string>;
    description?: Nullable<string>;
    imageURL?: Nullable<string>;
    communityPostId?: Nullable<string>;
    communityPost?: Nullable<CommunityPost>;
}

export class CommunityPost {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    text?: Nullable<string>;
    communityId?: Nullable<string>;
    slug?: Nullable<string>;
    authorId?: Nullable<string>;
    isDeleted?: Nullable<boolean>;
    isApproved?: Nullable<boolean>;
    communityPostMedia?: Nullable<CommunityPostMedia>;
    community?: Nullable<Community>;
    creator?: Nullable<User>;
}

export class CommunityPostPaginated {
    edges?: Nullable<CommunityPostEdge[]>;
    pageInfo?: Nullable<CommunityPostPageInfo>;
    totalCount?: Nullable<number>;
}

export class CommunityPostEdge {
    cursor?: Nullable<string>;
    node?: Nullable<CommunityPost>;
}

export class CommunityPostPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class ThirdLevelComment {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    content?: Nullable<string>;
    authorId?: Nullable<string>;
    commentId?: Nullable<string>;
    creator: User;
    secondLevelComment?: Nullable<SecondLevelComment>;
}

export class ThirdLevelCommentPagination {
    edges?: Nullable<ThirdLevelCommentEdge[]>;
    pageInfo?: Nullable<ThirdLevelCommentPageInfo>;
    totalCount?: Nullable<number>;
}

export class ThirdLevelCommentEdge {
    cursor?: Nullable<string>;
    node?: Nullable<ThirdLevelComment>;
}

export class ThirdLevelCommentPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class SecondLevelComment {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    content?: Nullable<string>;
    authorId?: Nullable<string>;
    commentId?: Nullable<string>;
    thirdLevelComment: ThirdLevelCommentPagination;
    creator: User;
    firstLevelComment?: Nullable<FirstLevelComment>;
}

export class SecondLevelCommentPagination {
    edges?: Nullable<SecondLevelCommentEdge[]>;
    pageInfo?: Nullable<SecondLevelCommentPageInfo>;
    totalCount?: Nullable<number>;
}

export class SecondLevelCommentEdge {
    cursor?: Nullable<string>;
    node?: Nullable<SecondLevelComment>;
}

export class SecondLevelCommentPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class FirstLevelComment {
    id?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    content?: Nullable<string>;
    communityPostId?: Nullable<string>;
    authorId?: Nullable<string>;
    secondLevelComment: SecondLevelCommentPagination;
    creator: User;
    communityPost?: Nullable<CommunityPost>;
    community?: Nullable<Community>;
    mentions: User[];
}

export class FirstLevelCommentPagination {
    edges?: Nullable<FirstLevelCommentEdge[]>;
    pageInfo?: Nullable<FirstLevelCommentPageInfo>;
    totalCount?: Nullable<number>;
}

export class FirstLevelCommentEdge {
    cursor?: Nullable<string>;
    node?: Nullable<FirstLevelComment>;
}

export class FirstLevelCommentPageInfo {
    startCursor?: Nullable<string>;
    endCursor?: Nullable<string>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export class FirstLevelCommentPaginatedPayload {
    errors?: Nullable<CustomError[]>;
    comment?: Nullable<FirstLevelCommentPagination>;
}

export class FirstLevelCommentPayload {
    errors?: Nullable<CustomError[]>;
    comment?: Nullable<FirstLevelComment>;
}

export class SecondLevelCommentPayload {
    errors?: Nullable<CustomError[]>;
    comment?: Nullable<SecondLevelComment>;
}

export class ThirdLevelCommentPayload {
    errors?: Nullable<CustomError[]>;
    comment?: Nullable<ThirdLevelComment>;
}

export class DeleteCommentPayload {
    errors?: Nullable<CustomError[]>;
    isDeleted?: Nullable<boolean>;
}

export class CommunityPostPayload {
    errors?: Nullable<CustomError[]>;
    communityPost?: Nullable<CommunityPost>;
    communityPostMedia?: Nullable<CommunityPostMedia[]>;
    tags?: Nullable<Tag[]>;
}

export class GetCommunityPostPayload {
    errors?: Nullable<CustomError[]>;
    communityPost?: Nullable<CommunityPostPaginated>;
}

export class DeleteCommunityPostPayload {
    errors?: Nullable<CustomError[]>;
    isDeleteSuccessful?: Nullable<boolean>;
}

export class UpdateCommunityPostPayload {
    errors?: Nullable<CustomError[]>;
    communityPost?: Nullable<CommunityPost>;
    communityPostMedia?: Nullable<CommunityPostMedia>;
    tags?: Nullable<Tag[]>;
}

export abstract class IQuery {
    abstract listUsers(before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListUsers>, filter?: Nullable<FilterListUsers>): UserPaginated | Promise<UserPaginated>;

    abstract me(): User | Promise<User>;

    abstract getUser(userId: string): User | Promise<User>;

    abstract getCompanysFollowedByUser(before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderFollowedCompanyList>): Nullable<CompanyPaginated> | Promise<Nullable<CompanyPaginated>>;

    abstract companiesSuggestions(before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListCompanies>, filter?: Nullable<FilterListCompanies>): CompanyPaginated | Promise<CompanyPaginated>;

    abstract companies(before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListCompanies>, filter?: Nullable<FilterListCompanies>): CompanyPaginated | Promise<CompanyPaginated>;

    abstract getCompanyById(id: string): Company | Promise<Company>;

    abstract getBranchesByCompanyId(id: string): GetCompanyBranchPayload | Promise<GetCompanyBranchPayload>;

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

    abstract getCompanyDiscussionById(discussionId: string): CompanyDiscussion | Promise<CompanyDiscussion>;

    abstract getCompanyDiscussionByUser(): CompanyDiscussion[] | Promise<CompanyDiscussion[]>;

    abstract discussionVoteCount(discussionId: string): number | Promise<number>;

    abstract getDiscussionAnswerByDiscussionId(discussionId: string, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListDiscussionAnswer>): DiscussionAnswerPaginated | Promise<DiscussionAnswerPaginated>;

    abstract getCommunity(companyId: string, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListCommunity>): GetCommunityPayload | Promise<GetCommunityPayload>;

    abstract getCommunityById(communityId: string): CommunityPayload | Promise<CommunityPayload>;

    abstract getCommunityMember(communityId: string, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderListCommunityMember>): GetCommunityMemberPayload | Promise<GetCommunityMemberPayload>;

    abstract getCommunityPolicies(communityId: string, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>): CommunityPoliciesPayload | Promise<CommunityPoliciesPayload>;

    abstract getCommunityPolicy(id: string): CommunityPolicy | Promise<CommunityPolicy>;

    abstract communityPost(communityId: string, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<CommunityPostsOrderList>): GetCommunityPostPayload | Promise<GetCommunityPostPayload>;

    abstract getComments(postId: string, before?: Nullable<string>, after?: Nullable<string>, first?: Nullable<number>, last?: Nullable<number>, order?: Nullable<OrderCommentList>): FirstLevelCommentPaginatedPayload | Promise<FirstLevelCommentPaginatedPayload>;
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

    abstract companyGeneralInfoEdit(companyId: string, data: CompanyEditInput): CompanyPayload | Promise<CompanyPayload>;

    abstract companyAvatar(companyId: string, avatar: Upload): CompanyPayload | Promise<CompanyPayload>;

    abstract createCompanyBranch(id: string, data: CompanyBranchInput): CompanyBranchPayload | Promise<CompanyBranchPayload>;

    abstract editCompanyBranch(id: string, data: CompanyBranchEditInput): CompanyBranchPayload | Promise<CompanyBranchPayload>;

    abstract deleteCompanyBranch(id: string, companyId: string): CompanyBranchDeletePayload | Promise<CompanyBranchDeletePayload>;

    abstract companyAccountStatus(data: CompanyAccountStatus, companyId: string): CompanyPayload | Promise<CompanyPayload>;

    abstract companyDocumentCreate(input: CompanyDocumentInput, document: Upload[]): CompanyPayload | Promise<CompanyPayload>;

    abstract companyDocumentEdit(companyId: string, documentId: string, editDocument: CompanyDocumentEditInput, document: Upload): CompanyDocumentEditPayload | Promise<CompanyDocumentEditPayload>;

    abstract post(data: CreatePostInput, companyId: string, file?: Nullable<Upload[]>): CreatePostPayload | Promise<CreatePostPayload>;

    abstract postUpdate(id: string, imageURL?: Nullable<string>, input?: Nullable<UpdatePostInput>, file?: Nullable<Upload>): UpdatePostPayload | Promise<UpdatePostPayload>;

    abstract postDelete(postId: string): DeletePostPayload | Promise<DeletePostPayload>;

    abstract upvotePost(postId: number): RatePayload | Promise<RatePayload>;

    abstract downvotePost(postId: number): RatePayload | Promise<RatePayload>;

    abstract removeRatingFromPost(postId: number): RatePayload | Promise<RatePayload>;

    abstract commentToPost(postId: string, input: CreateCommentInput, mention?: Nullable<CreateMentionsInput>): NewReplyPayload | Promise<NewReplyPayload>;

    abstract commentUpdate(commentId: string, input: CreateCommentInput, mention?: Nullable<CreateMentionsInput>): NewReplyPayload | Promise<NewReplyPayload>;

    abstract commentDelete(commentId: string): DeleteCommentPayload | Promise<DeleteCommentPayload>;

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

    abstract companyDiscussionUpdate(input: CompanyDiscussionUpdateInput, discussionId: string): CompanyDiscussionPayload | Promise<CompanyDiscussionPayload>;

    abstract companyDiscussionDelete(id: string): CompanyDiscussionDeletePayload | Promise<CompanyDiscussionDeletePayload>;

    abstract discussionVote(input: DiscussionVoteInput): DiscussionVotePayload | Promise<DiscussionVotePayload>;

    abstract discussionDownvote(input: DiscussionVoteInput): DiscussionVotePayload | Promise<DiscussionVotePayload>;

    abstract createDiscussionAnswer(answer: DiscussionAnswerInput): DiscussionAnswerPayload | Promise<DiscussionAnswerPayload>;

    abstract discussionAnswerUpdate(updateAnswer: DiscussionAnswerUpdateInput, answerId: string): DiscussionAnswerPayload | Promise<DiscussionAnswerPayload>;

    abstract discussionAnswerDelete(id: string): DiscussionAnswerDeletePayload | Promise<DiscussionAnswerDeletePayload>;

    abstract discussionAnswerVote(input: DiscussionAnswerVoteInput): DiscussionAnswerVotePayload | Promise<DiscussionAnswerVotePayload>;

    abstract discussionAnswerDownvote(input: DiscussionAnswerVoteInput): DiscussionAnswerVotePayload | Promise<DiscussionAnswerVotePayload>;

    abstract discussionAnswerReply(input: ReplyToAnswerInput): DiscussionAnswerReplyPayload | Promise<DiscussionAnswerReplyPayload>;

    abstract companyCommunity(input: CommunityInput, profile?: Nullable<Upload>, coverImage?: Nullable<Upload>): CommunityPayload | Promise<CommunityPayload>;

    abstract companyCommunityEdit(communityId: string, input: CommunityEditInput, profile?: Nullable<Upload>, coverImage?: Nullable<Upload>): CommunityPayload | Promise<CommunityPayload>;

    abstract companyCommunityDelete(communityId: string): CommunityDeletePayload | Promise<CommunityDeletePayload>;

    abstract inviteUserByCommunityAdmin(input: CommunityMemberInviteInput): CommunityMemberPayload | Promise<CommunityMemberPayload>;

    abstract acceptCommunityInvite(companyId: string, communityMemberId: string): AcceptInvitePayload | Promise<AcceptInvitePayload>;

    abstract inviteUserByCommunityUser(input: CommunityMemberInviteInput): CommunityMemberPayload | Promise<CommunityMemberPayload>;

    abstract joinPublicCommunity(input: CommunityMemberInput): JoinCommunityPayload | Promise<JoinCommunityPayload>;

    abstract createCommunityPolicy(id: string, input: CommunityPolicyInput): CommunityPolicyPayload | Promise<CommunityPolicyPayload>;

    abstract updateCommunityPolicy(id: string, input: CommunityPolicyUpdateInput): CommunityPolicyPayload | Promise<CommunityPolicyPayload>;

    abstract deleteCommunityPolicy(id: string): CommunityPolicyDeletePayload | Promise<CommunityPolicyDeletePayload>;

    abstract communityPostCreate(input: CommunityPostInput, files?: Nullable<Upload[]>): CommunityPostPayload | Promise<CommunityPostPayload>;

    abstract communityPostUpdate(id: string, imageURL?: Nullable<string>, input?: Nullable<UpdateCommunityPostInput>, file?: Nullable<Upload>): UpdateCommunityPostPayload | Promise<UpdateCommunityPostPayload>;

    abstract communityPostDelete(postId: string): DeleteCommunityPostPayload | Promise<DeleteCommunityPostPayload>;

    abstract createSecondLevelComment(commentId: string, input: CommentInput, mention?: Nullable<MentionsInput>): SecondLevelCommentPayload | Promise<SecondLevelCommentPayload>;

    abstract createFirstLevelComment(postId: string, input: CommentInput, mention?: Nullable<MentionsInput>): FirstLevelCommentPayload | Promise<FirstLevelCommentPayload>;

    abstract updateComment(commentId: string, input: CommentInput, mention?: Nullable<MentionsInput>): FirstLevelCommentPayload | Promise<FirstLevelCommentPayload>;

    abstract createThirdLevelComment(commentId: string, input: CommentInput, mention?: Nullable<MentionsInput>): ThirdLevelCommentPayload | Promise<ThirdLevelCommentPayload>;
}

export type DateTime = any;
export type Upload = any;
type Nullable<T> = T | null;
