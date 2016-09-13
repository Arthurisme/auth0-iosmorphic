import {Photo} from './photo'

export class User{


    public userId: number;
    public auth0UserId: string;
    public email: string ;

    public firstName:string;
    public lastName:string;
    public userName:string;
    public password:string;
    public created: Date;
    public photoList:Photo[];
    public likedPhotoList:Photo[];



    // public userId: number;
    // public auth0UserId:string;
    // public email:string;
    // public username:string;
    // public nickname:string;
    // public firstName:string;
    // public lastName:string;
    // public password:string;
    //
    //
    //
    // // public created: Date;
    // public photoList:Photo[];
    //
    //
    //
    // public likedPhotoList:Photo[];








    // accountEnabled:boolean;
    //
    // accountExpired:boolean;
    // accountLocked:boolean;
    //
    // credentialsExpired:boolean;
    //
    // expires:number;

    // roles:Array[0]
    // authorities:Array[0]




}