import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InvitedEmployee {
  @Field(() => ID)
  id: string;
  @Field()
  invitedId: string;

  @Field()
  invitedEmail: string;

  @Field()
  invitedRoleId: string;

  @Field()
  isInviteAccepted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
