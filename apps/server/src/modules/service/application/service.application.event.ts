export namespace ServiceApplicationEvent {
  export namespace ServiceCreated {
    export const key = 'service.application.service.created'

    export type Payload = {
      id: string
      userId: string
    }
  }
}
