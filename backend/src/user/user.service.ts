import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupDto } from '@user/dto/signup.dto';
import { User, UserDocument } from '@user/schemas/user.schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async signup(signupDto: SignupDto): Promise<void> {
    const { email, name, password } = signupDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      this.logger.warn(`Signup failed: User already exists - ${email}`);
      throw new ConflictException('User already exists');
    }

    const newUser = new this.userModel({ email, name, password });
    await newUser.save();
    this.logger.log(`User signed up successfully: ${email}`);
  }

  async getUserInfo(
    email: string,
    withHashedPassword = false,
  ): Promise<Partial<User> | null> {
    const selectFields = withHashedPassword ? '' : '-password';
    const user = await this.userModel.findOne({ email }).select(selectFields);

    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      return null;
    }

    this.logger.debug(`Retrieved user info for email: ${email}`);
    return user;
  }

  async saveRefreshToken(email: string, refreshToken: string): Promise<void> {
    const updateResult = await this.userModel.updateOne(
      { email },
      { $set: { refreshToken } },
    );

    if (updateResult.modifiedCount > 0) {
      this.logger.debug(`Refresh token saved for user: ${email}`);
    } else {
      this.logger.warn(
        `Failed to save refresh token: User not found - ${email}`,
      );
    }
  }

  async getStoredRefreshToken(email: string): Promise<string | null> {
    const user = await this.userModel.findOne({ email }).select('refreshToken');

    if (!user) {
      this.logger.warn(`User not found for refresh token retrieval - ${email}`);
      return null;
    }

    this.logger.debug(`Retrieved refresh token for user: ${email}`);
    return user.refreshToken || null;
  }
}
