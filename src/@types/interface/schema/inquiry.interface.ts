// type   or   enum
export type InquiryTypes =
  | "general"
  | "exam"
  | "placement"
  | "admission"
  | "others";

// export enum InquiryEnum {
//   GENERAL = "general",
//   EXAM = "exam",
//   PLACEMENT = "placement",
//   ADMISSION = "admission",
//   OTHERS = "others",
// }

export interface IInquiry {
  type: InquiryTypes;
}
