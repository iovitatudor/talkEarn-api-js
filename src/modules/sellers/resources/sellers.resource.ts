import { Model } from 'sequelize';
import { ExpertsResource } from '../../experts/resources/experts.resource';

export class SellerResource {
  public id: number;
  public expertId: number;
  public merchantId: string;
  public merchantIdInPaypal: string;
  public permissionsGranted: string;
  public consentStatus: string;
  public productIntentId: string;
  public isEmailConfirmed: boolean;
  public accountStatus: string;
  public expert: object;

  public constructor(seller) {
    if (seller) {
      this.id = seller.id;
      this.merchantId = seller.merchant_id;
      this.merchantIdInPaypal = seller.merchant_id_in_paypal;
      this.permissionsGranted = seller.permissions_granted;
      this.consentStatus = seller.consent_status;
      this.productIntentId = seller.product_intent_id;
      this.isEmailConfirmed = seller.is_email_confirmed;
      this.accountStatus = seller.account_status;

      if (seller.expert) {
        this.expert = new ExpertsResource(seller.expert);
      }
    }
  }

  public static collect(model: Model[]): SellerResource[] {
    if (model) {
      return model.map((item) => {
        return new SellerResource(item);
      });
    }
    return [];
  }
}
