// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { GENDER } from 'src/constant/userConstant';

export const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        // enum:['MALE',"GENDER"]
        enum: [GENDER._male, GENDER._femal],
    },
    password: {
        type: String,
        required: true,
        select: false
    }
});
