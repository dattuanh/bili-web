import { PartialType } from '@nestjs/swagger';
import { QueryResult } from 'typeorm';

export class TypeORMQueryResult extends PartialType(QueryResult) {
  affected?: number;
}
