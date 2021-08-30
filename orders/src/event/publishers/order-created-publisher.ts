import { OrderCreatedEvent, Publisher, Subjects } from "@bitickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated
}