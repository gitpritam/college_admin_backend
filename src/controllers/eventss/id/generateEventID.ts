
import EventModel from "../../../models/event.model";

export const generateEventID = async (
  start_date: Date
): Promise<string>=> {
 //Event-25-001
  const eventDate = Date.toString();
  console.log(Date);

  const LastEventID = await EventModel.findOne({
    createdAt: {
      $gte: new Date(`${Date}-01-01`),
      $lte: new Date(`${Date}-12-31`),
    },
  })
    .sort({ createdAt: -1 })
    .select("event_id");

  let newID: number;
  if (!LastEventID) {
    newID = 1;
  } else {
    newID = Number(LastEventID?.event_id.split("-")[3]) + 1;
  }

 const newEventID = `-EVENT-${eventDate.toString().slice(-2)}-${newID.toString().padStart(3, "0")}`;
  console.log(newEventID);
  return newEventID;;
};
