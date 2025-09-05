exports.constants = {
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
};

exports.TEACHER = "TEACHER";
exports.STUDENT = "STUDENT";

exports.teacherRole = (req) => {
  return req.headers["user-type"] !== this.TEACHER;
};
