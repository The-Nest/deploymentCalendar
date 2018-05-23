import { ObjectID, FilterQuery, FindOneOptions } from 'mongodb';

import { IMember } from '../../../shared/types/member/member';

export interface IMembersRepository {
  filter(filter?: FilterQuery<IMember>, projection?: FindOneOptions): Promise<IMember[]>;
  find(filter?: FilterQuery<IMember>, projection?: FindOneOptions): Promise<IMember>;

  insert(document: IMember): Promise<ObjectID>;

  replace(document: IMember, filter: FilterQuery<IMember>): Promise<number>;

  update(patch: any, filter?: FilterQuery<IMember>): Promise<number>;

  delete(filter: FilterQuery<IMember>): Promise<number>;
}
