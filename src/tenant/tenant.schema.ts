import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export type TenantDocument = Document & Tenant


@Schema({timestamps:true})
export class Tenant{
    @Prop({required:true})
    appName: string;

    @Prop({required:true,unique:true})
    email: string;

    @Prop({required:true})
    password: string;

    @Prop({required:true})
    appid: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);