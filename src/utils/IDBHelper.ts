export interface QueryOption {
    sql: string;
    params?: any;
}

export interface IDBHelper {
    execute(sql: string, params?: any): Promise<any>;
    hasData(sql: string, params?: any): Promise<boolean>;
    executeBatch(sql: string, params: Array<any>): Promise<any>;
    executeTransaction(options: Array<QueryOption>): Promise<any>;
}