const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS, NODE_ENV } = require('../config/env');

// In tests, swap the transport itself rather than mocking this module --
// integration tests exercise auth flows through real HTTP requests, several
// require()-levels away from the test file, where module-mocking wouldn't
// reliably reach. jsonTransport resolves sendMail() without opening a real
// SMTP connection to Gmail.
//
// No tls.rejectUnauthorized override on the real transport -- Gmail's certs
// are valid, so there's no reason to weaken TLS verification for it.
const transporter = nodemailer.createTransport(
  NODE_ENV === 'test'
    ? { jsonTransport: true }
    : {
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      }
);

const sendHTMLEmail = async (to, subject, html) => {
  return transporter.sendMail({
    from: `"Cinema Stream Support" <${EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendHTMLEmail,
};
