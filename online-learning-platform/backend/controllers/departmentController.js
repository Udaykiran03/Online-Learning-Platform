const Department = require("../models/Department");

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("courses")
      .populate("teachers");
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  const department = new Department(req.body);
  try {
    const newDepartment = await department.save();
    res
      .status(201)
      .json({ data: newDepartment, message: "Department created" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("courses")
      .populate("teachers");

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ data: department, message: "Department updated" });
  } catch (err) {
    res.status(400).json({ message: "Already updated" });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
