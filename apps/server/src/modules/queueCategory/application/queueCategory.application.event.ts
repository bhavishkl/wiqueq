export namespace QueueCategoryApplicationEvent {
  export namespace QueueCategoryCreated {
    export const key = 'queueCategory.application.queueCategory.created'

    export type Payload = {
      id: string
      userId: string
    }
  }
}
