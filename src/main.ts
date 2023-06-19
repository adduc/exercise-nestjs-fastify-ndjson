import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NDJSONInterceptor } from './ndjson.intercepter';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalInterceptors(new NDJSONInterceptor());
  await app.listen(3000);
}
bootstrap();
