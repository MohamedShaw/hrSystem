import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_COLLECTION_NAME } from 'src/constant/userConstant';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

// collect for module
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_COLLECTION_NAME, schema: UserSchema },
    ]),
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService
  ],
})
export class UserModule { }
