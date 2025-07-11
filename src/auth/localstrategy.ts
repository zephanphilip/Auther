import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { LoginDto } from "./dto/login-dto.dto";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email',
      passReqToCallback:true
     });
  }

  async validate(req: any, email: string, password: string) {
    const appId = req.body.appId;
    if (!appId) {
      throw new UnauthorizedException('Missing appId');
    }
    // This calls AuthService.validateUser()
    const user = await this.authService.validateUser(email,password,appId);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
