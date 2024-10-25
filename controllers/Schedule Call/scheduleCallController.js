const ScheduleCall = require("../../models/ScheduleCall");

exports.submitScheduleCallForm = async (req, res) => {
  try {
    const { name, email, phoneNumber, date, userId } = req.body;
    await ScheduleCall.createSubmission(name, email, phoneNumber, date, userId);

    res.status(201).json({
      success: true,
      message: "Schedule Call form submitted successfully.",
      data: { name, email, phoneNumber, date, userId },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error submitting Schedule Call form.",
    });
  }
};

exports.getScheduleCallFormSubmissions = async (req, res) => {
  try {
    const { id, userId } = req.query;
    let submissions = await ScheduleCall.getSubmissions();

    if (id) {
      submissions = submissions.filter((submission) => submission.id == id);
    }

    if (userId) {
      submissions = submissions.filter(
        (submission) => submission.userId == userId
      );
    }

    res.status(200).json({
      success: true,
      message: "Schedule Call form submissions retrieved successfully.",
      data: submissions,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Schedule Call form submissions.",
    });
  }
};

exports.deleteScheduleCallFormSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    await ScheduleCall.deleteSubmission(id);

    res.status(200).json({
      success: true,
      message: "Schedule Call form submission deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error deleting Schedule Call form submission.",
    });
  }
};
