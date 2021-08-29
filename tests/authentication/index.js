const chai = require('chai')
const createApp = require('../../src/lib/createApp')
const db = require('../../src/sequelize/index')
const request = require('supertest')
const truncate = require('../truncate')

const expect = chai

describe('Authentication tests', () => {
    let server;
    const BASE_URL = '/auth';

    before(async() => {
        await truncate();
        await db.User.destroy({where: {}});

        const app  = await createApp();
        server = app.listen(5000);
    });

    after(async () => {
        await server.close();
    })

    describe('Post /auth/register', () => {
        it('Should create new user account', async () => {
            const {status} = await request(server)
                .post(`${BASE_URL}/register`)
                .send({
                    username: "lawrence katuva",
                    email:  "larry.katuva@gmail.com",
                    password:  "qazwsxedc",
                    country:  "Kenya",
                    county:  "Kitui",
                    dateOfBirth:  "15-08-1998",
                    phone:  "0720460519",
                    imageUrl:  "image"
                });
                expect(status).to.equal(201)
        });

        it('Should not create user account more than once', async () => {
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
            await request(server)
                .post(`${BASE_URL}/register`)
                .send(data)
            const {status} = await request(server)
                .post(`${BASE_URL}/register`)
                .send(data)
            expect(status).to.equal(400)
        })
    })

    describe('Post /auth/login', () => {
        it('Should login user', async () => {
            await request(server)
                .post(`${BASE_URL}/register`)
                .send({
                    username: "lawrence katuva",
                    email:  "larry.katuva@gmail.com",
                    password:  "qazwsxedc",
                    country:  "Kenya",
                    county:  "Kitui",
                    dateOfBirth:  "15-08-1998",
                    phone:  "0720460519",
                    imageUrl:  "image"
                })
            const {status} = await request(server)
                .post(`${BASE_URL}/login`)
                .send({
                    username: "lawrence katuva",
                    email:  "larry.katuva@gmail.com"
                })
            expect(status).to.equal(200)
        })

        it('Should not login user with user with invalid email', async () => {
            const data = {
                email:  "larry.katuva@gmail.com1",
                password:  "qazwsxedc"
            };
            const {status} = await request(server)
                .post(`${BASE_URL}/login`)
                .send(data)
            expect(status).to.equal(401)
        })

        it('Should not login user with user with invalid details', async () => {
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
})

