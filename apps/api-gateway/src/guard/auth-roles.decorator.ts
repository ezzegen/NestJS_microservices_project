import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';   // key for getting meta into guard

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)