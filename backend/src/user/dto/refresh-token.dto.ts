import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'your-refresh-token',
    description: 'Refresh token for renewing access tokens',
  })
  refreshToken: string;
}
