import { Logger, Module } from '@nestjs/common';

import RootConfig from './config/root.config';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { setupYamlBaseConfigModule } from '@aiokit/config';
import { setupLoggerModule } from '@aiokit/logger';

@Module({
  imports: [
    setupYamlBaseConfigModule(__dirname,RootConfig),
    setupLoggerModule(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger
  ],
})
export class AppModule {}
