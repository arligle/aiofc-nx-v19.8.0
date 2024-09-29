import { Injectable } from '@nestjs/common';
import RootConfig from '../config/root.config';

@Injectable()
export class AppService {
  constructor(
    private readonly config: RootConfig,
  ) {}
  getData(): { port: string } {
    return ({ port: this.config.app.port.toString() });
  }
}
