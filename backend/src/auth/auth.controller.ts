import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from '@user/dto/signup.dto';
import { SigninDto } from '@user/dto/signin.dto';
import { RefreshTokenDto } from '@user/dto/refresh-token.dto';
import { createResponse } from '@common/utils/response.util';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists',
  })
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signup(signupDto);

    this.setAuthCookies(res, accessToken, refreshToken);

    return res
      .status(HttpStatus.CREATED)
      .json(
        createResponse(HttpStatus.CREATED, { message: 'Signup successful' }),
      );
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signin(signinDto);

    this.setAuthCookies(res, accessToken, refreshToken);

    return res
      .status(HttpStatus.OK)
      .json(createResponse(HttpStatus.OK, { message: 'Signin successful' }));
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired refresh token',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );

    if (!tokens) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.status(HttpStatus.OK).json(
      createResponse(HttpStatus.OK, {
        message: 'Token refreshed successfully',
      }),
    );
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: false,
      maxAge: 15 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
    });
  }
}
