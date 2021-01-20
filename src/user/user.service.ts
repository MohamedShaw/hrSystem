import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_COLLECTION_NAME } from 'src/constant/userConstant';
import { FindUsersQueryDto, SignInDto, UpdateUserDto, UserDto } from './create-cat.dto';
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

    async create(createUserDto: UserDto): Promise<UserData> {

        let isUserFoundWithEmail = await this.checkUserWithEmailExistance(createUserDto.email)
        if (isUserFoundWithEmail)
            throw new BadRequestException("this email is already in use")

        return await this.userModel.create({
            ...createUserDto,
            password: await this.hashPassword(createUserDto.password)
        })
    }

    async checkUserWithEmailExistance(email: string): Promise<boolean> {
        let userWithEmail = await this.userModel.findOne({ email })

        return (userWithEmail) ? true : false
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

    async findUserById(userId: string) {
        let user = await this.userModel.findById(userId)
        console.log("🚀 ~ file: user.service.ts ~ line 70 ~ UserService ~ findUserById ~ user", user)
        if (!user) {
            throw new NotFoundException(`user with Id is not found`)
        }
        return user
    }


    async getAllUsers(finUsersQuery: FindUsersQueryDto) {
        let findQuery: { _id?: string, gender?: string } = {};

        if (finUsersQuery.userId) {
            findQuery._id = finUsersQuery.userId
        }

        if (finUsersQuery.gender) {
            findQuery.gender = finUsersQuery.gender
        }

        console.log("🚀 ~ file: user.service.ts ~ line 88 ~ UserService ~ getAllUsers ~ findQuery", findQuery)

        return await this.userModel.find(findQuery)


    }


    async deleteUser(userId: string) {
        await this.findUserById(userId)
        await this.userModel.findByIdAndDelete(userId)
    }

    async updateUser(
        userId: string,
        uodateData: UpdateUserDto
    ) {
        console.log("🚀 ~ file: user.service.ts ~ line 106 ~ UserService ~ uodateData", uodateData)
        console.log("🚀 ~ file: user.service.ts ~ line 106 ~ UserService ~ userId", userId)
        await this.findUserById(userId)

        let updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            uodateData,
            {
                new: true
            }
        )

        return updatedUser
    }

}
