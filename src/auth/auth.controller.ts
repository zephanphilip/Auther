import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Request, Response } from 'express';
import { TokenService } from 'src/token/token.service';
import { MfaService } from 'src/mfa/mfa.service';
import { UserService } from 'src/user/user.service';


@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService, private tokenservice:TokenService, private mfaservice:MfaService, private userservice:UserService){}

    //register the user
    @ApiOperation({ summary: 'Register a new user',
        description: 'Creates a new user with a email, appId.',})
    @ApiBody({type:CreateUserDto})
    @ApiResponse({status: 201,description: 'User registered successfully',})
    @ApiResponse({status: 400,description: 'Validation failed or email already exists',})
    @Post('register')
    async register(@Body() dto:CreateUserDto,@Res({passthrough:true}) res:Response){
        const tokens = await this.authservice.createUser(dto);
        console.log(tokens)
        res.cookie('refreshToken',tokens.refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return{
            accessToken:tokens.accessToken
        }
    }
    //user login
    @ApiOperation({ summary: 'Login',
            description: 'Creates a new tenant with a unique email, appId, and appName.',})
    @ApiBody({type:LoginDto})
    @ApiResponse({status: 201,description: 'User Login successfull',})
    @ApiResponse({status: 400,description: 'Validation failed or email already exists',})
    @ApiResponse({status: 401,description: 'User or App does not Exist',})
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Req() req:any,@Res({passthrough:true}) res:Response){
        const user = await this.userservice.findUserById(req.user._id);
        if(user.mfaEnabled){
            return {mfaRequired: true, message:'Mfa Code Required.'}
        }
        const tokens = await this.authservice.login(req.user) 
        
        res.cookie('refreshToken',tokens.refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return{
            accessToken:tokens.accessToken
        }
    }


    //refresh token
    @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
    @ApiCookieAuth()
    @ApiResponse({ status: 201, description: 'New access token and rotated refresh token.' })
    @ApiResponse({status: 401,description: 'Token Not Found',})
    @Post('refresh')
    async refresh(@Req() req:Request, @Res({passthrough:true}) res:Response){
        const oldToken = req.cookies['refreshToken']
        console.log(oldToken)
        if(!oldToken)throw new UnauthorizedException('Refresh Token not Found');

        const payload = await this.tokenservice.verifyRefreshToken(oldToken);

        await this.tokenservice.revokeRefreshToken(payload.jti);

        const accessToken = await this.tokenservice.createAccessToken({sub:payload.sub,appId:payload.appId});

        const refreshToken = await this.tokenservice.createRefreshToken({_id:payload.sub,appId:payload.appId});

        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return{
            accessToken:accessToken
        }
    }

    //logout
    @ApiOperation({ summary: 'Logout and clear refresh token cookie' })
    @ApiResponse({ status: 200, description: 'User logged out successfully.' })
    @ApiCookieAuth()
    @Post('logout')
    async logout(@Res({ passthrough: true }) res) {
        res.clearCookie('refreshToken');
        return { message: 'Logged out successfully' };
    }

    //Complete MFA and Login
    @ApiBody({
    schema: {
        type: 'object',
        properties: {
        code: { type: 'string' },
        userId: { type: 'string' },
        },
        required: ['code', 'userId'],
    },
    examples: {
        example1: {
        summary: 'Add code and UserID',
        value: {
            code: '2321624',
            userId: '6872a7ff487d89addd06f562',
        },
        },
    },
    })

    @ApiOperation({ summary: 'Complete MFA and Login',
            description: 'Login using MFA code',})
    // @ApiBody({type:LoginDto})
    @ApiResponse({status: 201,description: 'User Login successfull',})
    @ApiResponse({status: 400,description: 'Validation failed or invalid code',})
    //@UseGuards(AuthGuard('local'))
    @Post('completemfa')
    async completeMfa(@Body() body:{userId:string,code:string},@Res({passthrough:true}) res:Response){
        console.log(body.userId)
        const user = await this.userservice.findUserById(body.userId);
        
        if (!user || !user.mfaEnabled) {
            throw new UnauthorizedException('MFA is not enabled for this user');
        }
        const isValid = await this.mfaservice.verifyCode(body.code,body.userId)
        if(!isValid)throw new UnauthorizedException('Invalid token');
        
        const payload = {
            sub: body.userId,
            appId: user.appId,
            email: user.email,
        };

        const accessToken= await this.tokenservice.createAccessToken(payload)
        const refreshToken = await this.tokenservice.createRefreshToken(user)
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return{
            accessToken:accessToken
        }
    }



}
