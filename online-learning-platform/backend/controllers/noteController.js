const Course = require("../models/Course");
const Note = require("../models/Note");

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Notes not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNote = async (req, res) => {
  const note = new Note(req.body);
  try {
    const newNote = await note.save();
    await Course.findByIdAndUpdate(req.body.course, {
      $set: { note: newNote._id },
    });
    res.status(201).json({ message: "Notes created" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Notes updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Course.updateMany({ note: req.params.id }, { $unset: { note: 1 } });

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
