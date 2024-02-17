const nodemailer = require("nodemailer");
const sendMail = async (options) => {
     try {
         // create the transporter to send emails
         const transporter = nodemailer.createTransport({
          host: process.env.HOST_EMAIL,
          port: process.env.PORT_EMAIL,
          auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.PASS_EMAIL,
          },
         });
 
         // create email options 
         const emailOptions = {
             from: '"Fred Foo 👻" <support@cinflix.com>',
             to: options.email,
             subject: options.subject,
             text: options.message,
         };
 
         await transporter.sendMail(emailOptions);
     } catch (error) {
         // Log the error
         console.error("Error sending email:", error);
         // Throw the error to propagate it to the calling function
         throw error;
     }
 };
 
 module.exports = sendMail;