const { sendEmail } = require("../../helper/emailService");

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    await sendEmail(to, subject, message);

    res.status(201).json({
      success: true,
      message: "Email sent successfully.",
      data: { to, subject, message },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: true,
      message: "Error sending email.",
    });
  }
};
