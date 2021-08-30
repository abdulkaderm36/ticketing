import { PaymentCreatedEvent, Publisher, Subjects } from "@bitickets/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}