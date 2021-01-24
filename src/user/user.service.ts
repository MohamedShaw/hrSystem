import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_COLLECTION_NAME } from 'src/constant/userConstant';
import {
    FindUsersQueryDto,
    SignInDto,
    UpdateUserDto,
    UserDto,
} from './create-cat.dto';
import { UserData } from './user.interface';
import { OmitType } from '@nestjs/swagger';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
    constructor(
        @InjectModel(USER_COLLECTION_NAME) private userModel: Model<UserData>,
    ) { }

    async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);

        return hash;
    }

    async create(createUserDto: UserDto): Promise<UserData> {
        const isUserFoundWithEmail = await this.checkUserWithEmailExistance(
            createUserDto.email,
        );
        if (isUserFoundWithEmail)
            throw new BadRequestException('this email is already in use');

        return await this.userModel.create({
            ...createUserDto,
            password: await this.hashPassword(createUserDto.password),
        });
    }

    async checkUserWithEmailExistance(email: string): Promise<boolean> {
        const userWithEmail = await this.userModel.findOne({ email });

        return userWithEmail ? true : false;
    }

    async comparePassword(password, hash) {
        const foundPass = await bcrypt.compare(password, hash);
        return foundPass;
    }
    async getUserById(signInDto: SignInDto): Promise<any> {
        const user = await this.userModel
            .findOne({ email: signInDto.email })
            .select('password');

        //compare user.password with in dto
        const isFoundUser = await this.comparePassword(
            signInDto.password,
            user.password,
        );
        if (isFoundUser) {
            const user = await this.userModel.findOne({ email: signInDto.email });
            return user;
        } else {
            throw 'error';
        }

        //success return user ? return error
    }

    async findUserById(userId: string) {
        const user = await this.userModel.findById(userId);
        console.log(
            '🚀 ~ file: user.service.ts ~ line 70 ~ UserService ~ findUserById ~ user',
            user,
        );
        if (!user) {
            throw new NotFoundException(`user with Id is not found`);
        }
        return user;
    }

    async getAllUsers(finUsersQuery: FindUsersQueryDto) {
        const findQuery: { _id?: string; gender?: string } = {};

        if (finUsersQuery.userId) {
            findQuery._id = finUsersQuery.userId;
        }

        if (finUsersQuery.gender) {
            findQuery.gender = finUsersQuery.gender;
        }

        console.log(
            '🚀 ~ file: user.service.ts ~ line 88 ~ UserService ~ getAllUsers ~ findQuery',
            findQuery,
        );

        return await this.userModel.find(findQuery);
    }

    async deleteUser(userId: string) {
        await this.findUserById(userId);
        await this.userModel.findByIdAndDelete(userId);
    }

    async updateUser(userId: string, uodateData: UpdateUserDto) {
        console.log(
            '🚀 ~ file: user.service.ts ~ line 106 ~ UserService ~ uodateData',
            uodateData,
        );
        console.log(
            '🚀 ~ file: user.service.ts ~ line 106 ~ UserService ~ userId',
            userId,
        );
        await this.findUserById(userId);

        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            uodateData,
            {
                new: true,
            },
        );

        return updatedUser;
    }


    // this fun return valid or throw exeption for given user
    async login(query: Partial<UserData>, password: string) {
        const user = await this.userModel
            .findOne(query as any)
            .select('password name email gender');
        // compare hashed password with passed password from user
        const isFoundUser = await this.comparePassword(password, user.password);
        const userWitoutPass = {
            name: user.name,
            email: user.email,
            gender: user.gender,
            id: user._id
        }
        if (!isFoundUser) {
            throw new ConflictException();
        }
        return userWitoutPass;
    }
}
