
import { Document } from 'mongoose';

export interface UserData extends Document {
    name: string;
    email: string;
    gender: string;
    password: string;
}
