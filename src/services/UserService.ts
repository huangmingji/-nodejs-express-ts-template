import User from "../domain/User";
import UserDto from "../models/UserDto";
import { connection } from '../utils/DBHelper';
import PasswordSecurity from '../utils/PasswordSecurity';
import { SnowflakeId } from "../utils/SnowflakeId";

class UserService {

    public async create(user: User): Promise<UserDto> {
        return new Promise<UserDto>((resolve, reject) => {
            try {
                const passwordSecurity = new PasswordSecurity();
                const secret_key = passwordSecurity.createSalt();
                user.id = SnowflakeId.newId();
                user.secret_key = secret_key;
                user.password = passwordSecurity.createHash(user.password, secret_key);
                user.creation_time = new Date();
                user.last_modifier_id = user.creator_id;
                user.last_modification_time = new Date();
                connection.query('insert into user (id, account, password, secret_key, nick_name, avatar, email, phone_number, creator_id, creation_time, last_modifier_id, last_modification_time)'
                    + 'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [user.id, user.account, user.password, user.secret_key, user.nick_name, user.avatar, user.email, user.phone_number, user.creator_id, user.creation_time, user.last_modifier_id, user.last_modification_time],
                    function (error: any, result: any) {
                        if (error) {
                            console.log('Error: ' + error.message);
                            reject(error);
                        } else {
                            resolve(new UserDto(user.id, user.account, user.nick_name, user.avatar, user.email, user.phone_number, user.creator_id));
                        }
                    });
            } catch (e) {
                reject(e)
            }
        })
    }

    public async getByAccount(account: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            try {
                connection.query('select * from user where account = ?', [account], function (error: any, result: any) {
                    if (error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                    } else {
                        resolve(result[0]);
                    }
                });
            } catch (e) {
                reject(e)
            }
        })
    }

    public async getById(id: number): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            try {
                connection.query('select * from user where id = ?', [id], function (error: any, result: any) {
                    if (error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                    } else {
                        resolve(result[0]);
                    }
                })
            } catch (e) {
                reject(e)
            }
        });
    }

    public async getByEmail(email: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            try {
                connection.query('select * from user where email = ?', [email], function (error: any, result: any) {
                    if (error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                    } else {
                        resolve(result[0]);
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    public async getByPhoneNumber(phone_number: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            try {
                connection.query('select * from user where phone_number = ?', [phone_number], function (error: any, result: any) {
                    if (error) {
                        console.log('Error: ' + error.message);
                        reject(error);
                    } else {
                        resolve(result[0]);
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    public async update(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            try {
                connection.query('update user set account = ?, password = ?, secret_key = ?, name = ?, avatar = ?, email = ?, phone_number = ?, creator_id = ?, creation_time = ?, last_modifier_id = ?, last_modification_time = ? where id = ?',
                    [user.account, user.password, user.secret_key, user.nick_name, user.avatar, user.email, user.phone_number, user.last_modifier_id, user.last_modification_time, user.id], function (error, result) {
                        if (error) {
                            console.log('Error: ' + error.message);
                            reject(error)
                        } else {
                            resolve(user);
                        }
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    public async delete(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                connection.query('delete from user where id = ?', [id], function (error, result) {
                    if (error) {
                        console.log('Error: ' + error.message);
                        reject(error)
                    } else {
                        resolve();
                    }
                });
            } catch (e) {
                reject(e);
            }
        })
    }

}

export default new UserService();