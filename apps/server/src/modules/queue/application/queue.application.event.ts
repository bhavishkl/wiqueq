export namespace QueueApplicationEvent {
  export namespace QueueCreated {
    export const key = 'queue.application.queue.created'

    export type Payload = {
      id: string
      userId: string
    }
  }
}
