import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  sendEmail(): string {
    console.log("Email sent");
    return "Email sent";
  }
  sendInvoice(orderId: number): string {
    console.log(`Invoice sent for order ${orderId}`);
    return `Invoice sent for order ${orderId}`;
  }
}
