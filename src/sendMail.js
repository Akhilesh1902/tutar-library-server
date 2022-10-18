import nodemailer from 'nodemailer';

export const sendMailToUser = async (userEmail, { username }) => {
  console.log(username);
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_LOGIN_ID,
      pass: process.env.GMAIL_LOGIN_PASS,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: process.env.GMAIL_ACCESS_TOKEN,
    },
  });
  let info = transporter.sendMail(
    {
      from: 'spareakhil@gmail.com',
      to: userEmail,
      subject: 'New Download Request',
      text: `${username} has requested to download the model from your Portal`,
    },
    (err) => {
      if (err) {
        console.log('email error');
        console.log(err);
        return err;
      } else {
        console.log('email success');
        return 'success return';
      }
    }
  );
};
