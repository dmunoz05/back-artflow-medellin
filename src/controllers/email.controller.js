import { variablesMail } from "../utils/params/const.environments.js";
import nodemailer from "nodemailer";

var user_ = variablesMail.user_mail
var password_ = variablesMail.password_mail
var host_ = variablesMail.host_mail

const transporter = nodemailer.createTransport({
    host: host_,
    port: 587,
    auth: {
        user: `${user_}`,
        pass: `${password_}`
    }
});;

async function main(firstname, title, username, email = 'daniel20025febrero29@gmail.com') {
    // send mail with defined transport object
    const my = await transporter.sendMail({
        from: `Desde 👉 ${email} <${email}`,
        to: "daniel20025febrero29@gmail.com",
        subject: "Artflow Medellín, Upload Image 🎨",
        html: `<h3>Nueva imagen subida al sistema</h3>
            <span><strong>Nombre: </strong>${firstname}</span>
            <br/>
            <span><strong>Titulo: </strong>${title}</span>
            <br/>
            <span><strong>Usuario Instagram: </strong>${username}</span>`
    });

    return `Message sent: %s" ${my.messageId}`;
}


export async function sendEmail(firstname, title, username) {
    const send = await main(firstname, title, username)
    return send;
}
