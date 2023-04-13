import { DocumentBuilder } from '@nestjs/swagger';
import { version } from '../../../package.json';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('DevSpace API')
  .setDescription('DevSpace project API')
  .setVersion(version)
  .build();
