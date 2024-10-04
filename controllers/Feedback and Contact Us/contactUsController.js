const ContactUs = require("../../models/ContactUs"); // Assuming you have a ContactUs model

exports.submitContactUsForm = async (req, res) => {
  try {
    const { user_id, subject, body, email } = req.body;
    await ContactUs.createFormSubmission(user_id, subject, body, email);

    res.status(201).json({
      success: true,
      message: "Contact Us form submitted successfully.",
      data: { user_id, subject, body, email },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error submitting Contact Us form.",
    });
  }
};

exports.getContactUsFormSubmissions = async (req, res) => {
  try {
    const submissions = await ContactUs.getAllFormSubmissions();
    res.status(200).json({
      success: true,
      message: "Contact Us form submissions retrieved successfully.",
      data: submissions,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error retrieving Contact Us form submissions.",
    });
  }
};
