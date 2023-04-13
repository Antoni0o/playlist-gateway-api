import { LogLevel } from '../enums/logger.enum';

export interface LoggerInterface {
  level: LogLevel;
  message: string;
}

export interface LoggerLogInterface {
  level: LogLevel;
  message: string;
  time: string;
}
