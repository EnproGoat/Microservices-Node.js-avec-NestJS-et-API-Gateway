import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../../domain/entities/user.entity';

@Schema({ collection: 'users' })
export class UserDocument {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'USER' })
  role: UserRole;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export type UserDoc = HydratedDocument<UserDocument>;
export const UserSchema = SchemaFactory.createForClass(UserDocument);
