const ContactUs = require("../../models/ContactUs");
const { sendEmail } = require("../../helper/emailService");

exports.submitContactUsForm = async (req, res) => {
  try {
    const { user_id, subject, body, email } = req.body;
    await ContactUs.createFormSubmission(user_id, subject, body, email);

    const text = `User ID: ${user_id}\nSubject: ${subject}\nBody: ${body}\nEmail: ${email}`;

    await sendEmail(process.env.EMAIL_USER, subject, text);

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
    const { user_id, id } = req.body;
    let submissions = await ContactUs.getAllFormSubmissions();

    if (user_id) {
      submissions = submissions.filter(
        (submission) => submission.user_id == user_id
      );
    }

    if (id) {
      submissions = submissions.filter((submission) => submission.id == id);
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
