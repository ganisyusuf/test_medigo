const request = require('supertest')
const { token, clientId, base, cuti} = require('../config/config')
   
describe("E2E test Cuti", () => {
  
    it("Berhasil Menambah data", async() => {
        const req = {
            "doctor": {
                "id": "5dcfee2e8a14f9002ac12af3",
                "fullName": "Ganis Maulia Ucup"
            },
            "practiceIds": [],
            "startDate": "2019-11-29",
            "endDate": "2019-11-29",
            "note": "Haloo"
        }

        const res = await request(base).post(cuti)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            }).send(req)

        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("Leave has been created")
        expect(res.body.data).toHaveProperty("doctor")
    })

    it("Delete data liburan", async() => {
        const res = await request(base).delete(cuti+"/5dd2b304f1349e005520c6be")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
        
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("Leave has been deleted")
        expect(res.body.data).toHaveProperty("doctor")
        expect(res.body.data.doctor.id).toEqual("5dd2b304f1349e005520c6be")
    })
})