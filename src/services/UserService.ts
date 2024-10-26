import User from "../domain/User";
import CreateOrUpdateUserDto from "../models/CreateOrUpdateUserDto";
import UserDto from "../models/UserDto";
import PasswordSecurity from '../utils/PasswordSecurity';
import { SnowflakeId } from "../utils/SnowflakeId";

class UserService {
    
    public async create(input: CreateOrUpdateUserDto): Promise<UserDto> {
        if (await User.hasAccount(input.account)) {
            throw new Error("账号已存在");
        }
        if (await User.hasEmail(input.email)) {
            throw new Error("邮箱已存在");
        }
        if (await User.hasPhoneNumber(input.phone_number)) {
            throw new Error("手机号已存在");
        }
        const passwordSecurity = new PasswordSecurity();
        const secret_key = passwordSecurity.createSalt();
        var user = new User(SnowflakeId.newId(), input.account, input.password, secret_key, input.nick_name, 
                            input.avatar, input.email, input.phone_number, input.creator_id);
        await user.create();
        return user.mapper();
    }

    public async getByAccount(account: string): Promise<UserDto> {
        var user = await User.getByAccount(account);
        console.info(user);
        return user.mapper();
    }

    public async getById(id: bigint): Promise<UserDto> {
        var user =  await User.getById(id);
        return user.mapper();
    }

    public async getByEmail(email: string): Promise<UserDto> {
        var user = await User.getByEmail(email);
        return user.mapper();
    }

    public async getByPhoneNumber(phone_number: string): Promise<UserDto> {
        var user = await User.getByPhoneNumber(phone_number);
        return user.mapper();
    }

    public async update(id: bigint, input: CreateOrUpdateUserDto): Promise<UserDto> {
        var user = await User.getById(id);
        user.account = input.account;
        user.nick_name = input.nick_name;
        user.avatar = input.avatar;
        user.email = input.email;
        user.phone_number = input.phone_number;
        user.last_modifier_id = input.last_modifier_id;
        await user.update();
        return user.mapper();
    }

    public async delete(id: bigint): Promise<void> {
        var user = await User.getById(id);
        await user.delete();
    }
}

export default new UserService();