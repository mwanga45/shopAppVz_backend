import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: '*',
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });

  app.useGlobalInterceptors({
    intercept(context, next) {
      const req = context.switchToHttp().getRequest();
      logger.log(`Incoming Request: ${req.method} ${req.url}`);
      return next.handle();
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
