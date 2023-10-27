import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GlobalModule } from './shared/modules/global.module';
import { RatingsModule } from './ratings/ratings.module';
import { SalesModule } from './sales/sales.module';
import { BillingsModule } from './billings/billings.module';
import { GenresModule } from './genres/genres.module';
import { DevelopersModule } from './developers/developers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_SCHEMA,
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
    }),
    GlobalModule,
    AuthModule,
    GamesModule,
    UsersModule,
    RatingsModule,
    SalesModule,
    BillingsModule,
    GenresModule,
    DevelopersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
