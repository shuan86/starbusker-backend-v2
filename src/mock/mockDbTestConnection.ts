import { createConnection, getConnection } from 'typeorm';
import config from "../config/ormconfig";
import { clear as clearMemberData } from '../repositories/memberRepo'
import { clear as clearBuskerData } from '../repositories/buskerRepo'
import { redisClient } from "../app";
// import { clear as clearBuskerData } from '../repositories/per'

export const mockConnection = {
    async create() {
        return await createConnection(config);
    },

    async close() {
        // await clearBuskerData()
        // await clearMemberData()
        if (redisClient) {
            redisClient.quit();
        }
        await getConnection().close();
    },
    async clear() {


        const connection = getConnection();
        const entities = connection.entityMetadatas;
        await Promise.all(entities.map(async (entity) => {
            const repository = connection.getRepository(entity.name);
            await repository.query(`DELETE FROM ${entity.tableName}`);
        }));
    },
    async clearAllRepo() {

        await clearBuskerData()
        await clearMemberData()
        // const connection = getConnection();
        // const entities = connection.entityMetadatas;
        // await Promise.all(entities.map(async (entity) => {
        //     const repository = connection.getRepository(entity.name);
        //     await repository.query(`DELETE FROM ${entity.tableName}`);
        // }));
    },
};