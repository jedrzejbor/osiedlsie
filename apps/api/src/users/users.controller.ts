import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  // Endpoint chroniony - wymaga zalogowania
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return {
      message: 'Twój profil',
      user,
    };
  }

  // Endpoint tylko dla adminów
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAdminData(@CurrentUser() user: any) {
    return {
      message: 'Dane dla administratora',
      user,
    };
  }

  // Endpoint publiczny - nie wymaga logowania
  @Get('public')
  getPublicData() {
    return {
      message: 'Publiczne dane dostępne dla wszystkich',
    };
  }
}
