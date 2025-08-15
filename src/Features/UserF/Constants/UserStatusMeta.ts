export enum UserStatus{
    ACTIVE = 0,
    DEACTIVE = 1
}

export const userStatusMeta:Record<
    UserStatus,
    {label:string;colorClass:string}
> = {

    [UserStatus.ACTIVE]:{
        label:"Active",
        colorClass:" text-green-800 m-2 p-1 rounded"
    },
    [UserStatus.DEACTIVE]:{
        label:"Deactivated",
        colorClass:" text-red-800 m-2 p-1 rounded"
    },

}