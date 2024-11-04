import { Transform } from 'class-transformer';
import { IsString, IsEmail } from 'class-validator';
import { sanitize } from '@common/utils/sanitization.util';

export class UserDto {
  @Transform(({ value }) => sanitize(value))
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
