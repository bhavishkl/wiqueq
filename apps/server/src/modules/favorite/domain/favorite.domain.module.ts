import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { FavoriteDomainFacade } from './favorite.domain.facade'
import { Favorite } from './favorite.model'

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), DatabaseHelperModule],
  providers: [FavoriteDomainFacade, FavoriteDomainFacade],
  exports: [FavoriteDomainFacade],
})
export class FavoriteDomainModule {}
