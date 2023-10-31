import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: ['https://arcelity.vercel.app', '*'] },
  });
  await app.listen(8000);
}
bootstrap();
