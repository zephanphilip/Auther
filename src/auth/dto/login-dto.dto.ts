import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto{
    @ApiProperty({ example: 'testuser@gmail.com' ,description: 'Valid email address', })
    @IsEmail()
    email:string;

    @ApiProperty({example:'test-app',description:'Valid AppId'})
    appId:string;
    
    @ApiProperty({
        example: 'Abcabc123!',
        description:
        'Password must be at least 8 characters, include letters, numbers, and special characters',
    })
    @IsString()
    password:string;
}