import { Module } from '@nestjs/common';
import { JwksController } from './jwks.controller';


@Module({
  controllers: [JwksController]
})
export class JwksModule{}
