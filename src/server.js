import express from 'express';
import {fileURLToPath} from 'url';
import {join} from 'path';
import http from 'http';
import logger from './config/logger.js';
import 'dotenv/config';
import {Server} from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 4500;

app.use(express.static(getPublicFolderPath()));

httpServer.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});

/**
 * Retrieves the absolute path to the public folder.
 *
 * @return {string} The absolute path to the public folder.
 * @throws {Error} If unable to determine the public folder path.
 */
function getPublicFolderPath() {
  const curentPath = fileURLToPath(import.meta.url);
  const publicFolderPath = join(curentPath, '../../', 'public');
  return publicFolderPath;
}

const io = new Server(httpServer);

export default io;
