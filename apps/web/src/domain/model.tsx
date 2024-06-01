import { AuthorizationRole as AuthorizationRoleModel } from './authorization/authorization.model'
import {
  BillingPayment as BillingPaymentModel,
  BillingProduct as BillingProductModel,
  BillingSubscription as BillingSubscriptionModel,
} from './billing/billing.model'

import { User as UserModel } from './user/user.model'

import { Notification as NotificationModel } from './notification/notification.model'

import { Queue as QueueModel } from './queue/queue.model'

import { Participant as ParticipantModel } from './participant/participant.model'

import { Favorite as FavoriteModel } from './favorite/favorite.model'

import { Booking as BookingModel } from './booking/booking.model'

import { Review as ReviewModel } from './review/review.model'

import { Service as ServiceModel } from './service/service.model'

import { QueueCategory as QueueCategoryModel } from './queueCategory/queueCategory.model'

export namespace Model {
  export class AuthorizationRole extends AuthorizationRoleModel {}
  export class BillingProduct extends BillingProductModel {}
  export class BillingPayment extends BillingPaymentModel {}
  export class BillingSubscription extends BillingSubscriptionModel {}

  export class User extends UserModel {}

  export class Notification extends NotificationModel {}

  export class Queue extends QueueModel {}

  export class Participant extends ParticipantModel {}

  export class Favorite extends FavoriteModel {}

  export class Booking extends BookingModel {}

  export class Review extends ReviewModel {}

  export class Service extends ServiceModel {}

  export class QueueCategory extends QueueCategoryModel {}
}
