import NoticeModel from "../../../../models/notice.model";

export const generateNoticeID = async (year: Number): Promise<string> => {
  //Notice-25-001
  const noticeYear = year.toString();
  console.log(year);

  const LastNoticeID = await NoticeModel.findOne({
    // createdAt: {
    //   $gte: new Date(`${noticeYear}-01-01`),
    //   $lte: new Date(`${noticeYear}-12-31`),
    // },
    year
  })
    .sort({ createdAt: -1 })
    .select("notice_id");
  console.log(LastNoticeID);

  let newID: number;
  if (!LastNoticeID) {
    newID = 1;
    console.log("This line work")
  } else {
    //["NOTICE","25","001"]
    newID = Number(LastNoticeID?.notice_id.split("-")[2]) + 1;
  }

  const newNoticeID = `NOTICE-${noticeYear.slice(-2)}-${newID
    .toString()
    .padStart(3, "0")}`;
  console.log(newNoticeID);
  return newNoticeID;
};
