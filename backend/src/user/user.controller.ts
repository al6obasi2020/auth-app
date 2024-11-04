import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { createResponse } from '@common/utils/response.util';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('user')
export class UserController {
  constructor() {}

  /**
   * Retrieves user information.
   * Requires a valid JWT token.
   * @param req - Express Request object containing the authenticated user.
   * @returns User information.
   */
  @ApiBearerAuth('authorization')
  @UseGuards(JwtAuthGuard)
  @Get('userInfo')
  @ApiOperation({ summary: 'userInfo for the logged-in user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'UserInfo successfully retrieved',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthenticated user',
  })
  async getUserInfo(@Req() req: Request) {
    const user = req.user as { email: string };

    return createResponse(HttpStatus.OK, { user });
  }
}
