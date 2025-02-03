import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/_entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findOne(options: FindOneOptions<User>) {
    const res = await this.userRepo.findOne(options);
    return res;
  }

  async save(user: User) {
    const res = await this.userRepo.save(user);
    return res;
  }

  create(data: Partial<User>) {
    const user = this.userRepo.create({
      ...data,
    });

    return user;
  }

  async delete(id: string) {
    await this.userRepo.delete(id);
  }
}
