const ContactUs = require("../../models/ContactUs");
const Feedback = require("../../models/Feedback");

exports.getFeedbackAndContactUs = async (req, res) => {
  try {
    const { user_id, id } = req.query;

    let feedbacks = await Feedback.getFeedbacks();
    let contactUs = await ContactUs.getAllFormSubmissions();

    if (user_id) {
      feedbacks = feedbacks.filter((feedback) => feedback.user_id == user_id);
      contactUs = contactUs.filter(
        (submission) => submission.user_id == user_id
      );
    }

    if (id) {
      feedbacks = feedbacks.filter((feedback) => feedback.id == id);
      contactUs = contactUs.filter((submission) => submission.id == id);
    }

    let combined = [
      ...feedbacks.map((feedback) => ({
        id: feedback.id,
        subject: feedback.subject,
        category: "Feedback",
        created_at: feedback.created_at,
      })),
      ...contactUs.map((submission) => ({
        id: submission.id,
        subject: submission.subject,
        category: "Contact Us",
        created_at: submission.created_at,
      })),
    ];

    combined.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    res.status(200).json({
      success: true,
      message:
        "Feedback and Contact Us form submissions retrieved successfully.",
      data: combined,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Feedback and Contact Us form submissions.",
    });
  }
};
