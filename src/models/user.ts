import { connection } from '../utils/db';
import PasswordSecurity from '../utils/password-security';
import { SnowflakeId } from "../utils/snowflakeid";

class User {
    public id!: string;
    public account: string;
    public password: string;
    public secret_key: string
    public nick_name: string;
    public avatar: string;
    public email: string;
    public phone_number: string;
    public enabled: boolean;
    public creator_id: bigint;
    public creation_time!: Date;
    public last_modifier_id!: bigint;
    public last_modification_time!: Date;

    constructor(account: string, password: string, secret_key: string, nick_name: string, avatar: string, email: string,
        phone_number: string, enabled: boolean, creator_id: bigint) {
        this.account = account;
        this.password = password;
        this.secret_key = secret_key;
        this.nick_name = nick_name;
        this.avatar = avatar;
        this.email = email;
        this.phone_number = phone_number;
        this.enabled = enabled;
        this.creator_id = creator_id;
    }
}

export default User;