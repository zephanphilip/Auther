import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/users.schema';
import { LoginDto } from './dto/login-dto.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private usermodel:Model<UserDocument>, private userservices:UserService, private tokenservices:TokenService){}

    //Validating the user
    async validateUser(email: string, password: string, appId: string):Promise<UserDocument>{
        try {
            console.log('Emailis',email)
            const user = await this.usermodel.findOne({email:email});
            console.log('user',user)
            if(!user) throw new UnauthorizedException('User does not Exist');
            if(!(appId===user.appId)) throw new UnauthorizedException('User Not Registered in this App')
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch)throw new UnauthorizedException('Invalid email or password');
            return user;
        } catch (error) {
            throw error
        }
    }

    async createUser(dto:CreateUserDto):Promise<any>{
        const user = await this.userservices.createUser(dto);
        const tokens=await this.login(user)
        return tokens
    }

    async login(user:any):Promise<any>{
        const payload = {
            sub:user._id,
            appId:user.appId,
            email:user.email
        }
        const accessToken = await this.tokenservices.createAccessToken(payload);
        const refreshToken = await this.tokenservices.createRefreshToken(user);
        return{accessToken, refreshToken}
    }

    async validateGoogleUser(googleId:string,email:string,appId:string):Promise<UserDocument>{
        const user = await this.usermodel.findOne({googleId,appId});

        if(!user){
            const user = await this.usermodel.findOne({email,appId});
            if(!user){
                const user = await this.usermodel.create({email,appId,googleId});
                return user;
            }
            else{
                user.googleId=googleId
                return user;
            }
        }
        else{
            return user;
        }
    }
}
