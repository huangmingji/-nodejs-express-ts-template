import crypto from "crypto";

class PasswordSecurity {
    public createHash(password: string, salt: string) : string {
        const iterations = 100000;
        const keylen = 64;
        const key = crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha512');
        return key.toString('hex');
    }

    public createSalt(): string {
        return crypto.randomBytes(16).toString('hex');
    }

    public verifyPassword(password: string, salt: string, hash: string): boolean {
        if(this.createHash(password, salt) != hash) {
            return false;
        }
        return true;
    }
}

export default PasswordSecurity;