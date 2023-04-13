import * as dayjs from 'dayjs';
import {
  LoggerInterface,
  LoggerLogInterface,
} from '../interfaces/logger.interface';

export function Logger({
  level,
  message,
}: LoggerInterface): LoggerLogInterface {
  const log = {
    level,
    message,
    time: dayjs().format('DD-MM-YYYY'),
  };

  return log;
}

export function LoggerPrint(logger: LoggerLogInterface) {
  console.log(logger);
}
