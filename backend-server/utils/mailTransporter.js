require("dotenv").config();
const emailJS = require("@emailjs/nodejs");

const sendMail = async (payload) => {
  try {
    await emailJS.send(
      process.env.SERVICE_ID,
      process.env.TEMPLATE_ID,
      payload,
      {
        publicKey: process.env.PUBLIC_KEY,
        privateKey: process.env.PRIVATE_KEY,
      }
    )
    
  } catch (error) {
    console.log("L'envoie de l'email à échoué :", error);
  }
};

module.exports = sendMail;
