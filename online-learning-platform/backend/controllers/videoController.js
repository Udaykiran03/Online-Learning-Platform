const Course = require("../models/Course");
const Video = require("../models/Video");

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const video = new Video(req.body);
    await Course.findByIdAndUpdate(video.course, {
      $addToSet: { videos: video._id },
    });
    const newVideo = await video.save();
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    await Course.findByIdAndUpdate(video.course, {
      $pull: { videos: video._id },
    });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
