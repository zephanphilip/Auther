import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { User, UserDocument } from 'src/user/users.schema';


@Injectable()
export class MfaService {
    constructor(@InjectModel(User.name) private usermodel:Model<UserDocument>){}
    
    async generateSecretAndQr(email:string,userId:string){
        const secret =  authenticator.generateSecret();
        const otpauth = authenticator.keyuri(email,'Auther',secret);
        const qr = await qrcode.toDataURL(otpauth);

        
        await this.usermodel.findByIdAndUpdate(userId,{mfaSecret:secret},{new:true})

        return qr;
    }


    async verifyCode(code:string, userId:string){
        const user = await this.usermodel.findById(userId);
        if(!user) throw new NotFoundException('User not Found.');
        if(!user.mfaSecret) throw new BadRequestException('MFA not set up.');

        const isValid = authenticator.verify({token:code,secret:user.mfaSecret});
        return isValid
    }

    async enableMfa(userId:string){
        const user = await this.usermodel.findById(userId);
        
        if(!user) throw new NotFoundException('User not Found.');
        if(user.mfaEnabled) throw new BadRequestException('Mfa already enabled.');

        await this.usermodel.findByIdAndUpdate(userId,{mfaEnabled:true},{new:true})
    }
    
    async disableMfa(userId:string){
        const user = await this.usermodel.findById(userId);
        
        if(!user) throw new NotFoundException('User not Found.');
        if(!user.mfaEnabled) throw new BadRequestException('Mfa already disabled.');

        await this.usermodel.findByIdAndUpdate(userId,{mfaEnabled:false,mfaSecret:''},{new:true})
    }
}
