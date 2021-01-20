import { IsEmail, IsDefined, minLength } from 'class-validator';
import { ApiProperty, } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    @IsDefined()
    @IsEmail()
    email: string;

    @IsDefined()
    @ApiProperty()
    name: string;

    @IsDefined()
    @ApiProperty()
    gender: string;

    @IsDefined()
    @ApiProperty()
    password: string
}

export class SignInDto {
    @ApiProperty()
    @IsDefined()
    @IsEmail()
    email: string;


    @IsDefined()
    @ApiProperty()
    password: string
}