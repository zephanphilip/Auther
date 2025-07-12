import { Module } from '@nestjs/common';
import { MfaService } from './mfa.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/users.schema';
import { MfaController } from './mfa.controller';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:UserSchema}])],
  providers: [MfaService],
  controllers: [MfaController],
  exports:[MfaService]
})
export class MfaModule {}
