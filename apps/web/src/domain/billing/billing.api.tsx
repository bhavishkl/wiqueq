import { HttpService } from '../../core/http'
import {
  BillingProduct,
  BillingSubscription,
  BillingPayment,
} from './billing.model'

export class BillingApi {
  static findManyProducts(): Promise<BillingProduct[]> {
    return HttpService.api.get(`/v1/billing/products`)
  }

  static findManySubscriptions(): Promise<BillingSubscription[]> {
    return HttpService.api.get(`/v1/users/me/billing/subscriptions`)
  }

  static findManyPayments(): Promise<BillingPayment[]> {
    return HttpService.api.get(`/v1/users/me/billing/payments`)
  }

  static createPaymentLink(productId: string): Promise<string> {
    return HttpService.api
      .post<any>(`/v1/users/me/billing/products/${productId}/payment-link`, {})
      .then(({ url }) => url)
  }
}
