import mongoose, {type Date} from "mongoose";
import type { INotice } from "../@types/interface/schema/notice.interface";

const NoticeSchema = new mongoose.Schema<INotice>(
    {
        notice_id:{
            type: String,
            required: true,
            unique: true,   
        },
        title: {
            type: String,
            minlength: [3, "title should be at least 3 characters"],
            maxlength: [20, "title should be at most 20 characters"],
            required: true,
            trim: true, 
        },
        description: {
            type: String,
            minlength: [3, "description should be at least 3 characters"],
            maxlength: [100, "description should be at most 100 characters"],
            trim: true,
        },
        year: {
            type: Number,
            required: false,
        },
        posted_by: {
            type: String,
            required: true,
        }
    },
    { timestamps: true}
);

const NoticeModel = mongoose.model<INotice>("Notices", NoticeSchema);
export default NoticeModel;