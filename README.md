# starbusker-backend-v2

## Introduction

This project is an API Server for buskers, named StarBusker,we propose an innovative interactive model by creating a real-time anonymous interactive board through the Web to provide buskers and viewers with a different interactive model,
bringing down the invisible wall between buskers and viewers in the past.

The following is the introduction video of StarBusker

[youtube](https://www.youtube.com/watch?v=5EMPqfQ8q2A&ab_channel=%E7%BE%85%E5%A3%AB%E6%AC%BD)


The following is the front-end of source code

[github](https://github.com/shuan86/starbusker-frontend-v2)

## Tech Stack

**Server:** TypeScript, Node, Express, Mysql, Redis, Session, TypeORM

**API:** 
[Google login](https://console.cloud.google.com/apis/dashboard?hl=zh-tw&project=disco-song-312608)
[Geocoder api](https://developers.google.com/maps/documentation/geocoding/overview)
[Facebook login](https://developers.facebook.com/docs/facebook-login/web/)
[Line login](https://developers.line.biz/zh-hant/)
[Line pay](https://developers.line.biz/zh-hant/)
[Information for busker](https://opendata.culture.tw/frontsite/openData/detail?datasetId=539)
[Busker exhibition space information](https://opendata.culture.tw/frontsite/openData/detail?datasetId=540)

## Running Sever

If you wish to run the server, the first step is installing [Node.js](https://nodejs.org/en/)

### Download server need packages

```
npm install
```

### Start Server

1. Setup database environment,open **test.env dev.env prod.env** file,modify following parameter

```
CLIENT_URL=http://localhost:3000
MYSQL_HOST=your mysql host 
MYSQL_USERNAME=your mysql user name
MYSQL_PASSWORD=your mysql password
MYSQL_DB=your database name

SESSION_SECRET=your session seceret

GOOGLE_MAP_API_KRY=your google map key

LINE_LOGIN_CHANNEL_ID=your line login channel id
LINE_LOGIN_CHANNEL_SECRET=your line login channel secret
LINE_LOGIN_CALLBACK_URL=your line login callback url

LINE_PAY_ID=your line pay id
LINE_PAY_PASSWORD=your line pay password
LINE_PAY_CHANNEL_ID=your line pay channel id
LINE_PAY_SECRET=your line pay secret

FB_CLIENT_ID=your facebook client id
FB_CLIENT_SECRET=your facebook client secret
FB_CALLBACK_URL=your facebook callback url

GOOGLE_KEY=your google login key
GOOGLE_SECRET=your google login secret
GOOGLE_CALLBACK_URL=your google login callback url

GMAIL_ACCOUNT=your gmail account
GMAIL_PASSWORD=your gmail password
```

2. Setup RSA password,pubkic key and private key,modify following parameter

```
priPassword = 'your password'
privateKey='-----BEGIN ENCRYPTED PRIVATE KEY-----   -----END ENCRYPTED PRIVATE KEY-----'
publicKey='-----BEGIN PUBLIC KEY----- -----END PUBLIC KEY-----'
```

3. Open your terminal and run following command,server will listen on port 3000

```
npm run tsc-prod
```
4. Create fake data,input  following url in your browser
```
http://localhost:8081/api/init
```
## API Server

### Enroll member

##### Requset

`Post api/member`
`The request needs to be encrypted `
| Parameter | Type | Require |Description |
| :-------- | :------- | :------- | :------------------------- |
| `account` | `string` | **Required** |member's account (maximum length:20,minimum length:2)|
| `password` | `string` | **Required** |member's password (maximum length:20,minimum length:2)|
| `male` | `bool` | **Required** |member's male (true:man,false:woman)|
| `email` | `string` | **Required** |member's email (maximum length:20,minimum length:2)|
| `name` | `string` | **Required** |member's name (maximum length:20,minimum length:2)|

##### Response

| Code  | Description       | Result                |
| :---- | :---------------- | :-------------------- |
| `200` | sucessful enroll  | `"sucessful enroll"`  |
| `400` | parameter errort  | `"parameter error"`   |
| `401` | member is exist   | `"member is Exist"`   |
| `500` | server is busying | `"server is busying"` |

---

### Login

##### Requset

`Post api/login`
`The request needs to be encrypted `
| Parameter | Type | Require |Description |
| :-------- | :------- | :------- | :------------------------- |
| `account` | `string` | **Required** |member's account|
| `password` | `string` | **Required** |member's password|

##### Response

| Code  | Description       | Result                                                                                               |
| :---- | :---------------- | :--------------------------------------------------------------------------------------------------- |
| `200` | sucessful login   | `"{account: "t0",avatar: "",email: "t0@gmail.com",exp: 0,isBusker: false,male: true,name:"0_name",loginMode:0(0:local,1:Line,2:Facebook,3:Google)}`|
| `400` | parameter error   | `"parameter error"` |
| `401` | login fail        | `"login fail"`|
| `500` | server is busying | `"server is busying"`                                                                                |

---

### Logout

##### Requset

`Post api/logout`
`you need to login first`

##### Response

| Code  | Description       | Result                |
| :---- | :---------------- | :-------------------- |
| `200` | sucessful logout  | `""`                  |
| `401` | logout fail       | `"logout fail"`       |
| `500` | server is busying | `"server is busying"` |

---


### forgot password

##### Requset
`Post api/forgotPassword`

| Parameter | Type | Require |Description |
| :-------- | :------- | :------- | :------------------------- |
| `email` | `string` | **Required** |member's email|

##### Response
| Code  | Description       | Result                |
| :---- | :---------------- | :-------------------- |
| `200` | sucessful send new password email  | `""`|
| `400` | parameter error   | `"parameter error"` |
| `401` | change password fail | `"change password fail"`       |
| `500` | server is busying | `"server is busying"` |
---
### Get member info

`Get api/memberInfo`

##### Response

| Code  | Description               | Result                                             |
| :---- | :------------------------ | :------------------------------------------------- |
| `200` | sucessful get member info | `"{account: "t0",avatar: "",email: "t0@gmail.com",exp: 0,isBusker: false,male: true,name:"0_name",loginMode:0(0:local,1:Line,2:Facebook,3:Google)}"` |
| `401` | failed to get member info | `"failed to get member info、you aren't member "`  |
| `500` | server is busying         | `"server is busying"`                              |

---

### Update member info

`Put api/memberInfo`
`you need to login first and the request needs to be encrypted`

##### Requset

| Parameter  | Type     | Require      | Description       |
| :--------- | :------- | :----------- | :---------------- |
| `name`     | `string` | **Required** | member's name     |
| `email`    | `string` | **Required** | member's email    |
| `password` | `string` | **Required** | member's password |
| `avatar`   | `File` | **Required** | member's file |

##### Response

| Code  | Description                  | Result                                            |
| :---- | :--------------------------- | :------------------------------------------------ |
| `200` | sucessful update member info | `"{account: "t0",avatar: "",email: "t0@gmail.com",exp: 0,isBusker: false,male: true,name:"0_name",loginMode:0(0:local,1:Line,2:Facebook,3:Google)}`                                              |
| `400` | parameter error   | `"parameter error"` |
| `401` | failed to update member info | `"failed to get member info you aren't member "` |
| `500` | server is busying            | `"server is busying"`                             |

---


### Update member password

`Put api/password`
`you need to login first and the request needs to be encrypted`

##### Requset

| Parameter  | Type     | Require      | Description       |
| :--------- | :------- | :----------- | :---------------- |
| `oldPassword`     | `string` | **Required** | member's old password     |
| `newPassword`    | `string` | **Required** | member's new password    |
##### Response

| Code  | Description                  | Result                                            |
| :---- | :--------------------------- | :------------------------------------------------ |
| `200` | sucessful update member password | `""`                                              |
| `400` | parameter error   | `"parameter error"` |
| `401` | failed to update member password | `"failed to get member info、you aren't member "` |
| `500` | server is busying            | `"server is busying"`                             |

---
### Apply busker

##### Requset

`Post api/busker`
`you need to login first and the request needs to be encrypted`
| Parameter | Type | Require |Description |
| :-------- | :------- | :------- | :------------------------- |
| `description` | `string` | **Required** |performance's description (maximum length:200,minimum length:1)|
| `type` | `number` | **Required** |performance's type (0:other,1:singer,2:drawer,3:drummer)|

##### Response

| Code  | Description       | Result                                 |
| :---- | :---------------- | :------------------------------------- |
| `200` | sucessful apply   | `"{account: "t0",avatar: "",email: "t0@gmail.com",exp: 0,isBusker: false,male: true,name:"0_name",loginMode:0(0:local,1:Line,2:Facebook,3:Google)}"`                                  |
| `400` | parameter error   | `"parameter error"`                    |
| `401` | failed to apply   | `"failed to apply、you aren't member"` |
| `500` | server is busying | `"server is busying"`                  |

---
### Get busker info

##### Requset

`Get api/busker`
`you need to login first `
| Parameter | Type | Require |Description |
| :-------- | :------- | :------- | :------------------------- |
| `id` | `number` | **Required** |busker id|
##### Response
| Code  | Description       | Result                                 |
| :---- | :---------------- | :------------------------------------- |
| `200` | sucessful get   | `{name:'a',type:0(buskerType),description:'description1',likeAmount:10,avatar:'',linePayOrderUrl:''}` |
| `400` | parameter error   | `"parameter error"`                    |
| `401` | failed to get   | `"failed to apply、you aren't member"` |
| `500` | server is busying | `"server is busying"`                  |
---
### Get all time of busker performance

##### Requset

`get api/performancesTime`

##### Response

| Code  | Description        | Result                                   |
| :---- | :----------------- | :--------------------------------------- |
| `200` | sucessful get data | `[{time:"2021-08-16T09:26:00.000Z"}]`" |
| `500` | server is busying  | `"server is busying"`                    |

---

### Get buskers performances data

##### Requset

`get api/performances`
| Parameter | Type | Require |Description |
| :-------- | :------- | :------- | :------------------------- |
| `time` | `string` | **Required** |performances's time(ex:2021-08-16)|
| `page` | `number` | **Required** |performances's data (10 records per item)|

##### Response

| Code  | Description        | Result                                                                                                                                                           |
| :---- | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200` | sucessful get data | `{dataArr:[{name:'a',id:1(buskerId),likeAmount:0,title:"title1",description:"description1",time:"2021-08-16T08:17:01.000Z",location:'taipei',lineMoney:0,latitude:121.56,longitude:25.03,avatar:''}],dataAmount:1}"` |
| `400` | parameter error    | `"parameter error"`                                                                                                                                              |
| `500` | server is busying  | `"server is busying"`                                                                                                                                            |

---
### Apply busker performance
##### Requset
`post api/performance`
`you need to login first`
| Parameter | Type | Require |Description |
| :-------- | :------- | :------- | :------------------------- |
| `title` | `string` | **Required** |performance's title|
| `description` | `string` | **Required** |performance's description|
| `time` | `Date` | **Required** |performance's time|
| `location` | `string` | **Required** |performance's location|

##### Response
| Code  | Description               | Result                                           |
| :---- | :------------------------ | :----------------------------------------------- |
| `200` | sucessful add performance | `{performanceId:4200,name:"busker",email:"account01@email.com",location:"Taipei",description:"Description1",title:"唱歌",latitude:25.0329636,longitude:121.5654268,time:"2021-09-23 05:48:00"}`                                             |
| `400` | parameter error           | `"parameter error"`                              |
| `401` | failed to apply           | `"failed to apply、you aren't member or busker"` |
| `500` | server is busying         | `"server is busying"`                            |
---
### Get all performances donate 
##### Requset
`get api/performancesDonate`
`you need to login first`
##### Response
| Code  | Description               | Result                                           |
| :---- | :------------------------ | :----------------------------------------------- |
| `200` | sucessful get data | `"{amount:0}"` |
| `400` | parameter error           | `"parameter error"`                              |
| `401` | failed to get             | `"failed to get data"` |
| `500` | server is busying         | `"server is busying"`                            |

---
### Get furtrure performances data 
##### Requset
`get api/furtrurePerformances `
`you need to login first`
##### Response

| Code  | Description               | Result                                           |
| :---- | :------------------------ | :----------------------------------------------- |
| `200` | sucessful get data | `" [{performanceId:"1",title:"Taipei",location:"",time:"2021/09/11 20:00"}]"` |
| `400` | parameter error           | `"parameter error"`                              |
| `401` | failed to get             | `"failed to get data"` |
| `500` | server is busying         | `"server is busying"`                            |
---
### Get  your newest amount  of online people in the chat room (only top 5 new)
##### Requset
`get api/onlineAmount`
`you need to login first`
##### Response

| Code  | Description               | Result                                           |
| :---- | :------------------------ | :----------------------------------------------- |
| `200` | sucessful get data | `"[{ highestOnlineAmount: 9, time: '2021-10-09 00:00:01' }]"` |
| `400` | parameter error           | `"parameter error"`                              |
| `401` | failed to get           | `"failed to get data"` |
| `500` | server is busying         | `"server is busying"`                            |
---
### Get  your highest amount of comments (only top 5 high)
##### Requset
`get api/commentAmount`
`you need to login first`
##### Response

| Code  | Description               | Result                                           |
| :---- | :------------------------ | :----------------------------------------------- |
| `200` | sucessful get data | `" [{count:"1",time:"2021-10-09 "}]"` |
| `400` | parameter error           | `"parameter error"`                              |
| `401` | failed to get             | `"failed to get data"` |
| `500` | server is busying         | `"server is busying"`                            |
---
### Get one week comments 
##### Requset
`get api/weekComments `
`you need to login first`
##### Response

| Code  | Description               | Result                                           |
| :---- | :------------------------ | :----------------------------------------------- |
| `200` | sucessful get data | `" [count:"1",time:"2021/09/11"}]"` |
| `400` | parameter error           | `"parameter error"`                              |
| `401` | failed to get             | `"failed to get data"` |
| `500` | server is busying         | `"server is busying"`                            |
---
## Contributors 
[shuan86(backend+frontend)](https://github.com/shuan86)
[s490607(frontend)](https://github.com/s490607)
[yaya75315(frontend)](https://github.com/yaya75315)
[HsiuHsu(designer)](https://github.com/HsiuHsu)
## Awards
2020資料創新應用競賽-AWS 協辦  銅獎
[IThome news](https://www.ithome.com.tw/pr/137868)
![image](https://github.com/shuan86/starbusker-backend-v2/blob/develop/award/StarBusker_新聞截圖.png)
![image](https://github.com/shuan86/starbusker-backend-v2/blob/develop/award/StarBusker_銅獎合照.jpg)
## License

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
