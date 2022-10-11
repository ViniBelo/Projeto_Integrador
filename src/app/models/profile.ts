import { getAuth } from 'firebase/auth';
export class Profile {
    private _id: string
    private _uid: any
    private _name: string
    private _password: string
    private _email: string
    private _profileImageURL: any

    constructor(name: string, email: string, password: string) {
        this._name = name
        this._email = email
        this._password = password
        this.setUid
    }

    public get id() {
        return this._id
    }

    public get uid() {
        return this._uid
    }

    public get name() {
        return this._name
    }

    public get email() {
        return this._email
    }

    public get profileImageURL() {
        return this._profileImageURL
    }

    public setUid () {
        this._uid = getAuth().currentUser.uid
    }

    public set name(name: string) {
        this._name = name
    }

    public set email(email: string) {
        this._email = email
    }

    public set password(password: string) {
        this._password = password
    }

    public set profileImageURL(profileImageURL: any) {
        this._profileImageURL = profileImageURL
    }
}
