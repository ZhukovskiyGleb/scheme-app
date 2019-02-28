

export class UserModel {
    static create(uid: string, params: { [field: string]: any }): UserModel {
        return new UserModel(uid, params.username, params.moder, params.admin);
    }

    constructor(private _uid: string,
                public username: string,
                private _moder: boolean = false,
                private _admin: boolean = false) {}

    get admin(): boolean {
        return this._admin;
    }

    get moder(): boolean {
        return this._moder;
    }

    get uid(): string {
        return this._uid;
    }
}
