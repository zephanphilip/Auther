import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private usermodel:Model<UserDocument>){}

    //creating user
    async createUser(dto:CreateUserDto):Promise<UserDocument>{
        if(await this.usermodel.findOne({email:dto.email}))throw new BadRequestException('Email already exist');
        const hashedpassword = await bcrypt.hash(dto.password,10);
        const user = await this.usermodel.create({...dto,password:hashedpassword})
        return user;
    }

    //find user by id
    async findUserById(userId:string):Promise<UserDocument>{
        const user = await this.usermodel.findById(userId);
        console.log(user);
        if(!user)throw new NotFoundException('User Not Found');
        return user;
    }
}
