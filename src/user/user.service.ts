import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.chema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private usermodel:Model<UserDocument>){}

    //creating user
    async createUser(dto:CreateUserDto):Promise<UserDocument>{
        const hashedpassword = await bcrypt.hash(dto.password,10);
        const user = await this.usermodel.create({...dto,password:hashedpassword})
        return user;
    }
}
