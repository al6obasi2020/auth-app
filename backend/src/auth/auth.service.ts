import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SigninDto } from '@user/dto/signin.dto';
import { SignupDto } from '@user/dto/signup.dto';
import { UserService } from '@user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, name, password } = signupDto;

    const existingUser = await this.userService.getUserInfo(email);
    if (existingUser) {
      this.logger.warn(`Signup failed: User already exists - ${email}`);
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.signup({ email, name, password: hashedPassword });
    this.logger.log(`User signed up successfully: ${email}`);

    return this.generateTokens({ email, name });
  }

  async signin(
    signinDto: SigninDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = signinDto;

    const user = await this.userService.getUserInfo(email, true);
    if (!user) {
      this.logger.warn(`Signin failed: Invalid credentials - ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      this.logger.warn(`Signin failed: Incorrect password - ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User signed in successfully: ${email}`);
    return this.generateTokens({ email, name: user.name });
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const email = payload.email;

      const storedToken = await this.userService.getStoredRefreshToken(email);
      if (storedToken !== refreshToken) {
        this.logger.warn(`Token mismatch for user: ${email}`);
        return null;
      }

      this.logger.log(`Refresh token valid for user: ${email}`);
      return this.generateTokens({ email, name: payload.name });
    } catch (error) {
      this.logger.error('Failed to refresh token', error.stack);
      return null;
    }
  }

  private async storeRefreshToken(
    email: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userService.saveRefreshToken(email, refreshToken);
    this.logger.log(`Refresh token stored for user: ${email}`);
  }

  private async generateTokens(payload: { email: string; name: string }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    await this.storeRefreshToken(payload.email, refreshToken);

    return { accessToken, refreshToken };
  }
}
