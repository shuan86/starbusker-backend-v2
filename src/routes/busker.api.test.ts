import request from "supertest"
import { app } from '../app'
import * as memberRepo from "../repositories/memberRepo";
import * as buskerRepo from "../repositories/buskerRepo";
import {
    GetPerformancesType, BuskerPerformance, FrontEndPerformanceType
    , GetPerformanceType, FrontEndHighestOnlineAmountType, FrontEndFuturePerformanceDataType
} from "../entities/BuskerPerformance";

import { mockConnection } from "../mock/mockDbTestConnection";
import { prefixApiPath, apiPath } from "../config/router";
import * as mockRequestData from "../utils/request";
import { BuskerPerformanceComment, FrontEndHighestComentAmountType, FrontEndWeekCommentAmountType } from "../entities/BuskerPerformanceComment";
import { getCurrentFullTimeStr, addDay } from '../moudles/time';

beforeAll(async () => {
    const connection = await mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
});
let cookies;
let memberId;
let enrollBuskerData;
beforeEach(async () => {
    await mockConnection.clearAllRepo();
    const mockMember = memberRepo.generateFixedMemberMockData()
    const enrollResult = await request(app).post(prefixApiPath + apiPath.member).send({ ...mockRequestData.generateEncryptSendData(mockMember) })
    expect(enrollResult.statusCode).toBe(200);
    const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password)
    const res = await request(app).post(prefixApiPath + apiPath.login).send({ ...mockRequestData.generateEncryptSendData(loginData) }).expect(200);
    cookies = res.headers["set-cookie"].pop().split(";")[0];
    memberId = await memberRepo.getIdByAccount(mockMember.account)
    enrollBuskerData = buskerRepo.generateEnrollBusker("description", 0)
});
afterAll(async () => {
    // await memberRepo.clear()
    await mockConnection.close();
});
const requestEnrollBusker = async (data = null) => {
    const result = await request(app).post(prefixApiPath + apiPath.enrollBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateSendData({ ...data }) })
    return result
}
const requestApplyPerformance = async (data = null) => {
    const result = await request(app).post(prefixApiPath + apiPath.performance).set("Cookie", [cookies]).send({ ...mockRequestData.generateSendData({ ...data }) })
    return result
}
const requestDeletePerformance = async (data = null) => {
    const result = await request(app).delete(prefixApiPath + apiPath.performance).set("Cookie", [cookies]).send({ ...mockRequestData.generateSendData({ ...data }) })
    return result
}
const requestGetPerformance = async (data = null) => {
    const result = request(app).get(prefixApiPath + apiPath.performances)
        .set("Cookie", [cookies]).query({ ...mockRequestData.generateSendData({ ...data }) })
    return result
}
const requestGetHighestOnlineAmount = async (data = null) => {
    const result = request(app).get(prefixApiPath + apiPath.onlineAmount)
        .set("Cookie", [cookies])
    return result
}
const requestGetHighestCommentAmount = async (data = null) => {
    const result = request(app).get(prefixApiPath + apiPath.commentAmount)
        .set("Cookie", [cookies])
    return result
}
const requestWeekCommentAmount = async (data = null) => {
    const result = request(app).get(prefixApiPath + apiPath.weekCommentAmount)
        .set("Cookie", [cookies])
    return result
}
const requestFuturePerformancesData = async (data = null) => {
    const result = request(app).get(prefixApiPath + apiPath.futurePerformancesData)
        .set("Cookie", [cookies])
    return result
}
const requestGetPerformancesDonate = async (data = null) => {
    const result = request(app).get(prefixApiPath + apiPath.performancesDonate)
        .set("Cookie", [cookies])
    return result
}
describe(`test post ${prefixApiPath}${apiPath.enroll}(enroll busker)`, () => {
    it(" it should return status 200 if correct enroll", async () => {
        const enrollResult = await requestEnrollBusker(enrollBuskerData)
        expect(enrollResult.statusCode).toBe(200);
    });
    it(" it should return status 200 if  repeat enroll", async () => {
        const enrollResult = await requestEnrollBusker(enrollBuskerData)
        expect(enrollResult.statusCode).toBe(200);
        const enrollResult1 = await requestEnrollBusker(enrollBuskerData)
        expect(enrollResult1.statusCode).toBe(401)
    });
    it(" it should return status 401 if use incorrect parameter", async () => {
        const enrollResult1 = await requestEnrollBusker()
        expect(enrollResult1.statusCode).toBe(400)
    });


});
describe(`test post ${prefixApiPath}${apiPath.performance}( Apply busker performance)`, () => {
    let performanceData
    beforeEach(async () => {
        await requestEnrollBusker(enrollBuskerData)
        performanceData = buskerRepo.generateDiffPerformanceData(memberId, getCurrentFullTimeStr())
    });

    it(" it should return status 200 if correct apply", async () => {
        const result = await requestApplyPerformance(performanceData)
        expect(result.statusCode).toBe(200);
    });
    it(" it should return status 400 if incorrect apply", async () => {
        const result = await requestApplyPerformance()
        expect(result.statusCode).toBe(400);
    });
});
describe(`test delete ${prefixApiPath}${apiPath.performance}( Delete busker performance)`, () => {
    let applyData: FrontEndPerformanceType
    beforeEach(async () => {
        await requestEnrollBusker(enrollBuskerData)
        const performanceData = buskerRepo.generateDiffPerformanceData(memberId, getCurrentFullTimeStr())
        const applyResult = await requestApplyPerformance(performanceData)
        applyData = JSON.parse(applyResult.text)
    });
    it(" it should return status 200 if use correct perofrmance id", async () => {
        const performanceData: GetPerformanceType = { performanceId: applyData.performanceId }
        const result = await requestDeletePerformance(performanceData)
        expect(result.statusCode).toBe(200);
    });
    it(" it should return status 200 if use correct perofrmance id", async () => {
        const performanceData: GetPerformanceType = { performanceId: applyData.performanceId }
        const result = await requestDeletePerformance(performanceData)
        expect(result.statusCode).toBe(200);
    });
});
describe(`test get ${prefixApiPath}${apiPath.performancesTime}(get all time of busker performance)`, () => {
    beforeEach(async () => {
        await requestEnrollBusker(enrollBuskerData)
        const performanceData = buskerRepo.generateDiffPerformanceData(memberId, getCurrentFullTimeStr())
        const applyResult = await request(app).post(prefixApiPath + apiPath.performance).set("Cookie", [cookies]).send({ ...mockRequestData.generateSendData({ ...performanceData }) })
    });

    it(" it should return status 200 if correct enroll", async () => {
        const result = await request(app).get(prefixApiPath + apiPath.performancesTime).set("Cookie", [cookies]).send({})
        expect(result.statusCode).toBe(200);
    });

});
describe(`test get ${prefixApiPath}${apiPath.performance}(get specific busker performance)`, () => {
    let performanceData: BuskerPerformance
    beforeEach(async () => {
        const enrollBuskerResult = await requestEnrollBusker(enrollBuskerData)
        performanceData = buskerRepo.generateDiffPerformanceData(memberId, getCurrentFullTimeStr())
        const applyResult = await requestApplyPerformance(performanceData)
    });
    it(" it should return status 200 if use correct format", async () => {
        const getPerformancesData: GetPerformancesType = {
            page: 1,
            time: performanceData.time
        }
        const result = await requestGetPerformance(getPerformancesData)
        expect(result.statusCode).toBe(200);
    });
    it(" it should return status 400 if use incorrect format", async () => {
        const getPerformancesData: GetPerformancesType = {
            page: 1,
            time: performanceData.time
        }
        const result = await requestGetPerformance()
        expect(result.statusCode).toBe(400);
    });
});
describe(`test get ${prefixApiPath}${apiPath.performancesDonate}(get all performances donate )`, () => {
    let performanceData: BuskerPerformance
    beforeEach(async () => {
        const enrollBuskerResult = await requestEnrollBusker(enrollBuskerData)
        performanceData = buskerRepo.generateDiffPerformanceData(memberId, getCurrentFullTimeStr())
        const applyResult = await requestApplyPerformance(performanceData)
    });
    it(" it should return status 200 if use correct member id", async () => {
        const result = await requestGetPerformancesDonate()
        expect(result.statusCode).toBe(200);
    });

});
describe(`test get ${prefixApiPath}${apiPath.onlineAmount} ${prefixApiPath}${apiPath.commentAmount} ${prefixApiPath}${apiPath.weekCommentAmount}(
    getTop5NewestHighestOnlineAmount :get  your Newest number of people in the chat room (only top 5 new)
    getTop5HighestCommentAmount:get  your highest amount of comments (only top 5 high)
    getWeekCommentAmount:Get one week comments
    getFuturePerformancesData:get Future performances data
    )`, () => {
    let performanceData: BuskerPerformance
    beforeEach(async () => {
        const enrollBuskerResult = await requestEnrollBusker(enrollBuskerData)
        const curTimeStr = getCurrentFullTimeStr()

        for (let i = 1; i < 1; i++) {
            const buskerId = await buskerRepo.getIdByMemberId(memberId)
            const futurePerformanceResponse = await buskerRepo.applyPerformance(memberId, buskerRepo.generatePerformance(buskerId, 'mockTitle', 'mockDecscription'
                , addDay(curTimeStr, i), `110台北市信義區市府路${i}號`))
            for (let j = 0; j < 1; j++) {
                performanceData = buskerRepo.generateDiffPerformanceData(buskerId, addDay(curTimeStr, -(j)))
                const applyResult = await requestApplyPerformance(performanceData)
                const performanceReponseData: FrontEndPerformanceType = JSON.parse(applyResult.text)
                console.error('performanceData:', performanceData);
                await buskerRepo.createPerformanceComment(new BuskerPerformanceComment(
                    buskerId, performanceData.id, memberId, `${i}`, addDay(curTimeStr, -(j))
                ))
                // await buskerRepo.createPerformanceComment({
                //     id: 0, buskerId: buskerId, performanceId: performanceData.id
                //     , comment: `${i}`, time: addDay(curTimeStr, -(j)), memberId: memberId, buskerPerformance: undefined, busker: undefined
                //     , member: undefined
                // })
                await buskerRepo.updateMaxChatroomOnlineAmount(performanceReponseData.performanceId, i)
            }
        }

    });
    it(" getTop5NewestHighestOnlineAmount:it should return status 200 if use correct  member id", async () => {
        const result = await requestGetHighestOnlineAmount()
        const data: FrontEndHighestOnlineAmountType = JSON.parse(result.text)
        expect(result.status).toBe(200)
    });
    it(" getTop5HighestCommentAmount:it should return status 200 if use correct  member id", async () => {
        const result = await requestGetHighestCommentAmount()
        const data: FrontEndHighestComentAmountType = JSON.parse(result.text)
        expect(result.status).toBe(200)
    });
    it(" getWeekCommentAmount:it should return status 200 if use correct  member id", async () => {
        const result = await requestWeekCommentAmount()
        const data: FrontEndWeekCommentAmountType = JSON.parse(result.text)
        expect(result.status).toBe(200)
    });
    it(" getFuturePerformancesData:it should return status 200 if use correct  member id", async () => {
        const result = await requestFuturePerformancesData()
        const data: FrontEndFuturePerformanceDataType = JSON.parse(result.text)
        expect(result.status).toBe(200)
    });

});
