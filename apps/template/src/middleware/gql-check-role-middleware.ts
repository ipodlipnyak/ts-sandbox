
import { MiddlewareContext, FieldMiddleware, NextFn } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
export const gqlCheckRoleMiddleware: FieldMiddleware = async (
    ctx: MiddlewareContext,
    next: NextFn,
) => {
    const { info } = ctx;
    const { extensions } = info.parentType.getFields()[info.fieldName];

    const hasSufficientPermissions = ctx.context.req?.session?.whoami?.role >= extensions.role;
    if (!hasSufficientPermissions) {
        return '';
        // throw new ForbiddenException(
        //     `User does not have sufficient permissions to access "${info.fieldName}" field.`,
        // );
    }
    return next();
};
