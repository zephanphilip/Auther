import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
      passReqToCallback: true, 
    });
  }

  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
   
    console.log(req.query);
    const appId = req.query.state;
    
    const email = profile.emails[0].value;
    const googleId = profile.id;

    const user = await this.authService.validateGoogleUser(googleId, email, appId);
    done(null, user);
  }
}
