const ContactUs = require("../../models/ContactUs");
const Feedback = require("../../models/Feedback");

exports.getFeedbackAndContactUs = async (req, res) => {
  try {
    const { id, user_id } = req.query;

    let feedbacks = await Feedback.getFeedbacks();
    let contactUs = await ContactUs.getAllFormSubmissions();

    if (id) {
      feedbacks = feedbacks.filter((feedback) => feedback.id == id);
      contactUs = contactUs.filter((submission) => submission.id == id);
    }

    if (user_id) {
      feedbacks = feedbacks.filter((feedback) => feedback.user_id == user_id);
      contactUs = contactUs.filter(
        (submission) => submission.user_id == user_id
      );
    }

    let combined = [
      ...feedbacks.map((feedback) => ({
        id: feedback.id,
        name: feedback.name,
        subject: feedback.subject,
        body: feedback.body,
        email: feedback.email,
        category: "Feedback",
        created_at: feedback.created_at,
      })),
      ...contactUs.map((submission) => ({
        id: submission.id,
        name: submission.name,
        subject: submission.subject,
        body: submission.body,
        email: submission.email,
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
