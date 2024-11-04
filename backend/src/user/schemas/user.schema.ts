import { Schema, Document } from 'mongoose';

export interface User {
  email: string;
  name: string;
  password: string;
  refreshToken?: string;
}

export type UserDocument = User & Document;

export const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String, required: false },
});
