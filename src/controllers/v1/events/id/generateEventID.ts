import EventModel from "../../../../models/event.model";

export const generateEventID = async (): Promise<string> => {
  //Event-25-001
  const year = new Date().getFullYear();
  console.log(year);

  const LastEventID = await EventModel.findOne({
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    },
  })
    .sort({ createdAt: -1 })
    .select("event_id");

  let newID: number;
  if (!LastEventID) {
    newID = 1;
  } else {
    newID = Number(LastEventID?.event_id.split("-")[2]) + 1;
  }

  const newEventID = `EVENT-${year.toString().slice(-2)}-${newID
    .toString()
    .padStart(3, "0")}`;
  console.log(newEventID);
  return newEventID;
};
