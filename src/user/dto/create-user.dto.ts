import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto{
    @ApiProperty({ example: 'testuser@gmail.com' ,description: 'Valid email address used as login identifier', })
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
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).*$/, {
        message:
        'Password too weak (needs letters, numbers, and special characters)',
    })
    @IsString()
    password:string;
}