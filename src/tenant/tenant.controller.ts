import { Body, Controller, Post } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tenants')
@Controller('tenant')
export class TenantController {
    constructor(private readonly tenantservices: TenantService){}

    //register the user
    @ApiOperation({ summary: 'Register a new tenant (app/company)',
        description: 'Creates a new tenant with a unique email, appId, and appName.',})
    @ApiBody({type:CreateTenantDto})
    @ApiResponse({status: 201,description: 'Tenant registered successfully',})
    @ApiResponse({status: 400,description: 'Validation failed or email already exists',})
    @Post()
    async registerApp (@Body() dto:CreateTenantDto){
        return this.tenantservices.registerApp(dto)
    }
}
