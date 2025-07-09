import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from './refresh-token.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:RefreshToken.name,schema:RefreshTokenSchema}])],
  providers: [TokenService],
  exports:[TokenService]
})
export class TokenModule {}
