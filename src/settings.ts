export const settings = {
    logging: {
        level: 'debug'
    },
    port: 3000,
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'app'
    },
    pg: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '123456',
        database: 'app'
    },
    snowflake: {
        databaseid: 1,
        workerid: 1,
        sequence: 1
    }
}