import mongoose, {type Date} from "mongoose";
import type { IEvent } from "../@types/interface/schema/event.interface";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const EventSchema = new mongoose.Schema<IEvent>(
    {
        event_id: {
            type: String,
            unique: true,    
        },
        title: {
            type: String,
            minlength: [3, "Title should be minimun 3 characters"],
            maxlength: [100, "Title should be maximum 100 characters"],
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            minlength: [3, "Description should be minimun 3 characters"],
            maxlength: [100, "Description  should be maximum 100 characters"],
            trim: true,
        },
        start_date: {
            type: Date,
            required: true,
        },
        end_date: {
            type: Date,
            required: true,
        },
        start_time: {
            type: String,
            required: true,
            match: [timeRegex , "Time must be in HH:MM format"],
        },
        end_time: {
            type: String,
            match: [timeRegex, "Time must be in HH:MM format"],
        },
        venue: {
            type: String,
            required: true,
            minlength: [3, "venue should be minimun 3 characters"],
            maxlength: [100, "Venue should be maximum 100 characters"],
        },
        posted_by: {
            type: String,
            required: true,
        }
    },
    {timestamps: true }
);
const EventModel = mongoose.model<IEvent>("Events", EventSchema);
export default EventModel;