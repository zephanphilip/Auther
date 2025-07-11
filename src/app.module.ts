import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import {JwksModule} from './.well-known/jwks.module'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configservices:ConfigService)=>({
        uri: configservices.get<string>('MONGO_URI'),
      })
    }),
    TenantModule,
    UserModule,
    AuthModule,
    TokenModule,
    JwksModule
  ],
})
export class AppModule {}
