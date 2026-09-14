import loadTemplate from "./templateLoader.js"
import transporter from "../services/nodemailer.js"

const sendMail = async (to, subject, templateName, data) => {
    const html = loadTemplate(templateName, data);
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    })
}

export default sendMail