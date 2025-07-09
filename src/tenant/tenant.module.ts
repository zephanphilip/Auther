import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './tenant.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Tenant.name,schema:TenantSchema}])],
  providers: [TenantService],
  controllers: [TenantController]
})
export class TenantModule {}
