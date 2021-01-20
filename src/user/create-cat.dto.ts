import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { GENDER } from 'src/constant/userConstant';

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
    @IsEnum(GENDER)
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

export class FindUsersQueryDto {

    @ApiPropertyOptional()
    @IsOptional()
    userId?: string

    @ApiPropertyOptional({
        enum: GENDER
    })
    @IsOptional()
    gender?: string
}

export class UpdateUserDto {

    @ApiPropertyOptional({
        enum: GENDER
    })
    @IsOptional()
    @IsEnum(GENDER)
    gender?: string

}