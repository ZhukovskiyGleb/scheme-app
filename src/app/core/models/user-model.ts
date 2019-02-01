export class UserModel {
    static create(uid: string, params: { [field: string]: any }): UserModel {
        return new UserModel(uid, params.username);
    }

    constructor(public uid: string,
                public username: string) {}
}
