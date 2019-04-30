const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function mailer(user) {
  try {
    console.log('connected');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'armorysquad@gmail.com',
        pass: process.env.EMAIL_PASS
      }
    });

    const EMAIL_SECRET = process.env.EMAIL_SECRET;
    const emailToken = jwt.sign({user: user.id},EMAIL_SECRET,{expiresIn: '1d'});
    const url = `http://localhost:3000/confirmation/${emailToken}`;
    
    let mailOptions = {
      from: 'armorysquad@gmail.com',
      to: user.email,
      subject: 'SquadArmory email confirmation',
      html: `It finally works, thanks for signing up. You have no friends... Please click this link to confirm your email: <a href="${url}">${url}</a>`,
    };
    

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log('There was an error', err,);
      } else {
        console.log('Success!');
      }
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  mailer
};
