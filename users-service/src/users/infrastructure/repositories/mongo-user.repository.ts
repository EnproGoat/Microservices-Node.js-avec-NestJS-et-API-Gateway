import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import * as userRepositoryPort from '../../application/ports/user.repository.port';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class MongoUserRepository implements userRepositoryPort.UserRepositoryPort {
  constructor(@InjectModel(UserDocument.name) private userModel: Model<UserDocument>) {}

  private toEntity(doc: UserDocument): User {
    return new User(doc.userId, doc.email, doc.name, doc.password, doc.role, doc.createdAt);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ userId: id });
    return doc ? this.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email });
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(): Promise<User[]> {
    const docs = await this.userModel.find();
    return docs.map((d) => this.toEntity(d));
  }

  async save(user: User): Promise<User> {
    await this.userModel.findOneAndUpdate(
      { userId: user.id },
      { userId: user.id, email: user.email, name: user.name, password: user.password, role: user.role, createdAt: user.createdAt },
      { upsert: true, new: true },
    );
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.userModel.deleteOne({ userId: id });
  }
}
