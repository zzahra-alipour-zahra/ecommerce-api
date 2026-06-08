const sendEmail = require('./../../utils/email');

exports.sendPasswordResetEmail = async (email, resetURL) => {
  const message = `request to this url \n ${resetURL}`;
  
  await sendEmail({
    email: email,
    subject: "token for retriving password",
    message
  });
  
  
  return message;
};
