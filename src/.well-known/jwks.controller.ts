import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as fs from 'fs';
import * as pem2jwk from 'pem-jwk';

@Controller('.well-known')
export class JwksController {
    private jwks: any;
    private PUBLIC_KEY: string;
    constructor(){
        const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH;
        
        if (!publicKeyPath) throw new Error('JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH must be set.');
        
        this.PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');

        const jwk = pem2jwk.pem2jwk(this.PUBLIC_KEY);

        this.jwks= {
            keys:[
                {
                    ...jwk,
                    kid:'auth-key-1',
                    use:'sig',
                    alg:'RS256'
                },
            ],
        }
        }

        @ApiOperation({ summary: 'Get the public key ' })
        @ApiResponse({ status: 200, description: 'successfull.' })
        @Get('jwks.json')
        getJwks(){
            return this.jwks;
        }

    }
    
