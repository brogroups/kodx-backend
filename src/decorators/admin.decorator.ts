import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';

export const Admin = () => UseGuards(AdminGuard);
