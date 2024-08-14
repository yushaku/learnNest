import { Controller, Get } from '@nestjs/common'

import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Welcome API' })
  getHello() {
    return { message: 'Welcome to API' }
  }

  @Get('/healthz')
  @ApiOperation({
    summary:
      'A health check is positive if all the assigned health indicators are up and running.',
  })
  @ApiOkResponse({
    description:
      'A health check is positive if all the assigned health indicators are up and running.',
  })
  healthCheck() {
    return this.health.check([() => this.db.pingCheck('database')])
  }
}
