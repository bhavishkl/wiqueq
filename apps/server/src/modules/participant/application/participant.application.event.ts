export namespace ParticipantApplicationEvent {
  export namespace ParticipantCreated {
    export const key = 'participant.application.participant.created'

    export type Payload = {
      id: string
      userId: string
    }
  }
}
