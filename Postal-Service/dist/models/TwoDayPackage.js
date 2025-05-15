//models/TwodayPackage.js
import { Package } from './package.js';

export class TwoDayPackage extends Package {
  constructor({
    sender_name,
    receiver_name,
    sender_address,
    receiver_address,
    weight,
    cost_per_unit_weight,
    tracking_number,
    status,
    shipping_method
  }) {
    super({
      sender_name,
      receiver_name,
      sender_address,
      receiver_address,
      weight,
      cost_per_unit_weight,
      tracking_number,
      status,
      shipping_method
    });
    this.flatFee = 10;
  }

  calculateCost() {
    return (this.weight * this.cost_per_unit_weight) + this.flatFee;
  }
}