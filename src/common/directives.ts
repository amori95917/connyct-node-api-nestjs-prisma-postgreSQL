import { NextFn } from '@nestjs/graphql';
import get from 'lodash.get';

const userLocationOnContext = 'request.user';

const ctxUser = (ctx) => get(ctx, userLocationOnContext);

const isLoggedIn = (ctx) => {
  const user = ctxUser(ctx);
  if (!user) throw new Error('Not logged in');
  return user;
};

const isRequestingUserAlsoOwner = ({ ctx, userId, type, typeId }) => {
  return ctx.prisma.exists[type]({ id: typeId, user: { id: userId } });
};

export const isRequestingUser = ({ ctx, userId }) =>
  ctx.prisma.exists.User({ id: userId });

const directiveResolvers = {
  isAuthenticated: (next: NextFn, source, args, ctx) => {
    console.log('ctx', ctx);
    isLoggedIn(ctx);
    return next();
  },
  hasRole: (next: NextFn, source, { roles }, ctx) => {
    const { role } = isLoggedIn(ctx);
    if (roles.includes(role)) next();
    throw new Error('Unauthorized, incorrect role');
  },
  isOwner: async (next: NextFn, source, { type }, ctx) => {
    const { id: typeId } =
      source && source.id
        ? source
        : ctx.req.body.variables
        ? ctx.req.body.variables
        : { id: null };
    const { id: userId } = isLoggedIn(ctx);
    const isOwner =
      type === `User`
        ? userId === typeId
        : await isRequestingUserAlsoOwner({ ctx, userId, type, typeId });
    if (isOwner) next();
    throw new Error(`Unauthorized, must be owner`);
  },
  isOwnerOrHasRole: async (next: NextFn, source, { roles, type }, ctx) => {
    const { id: userId, role } = isLoggedIn(ctx);
    if (roles.includes(role)) {
      return next();
    }

    const { id: typeId } = ctx.req.body.variables;
    const isOwner = await isRequestingUserAlsoOwner({
      ctx,
      userId,
      type,
      typeId,
    });

    if (isOwner) {
      return next();
    }
    throw new Error(`Unauthorized, not owner or incorrect role`);
  },
};

export default directiveResolvers;
