import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date } from "mongoose";

export type RefreshTokenDocument = RefreshToken & Document

@Schema({timestamps:true})
export class RefreshToken{
    @Prop({required:true,unique:true})
    jti:string;
    @Prop({required:true})
    userId:string;
    @Prop({required:true})
    appId:string;
    @Prop({required:true, type:Date})
    expiresAt:Date;
    @Prop({ required: true,default:false })
    revoked: boolean; 
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)