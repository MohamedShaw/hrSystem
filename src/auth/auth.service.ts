import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignInDto } from '../user/create-cat.dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) { }

    // validate fun validate user and return user with access_token
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.login({ email }, password)

        const payload = { username: user.email, sub: user.id };
        return {
            user,
            access_token: this.jwtService.sign(payload),
        };
    }

}
