import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tenant, TenantDocument } from './tenant.schema';
import { Model } from 'mongoose';
import { CreateTenantDto } from './dto/create-tenant.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class TenantService {
    constructor(@InjectModel(Tenant.name) private tenantmodel:Model<TenantDocument> ){}

    //registering the app
    async registerApp(dto:CreateTenantDto):Promise<TenantDocument>{
        
        await this.validateEmail(dto.email)

        const hashedPassword = await bcrypt.hash(dto.password,10);

        try {
            const createUser = await this.tenantmodel.create({...dto,password:hashedPassword})

            return createUser;    
        } catch (error) {
            throw new Error(error)
        }
        
    }

    //checking if email id already exist
    async validateEmail(email:string):Promise<string>{
        const existing = await this.tenantmodel.findOne({email:email})
        if(existing) throw new BadRequestException('Email id already exist');
        return email
    }
}
