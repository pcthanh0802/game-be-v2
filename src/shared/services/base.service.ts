import { Injectable } from '@nestjs/common';
import {
  BaseEntity,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { IBaseService } from '../interfaces/base.interface';

@Injectable()
export abstract class BaseService<T extends BaseEntity>
  implements IBaseService<T>
{
  constructor(
    private readonly repository: Repository<T>,
    private readonly modelName: string,
  ) {}

  async create(dto: Partial<Record<keyof T, unknown>>): Promise<T | null> {
    const newObj = this.repository.create({ ...dto } as DeepPartial<T>);
    const insertObj = this.repository.save(newObj);

    if (!insertObj) {
      throw Error(`Cannot create new ${this.modelName}`);
    }
    return newObj;
  }

  async update(
    id: number,
    updateDto: Partial<Record<keyof T, unknown>>,
  ): Promise<boolean> {
    const updateObj = await this.repository.update(id, { ...updateDto } as any);
    return updateObj.affected > 0;
  }

  async findAll(): Promise<T[] | null> {
    const objects = await this.repository.find();
    return objects;
  }

  async find(conditions: any): Promise<T[] | null> {
    return await this.repository.find(conditions as FindManyOptions<T>);
  }

  async findOne(conditions: any): Promise<T> {
    return await this.repository.findOne(conditions as FindOneOptions<T>);
  }

  async remove(id: number): Promise<boolean> {
    const deletedObj = await this.repository
      .createQueryBuilder()
      .delete()
      .where('id=:id', { id })
      .execute();

    return deletedObj.affected > 0;
  }

  async removeByConditions(conditions: any): Promise<boolean> {
    const deletedObj = await this.repository.delete(
      conditions as FindOptionsWhere<T>,
    );
    return deletedObj.affected > 0;
  }
}
