import chai from 'chai'
import {createApp} from '../../src/lib/createApp'
import db from '../../src/sequelize/models/index'
import request from 'supertest'
import {truncate} from '../truncate'

const {expect} = chai

describe('Authentication tests', () => {
    let server;
    const BASE_URL = '/auth';

    /**
     * runs once before the first test in this block
     * Clearing the database tables and initializing the server
     */
    before(async() => {
        await truncate();
        await db.User.destroy({where: {}});

        const app  = await createApp();
        server = app.listen(5000);
    });

    /**
     * runs once after the last test in this block
     * Closing the server method
     */
    after(async () => {
        await server.close();
    })

    /**
     * Tesitng register api endpoints
     */
    describe('Post /auth/register', () => {
        //If registration is successful
        it('Should create new user account', async () => {
            const {status} = await request(server)
                .post(`${BASE_URL}/register`)
                .send({
                    username: "lawrence katuva",
                    email:  "llarry.katuva@gmail.com",
                    password:  "qazwsxedc",
                    country:  "Kenya",
                    county:  "Kitui",
                    dateOfBirth:  "15-08-1998",
                    phone:  "0720460519",
                    imageUrl:  "image"
                });
                expect(status).to.equal(201)
        });

        //If registration not successful due to already existsing email
        it('Should not create user account more than once', async () => {
            const data = {
                username: "lawrence katuva",
                email:  "llarry.katuva@gmail.com",
                password:  "qazwsxedc",
                country:  "Kenya",
                county:  "Kitui",
                dateOfBirth:  "15-08-1998",
                phone:  "0720460519",
                imageUrl:  "image"
            }
            await request(server)
                .post(`${BASE_URL}/register`)
                .send(data)
            const {status} = await request(server)
                .post(`${BASE_URL}/register`)
                .send(data)
            expect(status).to.equal(400)
        })
    })

    /**
     * Tesitng login api endpoints
     */
    describe('Post /auth/login', () => {
        let id = 0;
        //Login not successful due to unverified email 
        it('Should not  login user with unverified email', async () => {
            const data = {
                username: "lawrence katuva",
                email:  "larry.katuva@gmail.com",
                password:  "qazwsxedc",
                country:  "Kenya",
                county:  "Kitui",
                dateOfBirth:  "15-08-1998",
                phone:  "0720460519",
                imageUrl:  "image"
            }
            const {body} = await request(server)
                .post(`${BASE_URL}/register`)
                .send(data)
                id = body.newUser.id
            const  {status} = await request(server)
                .post(`${BASE_URL}/login`)
                .send({
                    email:  "larry.katuva@gmail.com",
                    password:  "qazwsxedc"
                })
            expect(status).to.equal(400)   
        })

        //Verifying registered user email
        it('Should verify user email', async () => {
            const {status} = await request(server)
                .patch(`${BASE_URL}/activate/${id}`)
            expect(status).to.equal(200)
        })

        //Should allow user login with unexisting email accounts
        it('Should not login user with invalid email', async () => {
            const data = {
                email:  "larry.katuva@gmail.com1",
                password:  "qazwsxedc"
            };
            const {status} = await request(server)
                .post(`${BASE_URL}/login`)
                .send(data)
            expect(status).to.equal(400)
        })

        //Should not allow user login with invalid password details
        it('Should not login user with invalid details', async () => {
            const data = {
                email:  "larry.katuva@gmail.com",
                password:  "qazwsxedc1"
            };
            const {status} = await request(server)
                .post(`${BASE_URL}/login`)
                .send(data)
            expect(status).to.equal(401)
        })
    })

    /**
     * Tesitng activate api endpoints
     */
    describe('Post /auth/activate/{userId}', () => {
        //Should be able to send activation link to registered email
        it('Should send an activation link email', async () => {
            const {status} = await request(server)
                .post(`${BASE_URL}/request-reset-password-link`)
                .send({
                    email:  "larry.katuva@gmail.com"
                })
            expect(status).to.equal(200)
        })

        //Should not sent activation link to unavailable email 
        it('Should not send activation link to unavailable email', async () => {
            const {status} = await request(server)
                .post(`${BASE_URL}/request-reset-password-link`)
                .send({
                    email:  "larry.katuva@gmail.com1"
                })
            expect(status).to.equal(400)
        })
    })
})

