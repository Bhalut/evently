import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { createLogger, NestLogger } from '@repo/logger';
import { env } from './config/env';

async function bootstrap() {
  const pinoLogger = createLogger({ service: 'evently-api' });
  const app = await NestFactory.create(AppModule, {
    logger: new NestLogger(pinoLogger),
  });

  // Security
  app.use(helmet());
  app.enableCors({ origin: env.CORS_ORIGIN });

  // Global Pipelines
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Evently API')
    .setDescription('Event Management Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: '/docs-json',
  });

  await app.listen(env.PORT);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
