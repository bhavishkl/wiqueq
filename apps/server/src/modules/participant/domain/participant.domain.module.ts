import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { ParticipantDomainFacade } from './participant.domain.facade'
import { Participant } from './participant.model'

@Module({
  imports: [TypeOrmModule.forFeature([Participant]), DatabaseHelperModule],
  providers: [ParticipantDomainFacade, ParticipantDomainFacade],
  exports: [ParticipantDomainFacade],
})
export class ParticipantDomainModule {}
