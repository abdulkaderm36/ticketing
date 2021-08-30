import {Publisher, Subjects, TicketCreatedEvent} from '@bitickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}