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
  event_permission: string;
  role: string;
  notice_permission: boolean;
  password: string;
}