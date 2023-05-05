import { ApiProperty } from '@nestjs/swagger';

export class BadRequestSwaggerReturn {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string[];

  @ApiProperty()
  error: string;
}
