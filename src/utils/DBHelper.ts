import mysql, {Pool} from 'mysql';
import { settings } from '../settings';
import { IDBHelper, QueryOption } from "./IDBHelper";

class DBHelper implements IDBHelper {
    protected _pool: Pool | undefined;

    get pool(): Pool | undefined {
        return this._pool;
    }
    set pool(value: Pool) {
        this._pool = value;
    }

    constructor() {
        this.pool = mysql.createPool({
            host: settings.mysql.host,
            user: settings.mysql.user,
            password: settings.mysql.password,
            database: settings.mysql.database
        });
    }

    async execute(sql: string, params?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pool?.getConnection((err, connection) => {
                connection.query(sql, params, (err, results) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log(results);
                        resolve(results);
                    }
                })
                connection.release();
            })
        });
    }

    async hasData(sql: string, params?: any): Promise<boolean> {
        const data = await this.execute(sql, params);
        return data.length > 0;
    }

    async executeBatch(sql: string, params: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pool?.getConnection((err, connection) => {
                connection.beginTransaction(err => {
                    if (err) {
                        reject(err);
                    }
                });
                for (let i = 0; i < params.length; i++)
                {
                    connection.query(sql, params[i], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    })
                }
                connection.commit();
                connection.release();
            })
        });
    }

    async executeTransaction(options: Array<QueryOption>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pool?.getConnection((err, connection) => {
                connection.beginTransaction(err => {
                    if (err) {
                        reject(err);
                    }
                });
                for (let i = 0; i < options.length; i++) {
                    let sql = options[i].sql;
                    let params = options[i].params;
                    connection.query(sql, params, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    })
                }
                connection.commit();
                connection.release();
            })
        });
    }
}
export const db:IDBHelper = new DBHelper();