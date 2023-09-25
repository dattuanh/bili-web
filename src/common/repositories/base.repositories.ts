import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { I18nPath } from '../../i18n/i18n.generated';
import { NotFoundExc } from '../exceptions/custom.exception';

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  abstract entityNameI18nKey: I18nPath;
  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  async findFirst(options: FindOneOptions<T>) {
    return super.findOne(options);
  }

  async findFirstBy(options: FindOptionsWhere<T>) {
    return super.findOne({ where: options });
  }

  /**
   * Override to reduce one redundant query.
   * https://github.com/typeorm/typeorm/issues/5694.
   * Must use with where condition to return unique row, if not this will cause performance issue.
   */
  async findOne(options: FindOneOptions<T>): Promise<T> {
    const [result] = await this.find({ ...options });

    return result;
  }

  async findOneBy(
    options: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<T> {
    const [result] = await this.findBy(options);

    return result;
  }

  /**
   * Override to reduce one redundant query.
   * https://github.com/typeorm/typeorm/issues/5694.
   * Must use with where condition to return unique row, if not this will cause performance issue.
   */
  async findOneWithoutRelation(options: FindOneOptions<T>): Promise<T> {
    const [result] = await this.find({ ...options, take: 1 });

    return result;
  }

  /**
   * Override to reduce one redundant query.
   * https://github.com/typeorm/typeorm/issues/5694.
   * Must use with where condition to return unique row, if not this will cause performance issue.
   */
  async findOneByWithoutRelation(whereOpts: FindOptionsWhere<T>): Promise<T> {
    const [result] = await this.find({ where: whereOpts, take: 1 });

    return result;
  }

  /**
   * Override to reduce one redundant query.
   * https://github.com/typeorm/typeorm/issues/5694.
   * Must use with where condition to return unique row, if not this will cause performance issue.
   */
  async findOneOrThrowNotFoundExc(options: FindManyOptions<T>) {
    const [result] = await this.find(options);
    if (!result)
      throw new NotFoundExc({
        message: [this.entityNameI18nKey, 'common.word.notFound'],
      });

    return result;
  }

  /**
   * Override to reduce one redundant query.
   * https://github.com/typeorm/typeorm/issues/5694.
   * Must use with where condition to return unique row, if not this will cause performance issue.
   */
  async findOneByOrThrowNotFoundExc(
    conditions: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ) {
    const [result] = await this.findBy(conditions);
    if (!result)
      throw new NotFoundExc({
        message: [this.entityNameI18nKey, 'common.word.notFound'],
      });

    return result;
  }
}
