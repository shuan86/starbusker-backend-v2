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
1. Setup database environment,open **.env** file,modify following parameter
```
MYSQL_USERNAME=root
MYSQL_PASSWORD=123456
MYSQL_DB=test
```
2. Open your terminal and run following command,server will listen on port  3000
``` 
npm run tsc-prod
```
## API Server
###  Enroll member
#### Requset
`Post api/member`
| Parameter | Type     | Require |Description                |
| :-------- | :------- | :------- | :------------------------- |
| `account` | `string` | **Required** |member's account (maximum length:20,minimum length:2)|
| `password` | `string` | **Required** |member's password (maximum length:20,minimum length:2)|
| `male` | `bool` | **Required** |member's male (true:man,false:woman)|
| `email` | `string` | **Required** |member's email (maximum length:20,minimum length:2)|
| `name` | `string` | **Required** |member's name (maximum length:20,minimum length:2)|

#### Response
##### Code:200
##### Description:sucessful enroll
##### Code:400
##### Description:enroll parameter error 
##### Code:401
##### Description:enroll fail
##### Code:500
##### Description:server is busying  
******
###  Enroll busker
#### Requset
`Post api/busker`
| Parameter | Type     | Require |Description                |
| :-------- | :------- | :------- | :------------------------- |
| `account` | `string` | **Required** |member's account (maximum length:20,minimum length:2)|
| `password` | `string` | **Required** |member's password (maximum length:20,minimum length:2)|
| `male` | `bool` | **Required** |member's male (true:man,false:woman)|
| `email` | `string` | **Required** |member's email (maximum length:20,minimum length:2)|
| `name` | `string` | **Required** |member's name (maximum length:20,minimum length:2)|

#### Response
##### Code:200
##### Description:sucessful enroll
##### Code:400
##### Description:enroll parameter error 
##### Code:401
##### Description:enroll fail 
******
###  Login
#### Requset
`Post api/login`
| Parameter | Type     | Require |Description                |
| :-------- | :------- | :------- | :------------------------- |
| `account` | `string` | **Required** |member's account|
| `password` | `string` | **Required** |member's password|
#### Response
##### Code:200
##### Description:sucessful login 
``` json
{"memberId":1,"status":"new"}
```
##### Code:400
##### Description:client parameter error 
##### Code:401
##### Description:client login fail 
******
## License
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
