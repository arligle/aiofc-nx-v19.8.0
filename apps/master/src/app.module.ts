import { Module } from '@nestjs/common';

import RootConfig from './config/root.config';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { setupYamlBaseConfigModule } from '@aiokit/config';

@Module({
  imports: [
    setupYamlBaseConfigModule(__dirname,RootConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
