import { Listener, OrderCancelledEvent, Subjects } from "@bitickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)

        if(!ticket){
            throw new Error('Ticket not found')
        }

        ticket.set({orderId: undefined})
        await ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId
        })
        msg.ack()
    }

}