import { Body, Controller, Delete, Get } from '@nestjs/common';
import { ParseArrayPipe } from '@nestjs/common/pipes';
import { ApiBody } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { AppService } from '../services/app.service';
import { AuthenticateAdmin } from '../../common/decorators/auth.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
  ) {}

  @Get()
  rootRoute() {
    return 'ok';
  }

  @AuthenticateAdmin()
  @Get('unused-table')
  getUnusedTable() {
    return this.appService.getUnusedTable();
  }

  @AuthenticateAdmin()
  @Delete('unused-tables')
  @ApiBody({
    schema: {
      properties: { tableNames: { type: 'array', items: { type: 'string' } } },
    },
  })
  deleteUnusedTables(
    @Body('tableNames', new ParseArrayPipe({ items: String }))
    tableNames: string[],
  ) {
    return this.appService.deleteUnusedTable(tableNames);
  }
}
