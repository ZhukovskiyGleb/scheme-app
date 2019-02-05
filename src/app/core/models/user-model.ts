

export class UserModel {
    static create(uid: string, params: { [field: string]: any }): UserModel {
        return new UserModel(uid, params.username, params.admin);
    }

    constructor(private _uid: string,
                public username: string,
                private _admin: boolean = false) {}

    get admin(): boolean {
        return this._admin;
    }

    get uid(): string {
        return this._uid;
    }
}
