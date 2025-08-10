import { createParamDecorator } from '@nestjs/common';
import { User } from '../user.entity';

// Decorador para obtener el usuario desde la solicitud entrante
import { ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
