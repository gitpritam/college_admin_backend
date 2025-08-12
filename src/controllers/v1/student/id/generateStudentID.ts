import StudentModel from "../../../../models/student.model";

export const generateStudentID = async (
  year_of_admission: Number,
  department: string
): Promise<string>=> {
  //DEPARTMENT_CODE-STU-25-001
  const admission_year = year_of_admission.toString();
  console.log(year_of_admission);

  const LastStudentID = await StudentModel.findOne({
     department: department,    
    admission_date: {
      $gte: new Date(year_of_admission + "-01-01"),
      $lte: new Date(year_of_admission + "-12-31"),
    },
  })
    .sort({ createdAt: -1 })
    .select("student_id");

  let newID: number;
  if (!LastStudentID) {
    newID = 1;
  } else {
    newID = Number(LastStudentID?.student_id.split("-")[3]) + 1;
  }

 const newStudentID = `${department.toUpperCase()}-STU-${year_of_admission.toString().slice(-2)}-${newID.toString().padStart(3, "0")}`;
  console.log(newStudentID);
  return newStudentID;
};
