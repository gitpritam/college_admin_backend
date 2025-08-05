// export enum InquiryEnum {
//   GENERAL = "general",
//   EXAM = "exam",
//   PLACEMENT = "placement",
//   ADMISSION = "admission",
//   OTHERS = "others",
// }

import { InquiryTypes } from "../../types/inquiryTypes.type";

export interface IInquiry {
  type: InquiryTypes;
}
