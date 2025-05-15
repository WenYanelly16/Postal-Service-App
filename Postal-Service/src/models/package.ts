//models/package.ts
import pool from '../config/db.js';

interface PackageData {
  package_id?: number;
  sender_name: string;
  receiver_name: string;
  sender_address: string;
  receiver_address: string;
  weight: number;
  cost_per_unit_weight: number;
  tracking_number: string;
  status?: string;
  shipping_method?: string;
}

export class Package {
  package_id?: number;
  sender_name: string;
  receiver_name: string;
  sender_address: string;
  receiver_address: string;
  weight: number;
  cost_per_unit_weight: number;
  tracking_number: string;
  status: string;
  shipping_method: string;

  constructor({
    package_id,
    sender_name,
    receiver_name,
    sender_address,
    receiver_address,
    weight,
    cost_per_unit_weight,
    tracking_number,
    status = 'created',
    shipping_method = 'standard'
  }: PackageData) {
    this.package_id = package_id;
    this.sender_name = sender_name;
    this.receiver_name = receiver_name;
    this.sender_address = sender_address;
    this.receiver_address = receiver_address;
    this.weight = weight;
    this.cost_per_unit_weight = cost_per_unit_weight;
    this.tracking_number = tracking_number;
    this.status = status;
    this.shipping_method = shipping_method;
  }

  calculateCost(): number {
    const baseCost = this.weight * this.cost_per_unit_weight;
    let methodFee = 0;

    if (this.shipping_method === 'one-day') {
      methodFee = 15;
    } else if (this.shipping_method === 'two-day') {
      methodFee = 10;
    }

    return baseCost + methodFee;
  }

  generateLabel(): string {
    return `
══════════════════════════════════
           SHIPPING LABEL           
══════════════════════════════════
Tracking #: ${this.tracking_number}

FROM:
Name: ${this.sender_name}
Address: ${this.sender_address}

TO:
Name: ${this.receiver_name}
Address: ${this.receiver_address}

══════════════════════════════════
Weight: ${this.weight}kg
Status: ${this.status}
Method: ${this.shipping_method}
Cost: $${this.calculateCost().toFixed(2)}
══════════════════════════════════
    `.trim();
  }

  static validStatuses: string[] = ['created', 'in-transit', 'delivered', 'returned'];

  static validateStatus(status: string): boolean {
    return this.validStatuses.includes(status.toLowerCase());
  }

  static async create(data: {
    senderName: string;
    receiverName: string;
    senderAddress: string;
    receiverAddress: string;
    weight: number;
    costPerUnitWeight?: number;
    shippingMethod?: string;
  }): Promise<Package> {
    try {
      const tracking_number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const status = 'created';

      const result = await pool.query(
        `INSERT INTO packages (
          sender_name, receiver_name, sender_address, receiver_address,
          weight, cost_per_unit_weight, tracking_number, status, shipping_method
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          data.senderName,
          data.receiverName,
          data.senderAddress,
          data.receiverAddress,
          data.weight,
          data.costPerUnitWeight ?? 5,
          tracking_number,
          status,
          data.shippingMethod ?? 'standard'
        ]
      );

      return new this(result.rows[0]);
    } catch (error: any) {
      console.error('Database error:', {
        message: error.message,
        constraint: error.constraint,
        detail: error.detail
      });
      throw new Error(`Failed to create package: ${error.message}`);
    }
  }

  static async findByTrackingNumber(tracking_number: string): Promise<Package | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM packages WHERE tracking_number = $1',
        [tracking_number]
      );

      if (result.rows.length === 0) return null;
      return new this(result.rows[0]);
    } catch (error: any) {
      throw new Error(`Failed to find package: ${error.message}`);
    }
  }

  static async findAll(): Promise<Package[]> {
    try {
      const result = await pool.query(
        'SELECT * FROM packages ORDER BY created_at DESC'
      );
      return result.rows.map((row: any) => new this(row));
    } catch (error: any) {
      console.error('Database error in findAll:', error);
      throw error;
    }
  }

  static async updateStatus(tracking_number: string, newStatus: string): Promise<Package> {
    if (!this.validateStatus(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    try {
      const result = await pool.query(
        'UPDATE packages SET status = $1 WHERE tracking_number = $2 RETURNING *',
        [newStatus.toLowerCase(), tracking_number]
      );

      if (result.rows.length === 0) {
        throw new Error(`Package with tracking number ${tracking_number} not found.`);
      }

      return new this(result.rows[0]);
    } catch (error: any) {
      throw new Error(`Failed to update status: ${error.message}`);
    }
  }

  static async delete(tracking_number: string): Promise<Package | null> {
    try {
      const result = await pool.query(
        'DELETE FROM packages WHERE tracking_number = $1 RETURNING *',
        [tracking_number]
      );
      return result.rows[0] ? new this(result.rows[0]) : null;
    } catch (error: any) {
      throw new Error(`Failed to delete package: ${error.message}`);
    }
  }
}

