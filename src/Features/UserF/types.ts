export interface UserFormData {
    userName:string;
    displayName:string;
    email:string;
    accessFrom:string;
    accessTo:string;
    phoneNumber?:string;
    twoFactorEnabled:boolean;
}