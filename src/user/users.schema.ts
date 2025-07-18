import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({timestamps:true})
export class User{
    @Prop({required:true})
    appId:string;

    @Prop({required:true})
    email:string;

    @Prop()
    password:string;

    @Prop({required:true,default:false})
    mfaEnabled:boolean;

    @Prop()
    mfaSecret:string;

    @Prop()
    googleId:string;
}

export const UserSchema = SchemaFactory.createForClass(User);