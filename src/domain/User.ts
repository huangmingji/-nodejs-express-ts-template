import { db } from '../utils/DBHelper';
import UserDto from "../models/UserDto";
import PasswordSecurity from '../utils/PasswordSecurity';
import { SnowflakeId } from "../utils/SnowflakeId";

class User {
    public id: bigint|number;
    public account: string;
    public password: string;
    public secret_key: string
    public nick_name: string;
    public avatar: string;
    public email: string;
    public phone_number: string;
    public creator_id: bigint|number;
    public creation_time: Date;
    public last_modifier_id: bigint|number;
    public last_modification_time: Date;

    constructor(id: bigint, account: string, password: string, secret_key: string, nick_name: string, avatar: string, email: string,
        phone_number: string, creator_id: bigint|number) {
        this.id = id;
        this.account = account;
        this.password = password;
        this.secret_key = secret_key;
        this.nick_name = nick_name;
        this.avatar = avatar;
        this.email = email;
        this.phone_number = phone_number;
        this.creator_id = creator_id;
        this.creation_time = new Date();
        this.last_modifier_id = creator_id;
        this.last_modification_time = new Date();
    }

    public mapper(): UserDto {
        return new UserDto(this.id, this.account, this.nick_name, this.avatar, this.email, this.phone_number, this.creator_id,
            this.creation_time, this.last_modifier_id, this.last_modification_time);
    }

    public static mapper(users: Array<User>): Array<UserDto> {
        const data = Array<UserDto>();
        for (let i = 0; i < users.length; i++)
        {
            data.push(users[i].mapper());
        }
        return data;
    }

    verifyPassword(password: string): boolean {
        const passwordSecurity = new PasswordSecurity();
        return passwordSecurity.verifyPassword(password, this.secret_key, this.password);
    }

    async create(): Promise<void> {
        const passwordSecurity = new PasswordSecurity();
        const secret_key = passwordSecurity.createSalt();
        this.id = SnowflakeId.newId();
        this.secret_key = secret_key;
        this.password = passwordSecurity.createHash(this.password, secret_key);
        this.creation_time = new Date();
        this.last_modifier_id = this.creator_id;
        this.last_modification_time = new Date();
        await db.execute('insert into user (id, account, password, secret_key, nick_name, avatar, email, phone_number, creator_id, creation_time, last_modifier_id, last_modification_time)'
            + 'values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [this.id, this.account, this.password, this.secret_key, this.nick_name, this.avatar, this.email, this.phone_number, this.creator_id, this.creation_time, this.last_modifier_id, this.last_modification_time]);
    }

    async update(): Promise<void> {
        await db.execute('update user set account = ?, password = ?, secret_key = ?, name = ?, avatar = ?, email = ?, phone_number = ?, creator_id = ?, creation_time = ?, last_modifier_id = ?, last_modification_time = ? where id = ?',
            [this.account, this.password, this.secret_key, this.nick_name, this.avatar, this.email, this.phone_number, this.last_modifier_id, this.last_modification_time, this.id]);
    }

    async delete(): Promise<void> {
        await db.execute('delete from user where id = ?', [this.id]);
    }

    static async getById(id: bigint): Promise<User> {
        const result = await db.execute('select * from user where id = ?', [id]);
        return result[0];
    }

    static async getByAccount(account: string): Promise<User> {
        const result = await db.execute('select * from user where account = ?', [account]);
        return result[0];
    }

    static async getByEmail(email: string): Promise<User> {
        const result = await db.execute('select * from user where email = ?', [email]);
        return result[0];
    }

    static async getByPhoneNumber(phone_number: string): Promise<User> {
        const result = await db.execute('select * from user where phone_number = ?', [phone_number]);
        return result[0];
    }

    static async hasAccount(account: string): Promise<boolean> {
        return await db.hasData('select * from user where account = ?', [account]);
    }

    static async hasEmail(email: string): Promise<boolean> {
        return await db.hasData('select * from user where email = ?', [email]);
    }

    static async hasPhoneNumber(phone_number: string): Promise<boolean> {
        return await db.hasData('select * from user where phone_number = ?', [phone_number]);
    }
}

export default User;