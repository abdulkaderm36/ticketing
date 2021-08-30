import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import request from 'supertest';
import {app} from '../app'

declare global {
    var signin: (id?:string) => string[];
}

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_51JT5r5Eu2LDQUl0LXPXjhu1IMKSd2C0c5UEXRUE8x46weR2N5hXJ6OVsf0aXXJXK97zKwZu9d3pmOtrZj9N0H6TG00aFvho7ma'

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf'

    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()

    for(let collection of collections){
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = (id?: string) => {
    // BUild a JWT payload. {id, email}
    const payload = {
        id: id || mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com"
    }

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    // Build session Object. {jwt: MY_JWT}
    const session = {jwt: token}

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session)

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64')

    // return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`]
}