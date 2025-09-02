export class UserEn{
    id!:number;
    password?:string;
    name!:string;
    createdAt!: Date;
    count_post:number = 0;
    count_comment:number = 0;
    comment?: string;
    profile_image?: string;
    
}