import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../../../utils/AsyncHandler";
import StudentModel from "../../../models/student.model";
import FacultyModel from "../../../models/faculty.model";
import EventModel from "../../../models/event.model";
import NoticeModel from "../../../models/notice.model";
import InquiryModel from "../../../models/inquiry.model";

const getDashboardStatsController = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentYear = new Date().getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const next30Days = new Date(today);
    next30Days.setDate(next30Days.getDate() + 30);

    // Student statistics
    const totalStudents = await StudentModel.countDocuments();
    
    const studentsByDepartmentRaw = await StudentModel.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          department: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    const studentsByDepartment: Record<string, number> = {};
    studentsByDepartmentRaw.forEach((item) => {
      studentsByDepartment[item.department] = item.count;
    });

    const activeAdmissionsCurrentYear = await StudentModel.countDocuments({
      year_of_admission: currentYear
    });

    // Faculty statistics
    const totalFaculty = await FacultyModel.countDocuments();

    const facultyByRoleRaw = await FacultyModel.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    const facultyByRole: Record<string, number> = {};
    facultyByRoleRaw.forEach((item) => {
      facultyByRole[item._id] = item.count;
    });

    const activeAccounts = await FacultyModel.countDocuments({
      account_status: true
    });

    const inactiveAccounts = await FacultyModel.countDocuments({
      account_status: false
    });

    // Inquiry statistics
    const pendingInquiries = await InquiryModel.countDocuments();

    // Event statistics
    const eventsNext30Days = await EventModel.countDocuments({
      start_date: {
        $gte: today,
        $lte: next30Days
      }
    });

    const ongoingEventsToday = await EventModel.countDocuments({
      start_date: { $lte: tomorrow },
      end_date: { $gte: today }
    });

    // Notice statistics
    const totalActiveNotices = await NoticeModel.countDocuments();

    const recentNotices = await NoticeModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id title createdAt");

    // Build response
    const dashboardStats = {
      totalStudents,
      studentsByDepartment,
      activeAdmissionsCurrentYear,
      totalFaculty,
      facultyByRole,
      activeAccounts,
      inactiveAccounts,
      pendingInquiries,
      eventsNext30Days,
      ongoingEventsToday,
      recentNotices,
      totalActiveNotices,
    };

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      result: dashboardStats
    });
  }
);

export default getDashboardStatsController;
