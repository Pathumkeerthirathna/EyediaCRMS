
import {EnumClientType,EnumIndustryType,EnumBusinessType,EnumClientSource} from "./Constants";

export interface User{
  id:string;
  userName:string;
  displayName:string;
  email:string,
  lastActive:string;
  accessFrom:string;
  accessTo:string;
  staus?:number;
  url:string;
  status:number;
  userRoles:Array<string>;
  phoneNumber:string;
  emailConfirmed:boolean;
  lockoutEnabled:boolean;
  phoneNumberConfirmed:boolean;
  twoFactorEnabled:boolean;
  accessFailedCount:number;



}

export interface Customer{

  id: string;
  leadId: string;
  name: string;
  cusomerType: typeof EnumClientType;
  referrelNo: string;
  referrer?: string;
  industry: typeof EnumIndustryType;
  businessType: typeof EnumBusinessType;
  source: typeof EnumClientSource;
  creditLimit: number;
  serviceStartedDate: string; // ISO date string
  conversionDate: string;     // ISO date string
  contractDetails?: string;
  createdAt: string;          // ISO date string
  firstContactedDate?: string;
  lastContactedDate: string;
  latitude?: number;
  longitude?: number;
  salesAgentId: string;
  status: number;
  url:string;

}