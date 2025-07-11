import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/users.schema';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './localstrategy';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports:[
    PassportModule,
    UserModule,
    TokenModule,
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy]
})
export class AuthModule {}
