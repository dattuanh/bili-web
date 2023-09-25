import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  @Transactional()
  async getUnusedTable() {
    const getTableNamesSql = `SELECT table_name as "tableName"
      FROM information_schema.tables
      WHERE table_schema='public'
      AND table_type='BASE TABLE';`;

    const result = (await this.dataSource.query(getTableNamesSql)) as Array<{
      tableName: string;
    }>;
    const tableNames: string[] = [];

    for (const { tableName } of result) {
      const isExisted = this.dataSource.entityMetadatas.find(
        (item) => item.tableName === tableName,
      );
      if (isExisted) continue;

      tableNames.push(tableName);
    }

    return tableNames;
  }

  @Transactional()
  async deleteUnusedTable(tableNames: string[]) {
    await Promise.all(
      tableNames.map(async (item) => {
        await this.dataSource.query(`DROP TABLE ${item} CASCADE;`);
      }),
    );
  }
}
