import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@bitickets/common"
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id)

        // If no ticket, throw error
        if(!ticket){
            throw new Error('Ticket no Found')
        }

        // Mark the ticket as being reserved by the setting its orderId property
        ticket.set({orderId: data.id})

        // Save Ticket
        await ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })

        // ack the message
        msg.ack()
    }

}