import { Repository, EntityTarget, FindOptionsWhere, ObjectLiteral, DeepPartial } from 'typeorm';
import { Injectable } from '@nestjs/common';

export interface IBaseRepository<T extends ObjectLiteral> {
  findOne(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: string, data: DeepPartial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
  findBy(where: FindOptionsWhere<T>): Promise<T[]>;
}

@Injectable()
export abstract class BaseRepository<T extends ObjectLiteral> implements IBaseRepository<T> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly entity: EntityTarget<T>,
  ) {}

  async findOne(id: string): Promise<T | null> {
    return this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity as T);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, data as DeepPartial<T>);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findBy(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.findBy(where);
  }
} 