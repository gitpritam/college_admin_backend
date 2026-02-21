import StudentModel from "../../../../models/student.model";

export const generateStudentID = async (
  year_of_admission: Number,
  department: string
): Promise<string> => {
  //DEPARTMENT_CODE-STU-25-001
  const admission_year = year_of_admission;
  console.log(year_of_admission);

  const LastStudentID = await StudentModel.findOne({
    department: department,
    year_of_admission: admission_year,
  })
    .sort({ createdAt: -1 })
    .select("student_id");
 console.log (LastStudentID);
  let newID: number;
  if (!LastStudentID) {
    newID = 1;
  } else {
    newID = Number(LastStudentID?.student_id.split("-")[3]) + 1;
  }
console.log (newID);
  const newStudentID = `${department.toUpperCase()}-STU-${year_of_admission
    .toString()
    .slice(-2)}-${newID.toString().padStart(3, "0")}`;
  console.log(newStudentID);
  return newStudentID;
};

//
