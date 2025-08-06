// export enum InquiryEnum {
//   GENERAL = "general",
//   EXAM = "exam",
//   PLACEMENT = "placement",
//   ADMISSION = "admission",
//   OTHERS = "others",
// }

import { InquiryCategoryTypes } from "../../types/inquiryTypes.type";

export default interface IInquiry {
  category: InquiryCategoryTypes;
  name: string;
  subject: string;
  description: string;
  email: string;
  phone_number: string;
  course?: string;
}
