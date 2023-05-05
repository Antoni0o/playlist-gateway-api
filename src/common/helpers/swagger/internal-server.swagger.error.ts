import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorSwaggerReturn {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}
