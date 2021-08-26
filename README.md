# starbusker-backend-v2

## Introduction

This project is an API Server for buskers, named StarBusker,we propose an innovative interactive model by creating a real-time anonymous interactive board through the Web to provide buskers and viewers with a different interactive model,
bringing down the invisible wall between buskers and viewers in the past.

The following is the introduction video of StarBusker

[youtube](https://www.youtube.com/watch?v=5EMPqfQ8q2A&ab_channel=%E7%BE%85%E5%A3%AB%E6%AC%BD)

The following is the front-end of StarBusker

[front-end page]()

The following is the front-end of source code

[github]()

## Tech Stack

**Server:** TypeScript, Node, Express, Mysql, Redis, Session, TypeORM

**API:** [Line login](https://developers.line.biz/zh-hant/), [Line pay](https://developers.line.biz/zh-hant/), [Information for busker](https://opendata.culture.tw/frontsite/openData/detail?datasetId=539), [Busker exhibition space information](https://opendata.culture.tw/frontsite/openData/detail?datasetId=540)

## Running Sever

If you wish to run the server, the first step is installing [Node.js](https://nodejs.org/en/)

### Download server need packages

```
npm install
```

### Start Server

1. Setup database environment,open **test.env dev.env prod.env** file,modify following parameter

```
MYSQL_USERNAME=root
MYSQL_PASSWORD=123456
MYSQL_DB=test
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
| `200` | sucessful login   | `"{account: "t0",avatar: "",email: "t0@gmail.com",exp: 0,isBusker: false,male: true,name:"0_name"}`" |
| `400` | parameter error   | `"parameter error"`                                                                                  |
| `401` | login fail        | `"login fail"`                                                                                       |
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

### Get member info

`Get api/memberInfo`

##### Response

| Code  | Description               | Result                                             |
| :---- | :------------------------ | :------------------------------------------------- |
| `200` | sucessful get member info | `"{name:'',account:'',email:'','description:'',}"` |
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

##### Response

| Code  | Description                  | Result                                            |
| :---- | :--------------------------- | :------------------------------------------------ |
| `200` | sucessful update member info | `""`                                              |
| `401` | failed to update member info | `"failed to get member info、you aren't member "` |
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
| `200` | sucessful apply   | `""`                                   |
| `400` | parameter error   | `"parameter error"`                    |
| `401` | failed to apply   | `"failed to apply、you aren't member"` |
| `500` | server is busying | `"server is busying"`                  |

---

### Get all time of busker performance

##### Requset

`get api/performancesTime`

##### Response

| Code  | Description        | Result                                   |
| :---- | :----------------- | :--------------------------------------- |
| `200` | sucessful get data | `[{"time":"2021-08-16T09:26:00.000Z"}]`" |
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
| `200` | sucessful get data | `[[{"id":1,"title":"title1","description":"description1","time":"2021-08-16T08:17:01.000Z","lineMoney":0,"latitude":121.56,"longitude":25.03}],1(data amount)]`" |
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
| `200` | sucessful add performance | `""`                                             |
| `400` | parameter error           | `"parameter error"`                              |
| `401` | failed to apply           | `"failed to apply、you aren't member or busker"` |
| `500` | server is busying         | `"server is busying"`                            |

## License

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
