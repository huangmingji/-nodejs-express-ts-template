class UserDto {
    public id: bigint|number;
    public account: string;
    public nick_name: string;
    public avatar: string;
    public email: string;
    public phone_number: string;
    public creator_id: bigint|number;
    public creation_time!: Date;
    public last_modifier_id!: bigint|number;
    public last_modification_time!: Date;

    constructor(id: bigint|number, account: string, nick_name: string, avatar: string, email: string,
        phone_number: string, creator_id: bigint|number, creation_time: Date, last_modifier_id: bigint|number, last_modification_time: Date) {
        this.id = id;
        this.account = account;
        this.nick_name = nick_name;
        this.avatar = avatar;
        this.email = email;
        this.phone_number = phone_number;
        this.creator_id = creator_id;
        this.creation_time = creation_time;
        this.last_modifier_id = last_modifier_id;
        this.last_modification_time = last_modification_time;
    }
}

export default UserDto;