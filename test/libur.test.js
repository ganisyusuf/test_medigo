const request = require('supertest')
const { token, clientId, base, libur} = require('../config/config')

describe('E2e test Libur Nasional', () => {

    it("Berhasil input data liburan", async() => {
        const req = {"date":"2019-11-20", "label":"Liburan Gathering"}

        const res = await request(base).post(libur)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            }).send(req)

        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty("data")
    })

    it("Check data yang berhasil diinputkan", async() => {
        const res = await request(base).get(libur)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
        
        expect(res.statusCode).toEqual(200)
        console.log(res.body.data.length)
        expect(res.body.data[res.body.data.length - 1].label).toEqual("Liburan Gathering")
    })
})