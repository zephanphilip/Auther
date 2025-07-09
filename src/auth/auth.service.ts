import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/users.chema';
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
    async validateUser(dto:LoginDto):Promise<UserDocument>{
        try {
            const user = await this.usermodel.findOne({email:dto.email})
            if(!user) throw new NotFoundException('User does not Exist');
            if(!(dto.appid===user.appid)) throw new NotFoundException('User Not Registered in this App')
            const isMatch = await bcrypt.compare(user.password,dto.password);
            if(!isMatch)throw new UnauthorizedException('Invalid email or password');
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }

    async createUser(dto:CreateUserDto):Promise<UserDocument>{
        const user = await this.userservices.createUser(dto);
        return this.login(user)
    }

    async login(user:any):Promise<any>{
        const payload = {
            sub:user._id,
            appId:user.appId,
            email:user.email
        }
        const accessToken = await this.tokenservices.createAccessToken(payload);
        const refreshtoken = await this.tokenservices.createRefreshToken(user);
        return{accessToken, refreshtoken}
    }
}
