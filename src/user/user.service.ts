import { Injectable } from '@nestjs/common';
import { UserDto, SignInDto } from './create-cat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { USER_COLLECTION_NAME } from 'src/constant/userConstant';
import { Model, Schema } from 'mongoose';
import { UserModule } from './user.module';
import { UserSchema } from './user.schema';
import { UserData } from './user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
    constructor(
        @InjectModel(USER_COLLECTION_NAME) private userModel: Model<UserData>,
    ) { }

    async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        console.log('hashhh-->>', hash);

        return hash;
    }
    async create(createCatDto: UserDto): Promise<any> {
        const user = {
            ...createCatDto,
        };

        const passwordHash = await this.hashPassword(createCatDto.password);
        console.log('passwordHash', passwordHash);

        user.password = passwordHash;

        console.log('user -->>', user);

        const createdUser = await this.userModel.create(user);
        return createdUser.save();
    }
    async comparePassword(password, hash) {
        const foundPass = await bcrypt.compare(password, hash);
        return foundPass;
    }
    async getUserById(signInDto: SignInDto): Promise<any> {
        const user = await this.userModel
            .findOne({ email: signInDto.email })
            .select('password');
        console.log('user --->>', user);

        //compare user.password with in dto
        const isFoundUser = await this.comparePassword(signInDto.password, user.password);
        if (isFoundUser) {

            const user = await this.userModel
                .findOne({ email: signInDto.email })
            return user
        } else {
            throw "error";

        }

        //success return user ? return error

    }
    async getAllUser(): Promise<any> {
        const users = await this.userModel.find()
        return users
    }

}
