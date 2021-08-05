import { createConnection, getConnection } from 'typeorm';
import config from "../config/ormconfig";
export const mockConnection = {
    async create() {
        return await createConnection(config);
    },

    async close() {
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
};

