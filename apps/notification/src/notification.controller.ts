import { Controller, Get, Inject } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject("AUTH_CLIENT") private readonly client: ClientProxy,
  ) {}

  @MessagePattern("email_notification")
  messageHello(@Payload() data: any, @Ctx() context: RmqContext): string {
    return this.notificationService.sendEmail();
  }
  @MessagePattern("order_delivered")
  async orderDelivereds(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const { orderId } = data;
    return this.notificationService.sendInvoice(orderId);
  }
}
