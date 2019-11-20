const request = require('supertest')
const { token, clientId, base, jadwal} = require('../config/config')

const req = {
	"patientDetail": {
		"healthCenterId": null,
		"mrn": null,
		"userId": null,
		"fullName": null,
		"phoneNumber": null,
		"email": null,
		"gender": null,
		"idType": null,
		"idNumber": null,
		"idPhoto": null,
		"selfIdPhoto": null,
		"birthDate": null,
		"marriageStatus": null,
		"religion": null,
		"nationality": null,
		"address": {
			"province": null,
			"city": null,
			"district": null,
			"village": null,
			"detail": null
		},
		"medicalHistory": {
			"bloodType": null,
			"rhesusType": null,
			"height": null,
			"weight": null,
			"diseasesHistory": null,
			"isSmoking": null
		},
		"verified": false,
		"isGuarded": false,
		"relationToGuardian": null
	},
	"scheduleId": null,
	"date": null,
	"slotNumber": null,
	"paymentType": null,
	"guarantor": null,
	"status": "pending"
}

describe ('End2end testing Jadwal Dokter', () => {
    it('Search by Name polyclinic and no result if the is match', async() => {
        const res = await request(base).get(jadwal+"?shortened=true&page=1&limit=1&date=2019-11-11&search=akupuntur")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
        
        expect(res.statusCode).toEqual(200)
        expect(res.body.data[0].practice.polyclinic.name).toEqual("Akupuntur")
    })

    it('Search by Name doctor and no result if the is match', async() => {
        const res = await request(base).get(jadwal+"?shortened=true&page=1&limit=10&date=2019-11-11&search=ABDNER+PENALEMEN+B,+Dr.+SpRM")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            })
        
        expect(res.statusCode).toEqual(200)
        expect(res.body.data[0].practice.doctor.fullName).toEqual("ABDNER PENALEMEN B, Dr. SpRM")
    })

    it('Create Reservation doctor', async() => {
        req["patientDetail"]["fullName"] = "Ucup Pasien"
        req["patientDetail"]["birthDate"] = "1997-02-09"
        req["patientDetail"]["gender"] = "pria"
        req["patientDetail"]["phoneNumber"] = "08976256622"
        req["patientDetail"]["idType"] = "KTP"
        req["patientDetail"]["idNumber"] = "3321568231"
        req["date"] = "2019-11-19"
        req["scheduleId"] = "5dd00933dbf9020034951011"
        req["slotNumber"] = 5
        req["status"] = "pending"

        const res = await request(base).post("/hc/reservation?ignoreTime=false&realtime=true")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            }).send(req)
        
        expect(res.statusCode).toEqual(200)
        expect(res.body.data).toHaveProperty("patientDetail")
        expect(res.body.data).toHaveProperty("schedule")
        expect(res.body.data).toHaveProperty("doctor")
        expect(res.body.data).toHaveProperty("polyclinic")
        expect(res.body.data).toHaveProperty("slotTaken")
    })

    it('Create Reservation doctor, slot unavailable', async() => {
        req["patientDetail"]["fullName"] = "Ucup Pasien"
        req["patientDetail"]["birthDate"] = "1997-02-09"
        req["patientDetail"]["gender"] = "pria"
        req["patientDetail"]["phoneNumber"] = "08976256622"
        req["patientDetail"]["idType"] = "KTP"
        req["patientDetail"]["idNumber"] = "3321568231"
        req["date"] = "2019-11-19"
        req["scheduleId"] = "5dd00933dbf9020034951011"
        req["slotNumber"] = 4
        req["status"] = "pending"

        const res = await request(base).post("/hc/reservation?ignoreTime=false&realtime=true")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            }).send(req)
        
        expect(res.statusCode).toEqual(400)
        expect(res.body.code).toEqual("bad_request")
        expect(res.body.message).toEqual("slot_already_taken")
    })

    it('Create Reservation doctor, parameter is missing', async() => {
        req["patientDetail"]["fullName"] = ""
        req["patientDetail"]["birthDate"] = ""
        req["patientDetail"]["gender"] = "pria"
        req["patientDetail"]["phoneNumber"] = ""
        req["patientDetail"]["idType"] = ""
        req["patientDetail"]["idNumber"] = ""
        req["date"] = ""
        req["scheduleId"] = ""
        req["slotNumber"] = ""
        req["status"] = ""

        const res = await request(base).post("/hc/reservation?ignoreTime=false&realtime=true")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            }).send(req)
        
        expect(res.statusCode).toEqual(422)
        expect(res.body.errors[0].field).toEqual("scheduleId")
        expect(res.body.errors[0].message).toEqual("scheduleId is not allowed to be empty")
        expect(res.body.errors[1].field).toEqual("date")
        expect(res.body.errors[1].message).toEqual("date must be a number of milliseconds or valid date string")
        expect(res.body.errors[2].field).toEqual("slotNumber")
        expect(res.body.errors[2].message).toEqual("slotNumber must be a number")
        expect(res.body.errors[3].field).toEqual("patientDetail.fullName")
        expect(res.body.errors[3].message).toEqual("fullName is not allowed to be empty")
        expect(res.body.errors[4].field).toEqual("status")
        expect(res.body.errors[4].message).toEqual("status is not allowed to be empty")
        expect(res.body.errors[5].field).toEqual("status")
        expect(res.body.errors[5].message).toEqual("status must be one of [draft, cancelled, pending, done, rescheduled, problematic]")
    })

    it('Create Reservation doctor, Email is invalid', async() => {
        req["patientDetail"]["fullName"] = "Ucup Pasien"
        req["patientDetail"]["birthDate"] = "1997-02-09"
        req["patientDetail"]["gender"] = "pria"
        req["patientDetail"]["phoneNumber"] = "08976256622"
        req["patientDetail"]["idType"] = "KTP"
        req["patientDetail"]["idNumber"] = "3321568231"
        req["date"] = "2019-11-19"
        req["scheduleId"] = "5dd00933dbf9020034951011"
        req["slotNumber"] = 2
        req["status"] = "pending"
        req["patientDetail"]["email"] = "ucup"

        const res = await request(base).post("/hc/reservation?ignoreTime=false&realtime=true")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            }).send(req)
        
        expect(res.statusCode).toEqual(422)
        expect(res.body.errors[0].field).toEqual("patientDetail.email")
        expect(res.body.errors[0].field).toEqual("Email is not valid")
    })

    it('Create Reservation doctor, id Number > 50 digit', async() => {
        req["patientDetail"]["fullName"] = "Ucup Pasien"
        req["patientDetail"]["birthDate"] = "1997-02-09"
        req["patientDetail"]["gender"] = "pria"
        req["patientDetail"]["phoneNumber"] = "08976256622"
        req["patientDetail"]["idType"] = "KTP"
        req["patientDetail"]["idNumber"] = "5465626981424798126712312481276312i847126312834172653712312412"
        req["date"] = "2019-11-19"
        req["scheduleId"] = "5dd00933dbf9020034951011"
        req["slotNumber"] = 3
        req["status"] = "pending"

        const res = await request(base).post("/hc/reservation?ignoreTime=false&realtime=true")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            }).send(req)
        
        expect(res.statusCode).toEqual(422)
        expect(res.body.errors[0].field).toEqual("patientDetail.idNumber")
        expect(res.body.message).toEqual("IdNumber must be less than 50 character")
    })

    it('Create Reservation doctor, id Number > 50 digit', async() => {
        req["patientDetail"]["fullName"] = "Ucup Pasien"
        req["patientDetail"]["birthDate"] = "1997-02-09"
        req["patientDetail"]["gender"] = "pria"
        req["patientDetail"]["phoneNumber"] = "08976256622"
        req["patientDetail"]["idType"] = "KTP"
        req["patientDetail"]["idNumber"] = "5465626981424798126712312481276312i847126312834172653712312412"
        req["date"] = "2019-11-19"
        req["scheduleId"] = "5dd00933dbf9020034951011"
        req["slotNumber"] = 3
        req["status"] = "pending"

        const res = await request(base).post("/hc/reservation?ignoreTime=false&realtime=true")
            .set({
                "x-medigo-client-id": clientId,
                "Authorization" : 'Bearer ' + token
            }).send(req)
        
        expect(res.statusCode).toEqual(422)
        expect(res.body.errors[0].field).toEqual("patientDetail.idNumber")
        expect(res.body.message).toEqual("IdNumber must be less than 50 character")
    })
})