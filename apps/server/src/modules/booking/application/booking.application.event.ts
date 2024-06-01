export namespace BookingApplicationEvent {
  export namespace BookingCreated {
    export const key = 'booking.application.booking.created'

    export type Payload = {
      id: string
      userId: string
    }
  }
}
