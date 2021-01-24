import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindUsersQueryDto, SignInDto, UpdateUserDto, UserDto } from './create-cat.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';


@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private authService: AuthService
    ) { }


    @ApiTags('users')
    @Get('/:userId')
    async findUserById(
        @Param('userId') userId: string
    ) {
        return await this.userService.findUserById(userId)
    }


    @ApiTags('Auth')
    @Post()
    async createUser(
        @Body() createUser: UserDto
    ) {
        return await this.userService.create(createUser)
    }

    @UseGuards(LocalAuthGuard)
    @ApiTags('Auth')
    @Post('login')
    async signIn(
        @Request() req,
        @Body() signInBody: SignInDto
    ) {
        // console.log("user login", req);

        return req.user
    }

    @ApiTags('users')
    @Get('')
    async getAllUsers(
        @Query() findUsers: FindUsersQueryDto
    ) {
        let users = await this.userService.getAllUsers(findUsers)

        return users;
    }

    @ApiTags('users')
    @Delete('/:userId')
    async deleteUserById(
        @Param('userId') userId: string
    ) {
        await this.userService.deleteUser(userId)
    }

    @ApiTags('users')
    @Patch('/:userId')
    async updateUser(
        @Param('userId') userId: string,
        @Body() updateUserData: UpdateUserDto
    ) {
        return this.userService.updateUser(
            userId,
            updateUserData
        )
    }

}
