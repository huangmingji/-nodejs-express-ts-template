class CreateOrUpdateUserDto {
    public account: string;
    public password: string;
    public nick_name: string;
    public avatar: string;
    public email: string;
    public phone_number: string;
    public creator_id: bigint|number;
    public last_modifier_id: bigint|number;

    constructor(account: string, avatar: string, email: string, nick_name: string, password: string, phone_number: string, creator_id: bigint|number, last_modifier_id: bigint|number) {
        this.account = account;
        this.avatar = avatar;
        this.email = email;
        this.nick_name = nick_name;
        this.password = password;
        this.phone_number = phone_number;
        this.creator_id = creator_id;
        this.last_modifier_id = last_modifier_id;
    }
}

export default CreateOrUpdateUserDto;