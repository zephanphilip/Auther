import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import * as fs from 'fs'
import {v4 as uuidv4} from 'uuid'
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenDocument } from './refresh-token.schema';
import { Model } from 'mongoose';



@Injectable()
export class TokenService {
    private PRIVATE_KEY: string;
    private PUBLIC_KEY: string;

    constructor(@InjectModel(RefreshToken.name) private refreshtokenmodel:Model<RefreshTokenDocument>){
    const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH;
    const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;

    if (!privateKeyPath || !publicKeyPath) {
      throw new Error('JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH must be set.');
    }
        this.PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');
        this.PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');
    }

    //creating access token
    async createAccessToken(payload:any):Promise<string>{
        const token = jwt.sign(payload,this.PRIVATE_KEY,{
            algorithm:'RS256',
            expiresIn:'15m',
        })
        return token
    }

    //creating refresh token
    async createRefreshToken(user:any):Promise<any>{
        
        const jti = uuidv4()

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        
        await this.refreshtokenmodel.create({
            jti:jti,
            userId:user._id,
            appId:user.appId,
            expiresAt:expiresAt,
        })

        const token = jwt.sign({sub:user._id,
            appId:user.appId,
            jti,
        },this.PRIVATE_KEY,{
            algorithm:'RS256',
            expiresIn:'7d',
        })

        return token
    }
}
