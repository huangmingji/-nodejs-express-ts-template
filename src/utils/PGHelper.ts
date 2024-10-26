import pgp, { IDatabase } from 'pg-promise';
import { settings } from '../settings';
import { IDBHelper, QueryOption } from "./IDBHelper";
import { IClient } from 'pg-promise/typescript/pg-subset';

class PGHelper implements IDBHelper {

    private db: IDatabase<{}, IClient>;

    constructor() {
        const connectionString = `postgres://${settings.pg.user}:${settings.pg.password}@${settings.pg.host}:${settings.pg.port}/${settings.pg.database}`;
        this.db = pgp()(connectionString);
    }

    async execute(sql: string, params?: any): Promise<any> {
        return  await this.db.any(sql, params);
    }

    async hasData(sql: string, params?: any): Promise<boolean> {
        const data = await this.execute(sql, params);
        return data.length > 0;
    }

    async executeBatch(sql: string, params: any[]): Promise<any> {
        return await this.db.tx(async t => {
            for (const item of params) {
                await t.none(sql, item);
            }
        });
    }

    async executeTransaction(options: QueryOption[]): Promise<any> {
        const {TransactionMode, isolationLevel} = pgp.txMode;
        // Create a reusable transaction mode (serializable + read-only + deferrable):
        const mode = new TransactionMode({
            tiLevel: isolationLevel.serializable,
            readOnly: true,
            deferrable: true
        });

        return await this.db.tx({mode}, async t => {
            for (const option of options) {
                await t.none(option.sql, option.params);
            }
        });
    }
}

export const db:IDBHelper = new PGHelper();