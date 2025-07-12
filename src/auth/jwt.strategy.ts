import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const PUBLIC_KEY =fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH!, 'utf8');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
  constructor() { 

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: PUBLIC_KEY,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      appId: payload.appId,
      email: payload.email,
    };
  }
}
