import { TicketUpdatedEvent } from "@bitickets/common"
import mongoose from "mongoose"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"

const setup = async () => {
    // Create an instance of the listner
    const listener = new TicketUpdatedListener(natsWrapper.client)
    
    // Create and save a ticket
    const ticket = await Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    })
    await ticket.save()

    // Create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: mongoose.Types.ObjectId().toHexString(),
    }

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, data, msg, ticket}
}

it('finds, updates, and saves a ticket', async () => {
    const {listener, data, msg, ticket} = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message', async () => {
    const {listener, data, msg} = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()

})

it('does not call ack if the event has a skipped version number', async () => {
    const {msg, data, listener, ticket} = await setup()

    data.version = 10

    try{
        await listener.onMessage(data, msg)
    }catch(err){

    }

    expect(msg.ack).not.toHaveBeenCalled()

})