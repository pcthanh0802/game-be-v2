/*
    Base service interface 
*/

export interface IBaseService<T> {
  create(dto: Partial<Record<keyof T, unknown>>): Promise<T | null>;
  findAll(): Promise<T[] | null>;
  findOne(conditions: any): Promise<T | null>;
  update(
    id: number,
    updateDto: Partial<Record<keyof T, unknown>>,
  ): Promise<boolean>;
  remove(id: number): Promise<boolean>;
}
