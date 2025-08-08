import FacultyModel from "../../../../models/faculty.model";

export const generateFacultyID = async (
  joining_date: Date,
  department: string
): Promise<string> => {
  //DEPARTMENT_CODE-FAC-25-001
  const joining_year = joining_date.getFullYear().toString(); // 2025
  console.log(joining_year);

  const LastFacultyID = await FacultyModel.findOne({
    department: department,
    joining_date: {
      $gte: new Date(joining_year + "-01-01"),
      $lte: new Date(joining_year + "-12-31"),
    },
  })
    .sort({ createdAt: -1 })
    .select("faculty_id");

  // ager joner jodi 25 hoy tahole akhn notun id 26 hbe
  let newID: number;
  if (!LastFacultyID) {
    newID = 1;
  } else {
    newID = Number(LastFacultyID?.faculty_id.split("-")[3]) + 1;
  }

  const newFacultyID = `${department.toUpperCase()}-FAC-${joining_year.slice(
    -2
  )}-${newID.toString().padStart(3, "0")}`;
  console.log(newFacultyID);
  return newFacultyID;
};
