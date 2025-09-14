// src/user/src/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId; // Explicitly typed

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ default: 'local' })
  provider: 'local' | 'google';

  @Prop()
  refreshTokenHash?: string; // Hashed stored refresh token
}

export const UserSchema = SchemaFactory.createForClass(User);
