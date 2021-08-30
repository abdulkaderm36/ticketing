import { OrderCancelledEvent, Publisher, Subjects } from "@bitickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled
}