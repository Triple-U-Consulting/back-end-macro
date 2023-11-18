const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: 'geraldy.gk@gmail.com',
        pass: 'Geraldy313'
    }
});

module.exports = transporter;