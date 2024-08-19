class UserDto {
    public id: bigint;
    public account: string;
    public nick_name: string;
    public avatar: string;
    public email: string;
    public phone_number: string;
    public creator_id: bigint;
    public creation_time!: Date;
    public last_modifier_id!: bigint;
    public last_modification_time!: Date;

    constructor(id: bigint, account: string, nick_name: string, avatar: string, email: string,
        phone_number: string, creator_id: bigint) {
        this.id = id;
        this.account = account;
        this.nick_name = nick_name;
        this.avatar = avatar;
        this.email = email;
        this.phone_number = phone_number;
        this.creator_id = creator_id;
    }
}

export default UserDto;