import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super(repository, User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.repository.findOneBy({ phoneNumber });
  }

  async findByRole(role: string): Promise<User[]> {
    return this.repository.findBy({ role });
  }
} 