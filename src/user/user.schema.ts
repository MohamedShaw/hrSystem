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

UserSchema.set('toJSON', {
    transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        //delete ret.password
    },
});
