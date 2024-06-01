export namespace FavoriteApplicationEvent {
  export namespace FavoriteCreated {
    export const key = 'favorite.application.favorite.created'

    export type Payload = {
      id: string
      userId: string
    }
  }
}
