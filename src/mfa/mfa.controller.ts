import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MfaService } from './mfa.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('mfa')
export class MfaController {
    constructor(private readonly mfaservices:MfaService){}

    //enable mfa
    @UseGuards(AuthGuard('jwt'))
    @Post('setup')
    async setUpMfa(@Req() req:any){   
        return await this.mfaservices.generateSecretAndQr(req.user.email,req.user.userId);
    }

    //second step in enabling mfa, verifying mfa code
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
    @UseGuards(AuthGuard('jwt'))
    @Post('verify')
    async verifyMfa(@Req() req:any,@Body() body:{code:string}){   
        const isValid= await this.mfaservices.verifyCode(body.code,req.user.userId);
        if(!isValid) throw new UnauthorizedException('Invalid code')
        if(isValid) await this.mfaservices.enableMfa(req.user.userId);
        return { message: 'MFA enabled successfully' };
    }

    //disable mfa
    @UseGuards(AuthGuard('jwt'))
    @Post('disable')
    async disableMfa(@Req() req){
        return await this.mfaservices.disableMfa(req.user.userId);
    }


}
