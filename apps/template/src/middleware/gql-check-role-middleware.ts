
import { MiddlewareContext, FieldMiddleware, NextFn } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from './../models';
export const checkRoleMiddleware: FieldMiddleware = async (
    ctx: MiddlewareContext,
    next: NextFn,
) => {
    console.log('FUUUUUUUUUUUUUUUUUUUUUUUCK');
    const { info } = ctx;
    const { extensions } = info.parentType.getFields()[info.fieldName];
    debugger;

    /**
     * In a real-world application, the "userRole" variable
     * should represent the caller's (user) role (for example, "ctx.user.role").
     */
    const userRole = UserRole.USER;
    if (userRole === extensions.role) {
        // or just "return null" to ignore
        throw new ForbiddenException(
            `User does not have sufficient permissions to access "${info.fieldName}" field.`,
        );
    }
    return next();
};
