const sendEmail = require('./../../utils/email');

exports.sendPasswordResetEmail = async (email, resetURL) => {
  const message = `request to this url \n ${resetURL}`;
  
  // temporary for test (Uncomment when ready)
  /*
  await sendEmail({
    email: email,
    subject: "token for retriving password",
    message
  });
  */
  
  return message;
};
