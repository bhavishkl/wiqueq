import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { FavoriteDomainModule } from '../domain'
import { FavoriteController } from './favorite.controller'

import { UserDomainModule } from '../../../modules/user/domain'

import { FavoriteByUserController } from './favoriteByUser.controller'

import { QueueDomainModule } from '../../../modules/queue/domain'

import { FavoriteByQueueController } from './favoriteByQueue.controller'

@Module({
  imports: [
    AuthenticationDomainModule,
    FavoriteDomainModule,

    UserDomainModule,

    QueueDomainModule,
  ],
  controllers: [
    FavoriteController,

    FavoriteByUserController,

    FavoriteByQueueController,
  ],
  providers: [],
})
export class FavoriteApplicationModule {}
