const ContactUs = require("../../models/ContactUs");
const { sendEmail } = require("../../helper/emailService");

exports.submitContactUsForm = async (req, res) => {
  try {
    const { name, subject, body, email, user_id = null } = req.body;
    await ContactUs.createFormSubmission(name, subject, body, email, user_id);

    const text = `Name: ${name}\nSubject: ${subject}\nBody: ${body}\nEmail: ${email}\nUser ID: ${user_id}`;

    await sendEmail(process.env.EMAIL_USER, subject, text);

    res.status(201).json({
      success: true,
      message: "Contact Us form submitted successfully.",
      data: { user_id, name, subject, body, email },
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
    const { id, user_id } = req.query;
    let submissions = await ContactUs.getAllFormSubmissions();

    if (id) {
      submissions = submissions.filter((submission) => submission.id == id);
    }

    if (user_id) {
      submissions = submissions.filter(
        (submission) => submission.user_id == user_id
      );
    }

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

exports.deleteContactUsFormSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactUs.deleteFormSubmission(id);

    res.status(200).json({
      success: true,
      message: "Contact Us form submission deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error deleting Contact Us form submission.",
    });
  }
};
