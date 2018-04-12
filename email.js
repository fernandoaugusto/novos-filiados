var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");


sendEmail = async (members, email_to) => {

    var transporter = nodemailer.createTransport(smtpTransport({
        host : process.env.APP_MAIL_HOST,
        port: process.env.APP_MAIL_PORT,
        auth : {
            user : process.env.APP_MAIL,
            pass : process.env.APP_MAIL_PASSWORD
        }
    }));

    var cities_found_list = [];
    var cities_found_unique = [];

    members.forEach((member) => {
      cities_found_list.push(member.city);
    });
    var unique = function(xs) {
      return xs.filter(function(x, i) {
        return xs.indexOf(x) === i
      })
    }

    var cities_found_unique_text = unique(cities_found_list);

    var emailTemplateText;
    var emailTemplateHTML;
    var emailSubject;

    if (members.length > 0) {

      emailSubject = `Novas solicitações do NOVO em ${cities_found_unique_text.join(', ')}\n\n`;

      emailTemplateText = `Solicitações do NOVO em ${cities_found_unique_text.join(', ')}\n\n`;
      emailTemplateText = emailTemplateText + `Número de Solicitações: ${members.length}\n\n`;
      members.forEach((member) => {
        emailTemplateText = emailTemplateText + `Nome: ${member.name}\nCidade: ${member.city})\n\n`;
      });

      emailTemplateHTML = `Solicitações do NOVO em ${cities_found_unique_text.join(', ')}<br><br>`;
      emailTemplateHTML = emailTemplateHTML + `Número de Solicitações: ${members.length}<br><br>`;
      members.forEach((member) => {
        emailTemplateHTML = emailTemplateHTML + `Nome: ${member.name}<br>Cidade: ${member.city}<br><br>`;
      });

    } else {

      emailSubject = 'Sem novas solicitações no NOVO';

      emailTemplateText = `Sem novas solicitações no NOVO\n\n`;
      emailTemplateText = emailTemplateText + `Número de Solicitações: 0\n\n`;

      emailTemplateHTML = `Sem novas solicitações no NOVO<br><br>`;
      emailTemplateHTML = emailTemplateHTML + `Número de Solicitações: 0<br><br>`;

    }

    var mailOptions = {
        from: `NOVO30 <${process.env.APP_MAIL}>`,
        to: email_to,
        subject: emailSubject,
        text: emailTemplateText,
        html: emailTemplateHTML,
    };

    return new Promise((resolve, reject) => {
      if (!email_to) {
        reject('No email list');
      }
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
            reject('Email not sent to destination');
        }else{
            resolve();
        }
      });
  });

};



module.exports = {sendEmail};
