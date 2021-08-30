import { ExpirationCompleteEvent, Publisher, Subjects } from "@bitickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}