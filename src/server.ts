import express, { Application } from 'express';
import apiRoutes from './routes/index';

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes() {
    this.app.use('/api/v1', apiRoutes);
  }

  public listen(port: string | number) {
    this.app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  }
}

export default Server;