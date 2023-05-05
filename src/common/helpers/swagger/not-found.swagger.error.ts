import { ApiProperty } from '@nestjs/swagger';

export class NotFoundSwaggerReturn {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}
