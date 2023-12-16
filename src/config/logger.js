import winston from 'winston';
const {transports} = winston;

const logger = winston.createLogger({
  transports: [
    new transports.Console(),
    // new transports.File({
    //   filename: `logs/debug.log`,
    //   maxsize: 1 * 1024 * 1024, // 1MB
    //   maxFiles: 2, // Number of backup files to keep
    //   tailable: true, // Enable file rotation
    //   zippedArchive: true,
    // }),
  ],
  exitOnError: false,
  format: winston.format.combine(
    winston.format.align(),
    winston.format.colorize({all: true}),
    winston.format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    winston.format.printf((info) => {
      return `[${info.timestamp}][${info.level}]:${info.message}`;
    }),
  ),
});

export default logger;
