import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/_entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { BcryptService } from 'src/_utils/bcrypt/bcrypt.service';
import {
  NotFoundException,
  UnauthorizedException,
} from 'src/_core/exception/exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly bcryptService: BcryptService,
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

  async updatePassword(userId: string, body: UpdatePasswordDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await this.bcryptService.compareHash(
      body.oldPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    if (body.oldPassword === body.newPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    user.password = await this.bcryptService.hashData(body.newPassword);

    await this.userRepo.save(user);
  }
}
