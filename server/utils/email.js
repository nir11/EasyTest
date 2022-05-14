const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const env = require("dotenv");
// const moment = require("moment")

exports.sendEmail = (emailSubject, emailBody, emailAddress) => {
  let html = `
  <html>
  <head>
  <meta charset="utf-8" /> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style rel="stylesheet" type="text/css">
      @media only screen and (max-width: 600px) {
    
      }
    </style>
</head>
  <body> 
    <div style = "direction: rtl; width: 100%; margin: auto;">
      <div>${emailBody}</div>
    </div>
  </body>
  </html >
  `;

  let body = ``;
  let text = body;
  doSendEmail(emailSubject, text, html, emailAddress);
};

async function doSendEmail(subject, text, html, to) {
  env.config();

  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.RESFRESH_TOKEN,
    });
    const accessToken = oauth2Client.getAccessToken();

    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        rejectUnauthorized: false,
        type: "OAuth2",
        user: "easytest.israel@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.RESFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "משק אלמוג <easytest.israel@gmail.com>",
      to: to,
      subject: subject,
      //text: text,
      html: html,
      // attachments: [{
      //   filename: 'almog.PNG',
      //   path: __dirname + '/almog.PNG',
      //   cid: 'logo' //my mistake was putting "cid:logo@cid" here!
      // }]
    };

    const result = await smtpTransport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
