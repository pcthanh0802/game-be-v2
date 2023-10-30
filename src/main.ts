import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origins:['0.0.0.0']});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
