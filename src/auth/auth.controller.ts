import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService){}

    //register the user
    @ApiOperation({ summary: 'Register a new user',
        description: 'Creates a new user with a email, appId.',})
    @ApiBody({type:CreateUserDto})
    @ApiResponse({status: 201,description: 'User registered successfully',})
    @ApiResponse({status: 400,description: 'Validation failed or email already exists',})
    @Post('register')
    register(@Body() dto:CreateUserDto){
        return this.authservice.createUser(dto);
    }
    //user login
    @ApiOperation({ summary: 'Login',
            description: 'Creates a new tenant with a unique email, appId, and appName.',})
    @ApiBody({type:LoginDto})
    @ApiResponse({status: 201,description: 'User Login successfull',})
    @ApiResponse({status: 400,description: 'Validation failed or email already exists',})
    @UseGuards(AuthGuard('local'))
    @Post('login')
    login(@Req() req:any){
        const tokens = this.authservice.login(req.user) 

        
    }
}
