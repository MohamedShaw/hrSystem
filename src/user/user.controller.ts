import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, SignInDto } from './create-cat.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Get()
    async getUser(id) {
        const _user = await this.userService.getUserById(id);
        return _user;
    }


    @Post()
    async createUser(@Body() loginUserDto: UserDto) {
        const _user = await this.userService.create(loginUserDto);
        return _user;
    }

    @ApiTags('Auth')
    @Post('login')
    async signIn(@Body() signInBody: SignInDto) {
        const _user = await this.userService.getUserById(signInBody)
        return _user;
    }
    @ApiTags('Auth')
    @Get('/users')
    async getAllUsers() {
        const _user = await this.userService.getAllUser()
        return _user;
    }
}
