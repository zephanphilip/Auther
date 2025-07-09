import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class CreateTenantDto{

    @ApiProperty({ example: 'yourcompanyname@gmail.com' ,description: 'Valid email address used as login identifier', })
    @IsEmail()
    email:string;

    @ApiProperty({
        example: 'giveastrongpassword!@',
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

    @ApiProperty({ example: 'my-unique-app-id',
    description: 'Unique identifier for the app/company', })
    @IsString()
    appid:string;

    @ApiProperty({ example: 'Your Company Name',description: 'Readable company name', })
    @IsString()
    appName:string;
}