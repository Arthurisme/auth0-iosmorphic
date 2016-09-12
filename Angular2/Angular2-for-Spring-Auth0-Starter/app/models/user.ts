import {Photo} from './photo'

export class User{

    public userId: number;
    public auth0UserId:string;
    public email:string;
    public userName:string;
    public nickName:string;
    public firstName:string;
    public lastName:string;
    public password:string;



    public created: Date;
    public photoList:Photo[];



    public likedPhotoList:Photo[];
}