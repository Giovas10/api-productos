import dotenv from 'dotenv';
import Server from './server';

dotenv.config();

const server = new Server();
const PORT = process.env.PORT || 3000;

server.listen(PORT);