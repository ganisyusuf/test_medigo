const request = require('supertest')
const { token, clientId, base, dokterTambah} = require('../config/config')

const req = {
        fullName: "",
        photo: "",
        gender: "",
        birthDate: "",
        idType: "",
        idNumber: "",
        phoneNumber: "",
        email: "",
        specializations: [{
            id: "wujdsn",
            healthCenterGroupId: "",
            mdId: "",
            description: "",
            specialties: [],
            relatedDiseases: [],
            code: "",
            label: ""
        }],
        polyclinicIds: [],
        defaultCAL: "",
        status: "active"
}

describe('Post Doctor Data to endpoints', () => {

    it('Berhasil input data with required data', async() => {
        req["fullName"] = "Ganis Maulia Ucup"
        req["birthDate"] = "1997-04-23"
        req["gender"] = "wanita"
        req["specializations"][0]["code"] = "S.Pd"
        req["specializations"][0]["label"] = "Pendidikan"
        req["defaultCAL"] = "0"

        const res = await request(base).post(dokterTambah)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
            .send(req)
        
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual('doctor has been created')
        expect(res.body.data).toHaveProperty('id')
        expect(res.body.data).toHaveProperty('healthCenterGroupId') 
    })

    it('Failed to insert because data required is null', async() => {
        req["fullName"] = ""
        req["birthDate"] = ""
        req["gender"] = ""
        req["specializations"][0]["code"] = ""
        req["specializations"][0]["label"] = ""
        req["defaultCAL"] = ""
        
        const res = await request(base).post(dokterTambah)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
            .send(req)

        expect(res.statusCode).toEqual(422)
        expect(res.body).toHaveProperty('code')
        expect(res.body.message).toEqual('Error Validasi Data')
        expect(res.body.errors[0].field).toEqual('fullName')
        expect(res.body.errors[1].field).toEqual('specializations.0.code')
        expect(res.body.errors[2].field).toEqual('specializations.0.label')
        expect(res.body.errors[3].field).toEqual('defaultCAL')
    })

    it('Failed to insert because data email is not valid', async() => {
        req["fullName"] = "Ganis Maulia Ucup"
        req["birthDate"] = "1997-04-23"
        req["gender"] = "wanita"
        req["specializations"][0]["code"] = "S.Pd"
        req["specializations"][0]["label"] = "Pendidikan"
        req["defaultCAL"] = "0"
        req["email"] = "uccups"
        
        const res = await request(base).post(dokterTambah)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
            .send(req)

        expect(res.statusCode).toEqual(422)
        expect(res.body).toHaveProperty('code')
        expect(res.body.message).toEqual('Error Validasi Data')
        expect(res.body.errors[0].message).toEqual('email must be a valid email')
        expect(res.body.errors[0].field).toEqual('email')
    })

    it('Failed to insert because data CAL is not number', async() => {
        req["fullName"] = "Ganis Maulia Ucup"
        req["birthDate"] = "1997-04-23"
        req["gender"] = "wanita"
        req["specializations"][0]["code"] = "S.Pd"
        req["specializations"][0]["label"] = "Pendidikan"
        req["defaultCAL"] = "jhgc6u"
        req["email"] = ""
        
        const res = await request(base).post(dokterTambah)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
            .send(req)

        expect(res.statusCode).toEqual(422)
        expect(res.body).toHaveProperty('code')
        expect(res.body.message).toEqual('Error Validasi Data')
        expect(res.body.errors[0].message).toEqual('defaultCAL must be a number')
        expect(res.body.errors[0].field).toEqual('defaultCAL')
    })

    it('Failed because idNumber (KTP) less than 16 digit', async() => {
        req["fullName"] = "Ganis Maulia Ucup"
        req["birthDate"] = "1997-04-23"
        req["gender"] = "wanita"
        req["specializations"][0]["code"] = "S.Pd"
        req["specializations"][0]["label"] = "Pendidikan"
        req["defaultCAL"] = "0"
        req["idType"] = "KTP"
        req["idNumber"] = "8761254421"

        const res = await request(base).post(dokterTambah)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
            .send(req)

        expect(res.statusCode).toEqual(422)
        expect(res.message).toEqual('Error Validasi Data')
        expect(res.body.errors[0].message).toEqual('Nomor Kartu Identitas harus 16 digit')
        expect(res.body.errors[0].field).toEqual('idNumber')
    })

    it('Failed to input data because validation of idNumber (KTP) is not digit', async() => {
        req["fullName"] = "Ganis Maulia Ucup"
        req["birthDate"] = "1997-04-23"
        req["gender"] = "wanita"
        req["specializations"][0]["code"] = "S.Pd"
        req["specializations"][0]["label"] = "Pendidikan"
        req["defaultCAL"] = "0"
        req["idType"] = "KTP"
        req["idNumber"] = "sdaa12314"

        const res = await request(base).post(dokterTambah)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
            .send(req)

        expect(res.statusCode).toEqual(422)
        expect(res.message).toEqual('Error Validasi Data')
        expect(res.body.errors[0].message).toEqual('Nomor Kartu Identitas harus berisi angka')
        expect(res.body.errors[0].field).toEqual('idNumber')
    })

    it('Failed to input data because validation average value of consultation > 600', async() => {
        req["fullName"] = "Ganis Maulia Ucup"
        req["birthDate"] = "1997-04-23"
        req["gender"] = "wanita"
        req["specializations"][0]["code"] = "S.Pd"
        req["specializations"][0]["label"] = "Pendidikan"
        req["defaultCAL"] = "700"
        req["idType"] = "KTP"
        req["idNumber"] = "8761254421"

        const res = await request(base).post(dokterTambah)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
            .send(req)
        
        expect(res.statusCode).toEqual(422)
        expect(res.body.errors[0]).toHaveProperty('field')
        expect(res.body.errors[0].field).toEqual('defaultCAL')
        expect(res.body.errors[0].message).toEqual('Nilai rata-rata konsultasi tidak boleh lebih dari 600')
    })

    it('Failed to input data because validation "Nama Dokter" > 50 karakter', async() => {
        req["fullName"] = "Ganis Maulia Ucupasijdkhfjaasbdjgfabofkjdgvwkjasgbciaskjfhdnkashbiasjfbaskjdgbasjfhasbjdhaskjgfvajlshdnakfyhuiqwho"
        req["birthDate"] = "1997-04-23"
        req["gender"] = "wanita"
        req["specializations"][0]["code"] = "S.Pd"
        req["specializations"][0]["label"] = "Pendidikan"
        req["defaultCAL"] = "700"
        req["idType"] = "KTP"
        req["idNumber"] = "8761254421"

        const res = await request(base).post(dokterTambah)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
            .send(req)

        expect(res.statusCode).toEqual(422)
        expect(res.body.errors[0]).toHaveProperty('field')
        expect(res.body.errors[0].field).toEqual('fullName')
        expect(res.body.errors[0].message).toEqual('fullName length must be less than or equal to 100 characters long')
    })

    it('Failed to input data because validation "Phone number" > 15 digit', async() => {
        req["fullName"] = "Ganis ucups hebat"
        req["birthDate"] = "1997-04-23"
        req["gender"] = "wanita"
        req["specializations"][0]["code"] = "S.Pd"
        req["specializations"][0]["label"] = "Pendidikan"
        req["defaultCAL"] = "700"
        req["idType"] = "KTP"
        req["idNumber"] = "8761254421"
        req["phoneNumber"] = "08976256612322232"

        const res = await request(base).post(dokterTambah)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
            .send(req)
        
        expect(res.statusCode).toEqual(422)
        expect(res.body.errors[0]).toHaveProperty('field')
        expect(res.body.errors[0].field).toEqual('phoneNumber')
        expect(res.body.errors[0].message).toEqual('phoneNumber length must be less than or equal to 15 characters long')
    })

    it('Failed to input data because validation "Phone number" is not digit', async() => {
        req["fullName"] = "Ganis ucups hebat"
        req["birthDate"] = "1997-04-23"
        req["gender"] = "wanita"
        req["specializations"][0]["code"] = "S.Pd"
        req["specializations"][0]["label"] = "Pendidikan"
        req["defaultCAL"] = "700"
        req["idType"] = "KTP"
        req["idNumber"] = "8761254421"
        req["phoneNumber"] = "asdsafs"

        const res = await request(base).post(dokterTambah)
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
            .send(req)
        
        expect(res.statusCode).toEqual(422)
        expect(res.body.errors[0]).toHaveProperty('field')
        expect(res.body.errors[0].field).toEqual('phoneNumber')
        expect(res.body.errors[0].message).toEqual('phoneNumber with value asdsafs fails to match the phone number pattern')
    })

    it('Search by Name', async() => {
        const res = await request(base).get(dokterTambah+"?status=all&fullName=ABDUL+HARIS+TRI+P.+Dr.Sp.PD&page=1&limit=10&sort=fullName&descending=false")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
        
        expect(res.statusCode).toEqual(200)
        expect(res.body.data[0].fullName).toEqual('ABDUL HARIS TRI P. Dr.Sp.PD')
    })

    it('Search by Name and no result if the is not mathcn', async() => {
        const res = await request(base).get(dokterTambah+"?status=all&fullName=haduhs&page=1&limit=10&sort=fullName&descending=false")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
        
        expect(res.statusCode).toEqual(200)
        expect(res.body.data.length).toEqual(0)
    })
})