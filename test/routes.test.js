const request = require('supertest')
const { username, password, clientId, base, login} = require('../config/config')
dataToken = ""

describe('POST Login to endpoints', () => {
 
    test('Faild with invalid credentials login username / password', async() => {
        const req = {
            username: 'admintestakses',
            password: 'admintestakses'
        }

        const res = await request(base).post(login)
            .set({
                "x-medigo-client-id": clientId,
            })
            .send(req)
        
        expect(res.statusCode).toEqual(400)
        expect(res.body.code).toEqual("bad_request")
        expect(res.body.message).toEqual("Username or password is not match")
    });

    test("Failed with invalid credentials client-id", async() => {
        const xClientId = clientId + "wiqdknfkj"
        
        const res = await request(base).post(login)
            .set({
                "x-medigo-client-id": xClientId
            })
            .send({
                username : username,
                password : password,
            })
        
        expect(res.statusCode).toEqual(500)
        // expect(res.body.code).toEqual("invalid_client_key")
        // expect(res.body.message).toEqual("Invalid Medigo Client Key")
    })

    test("Failed if missing variable", async() => {
        const req = {
            username: "dsada",
            password: ""
        }

        const res = await request(base).post(login)
            .set({
                "x-medigo-client-id": clientId
            })
            .send(req)
        
        expect(res.statusCode).toEqual(422)
        expect(res.body).toHaveProperty('code')
        expect(res.body.errors[0].field).toEqual('password')
    })

    test('Success login with correct credentials', async() => {
        
        const res = await request(base).post(login)
            .set({
                "x-medigo-client-id": clientId,
            })
            .send({
                username : username,
                password : password,
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    });
})

