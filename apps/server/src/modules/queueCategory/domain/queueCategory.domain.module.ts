import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { QueueCategoryDomainFacade } from './queueCategory.domain.facade'
import { QueueCategory } from './queueCategory.model'

@Module({
  imports: [TypeOrmModule.forFeature([QueueCategory]), DatabaseHelperModule],
  providers: [QueueCategoryDomainFacade, QueueCategoryDomainFacade],
  exports: [QueueCategoryDomainFacade],
})
export class QueueCategoryDomainModule {}
