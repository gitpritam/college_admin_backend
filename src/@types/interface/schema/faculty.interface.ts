import { rolesType } from "../../types/roles.type";
import type { IAddress } from "./address.interface";

export interface IFaculty {
  faculty_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  designation: string;
  qualification: string;
  experience: string;
  dob: Date;
  phone_number: string;
  email: string;
  current_address: IAddress;
  permanent_address: IAddress;
  role?: rolesType;
  joining_date: Date;
  password?: string;
  notice_permission?: boolean;
  event_permission?: boolean;
  department: string;
  profile_picture_url?: string;
  account_status?: boolean;
  reset_token?: string;
}
