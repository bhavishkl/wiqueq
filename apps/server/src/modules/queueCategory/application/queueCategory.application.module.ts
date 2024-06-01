import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { QueueCategoryDomainModule } from '../domain'
import { QueueCategoryController } from './queueCategory.controller'

@Module({
  imports: [AuthenticationDomainModule, QueueCategoryDomainModule],
  controllers: [QueueCategoryController],
  providers: [],
})
export class QueueCategoryApplicationModule {}
