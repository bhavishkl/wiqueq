import { AiApi } from './ai/ai.api'
import { AuthenticationApi } from './authentication/authentication.api'
import { AuthorizationApi } from './authorization/authorization.api'
import { BillingApi } from './billing/billing.api'
import { UploadApi } from './upload/upload.api'

import { UserApi } from './user/user.api'

import { NotificationApi } from './notification/notification.api'

import { QueueApi } from './queue/queue.api'

import { ParticipantApi } from './participant/participant.api'

import { FavoriteApi } from './favorite/favorite.api'

import { BookingApi } from './booking/booking.api'

import { ReviewApi } from './review/review.api'

import { ServiceApi } from './service/service.api'

import { QueueCategoryApi } from './queueCategory/queueCategory.api'

export namespace Api {
  export class Ai extends AiApi {}
  export class Authentication extends AuthenticationApi {}
  export class Authorization extends AuthorizationApi {}
  export class Billing extends BillingApi {}
  export class Upload extends UploadApi {}

  export class User extends UserApi {}

  export class Notification extends NotificationApi {}

  export class Queue extends QueueApi {}

  export class Participant extends ParticipantApi {
    static remove(participantId: string) {
      throw new Error('Method not implemented.')
    }
}

  export class Favorite extends FavoriteApi {}

  export class Booking extends BookingApi {
    static remove(bookingId: string) {
      throw new Error('Method not implemented.')
    }
}

  export class Review extends ReviewApi {}

  export class Service extends ServiceApi {}

  export class QueueCategory extends QueueCategoryApi {}
}
