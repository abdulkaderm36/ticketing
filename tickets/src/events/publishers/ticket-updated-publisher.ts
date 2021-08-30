import {Publisher, Subjects, TicketUpdatedEvent} from '@bitickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
}