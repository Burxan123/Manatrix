import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Pdfroutes from "./routes/pdfroutes.js";
import KapitalBank from 'kapitalbank'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const myapp = express();

myapp.use(express.json());
myapp.use(helmet());
myapp.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
myapp.use(morgan("common"));
myapp.use(bodyParser.json({ limit: "30mb", extended: true }));
myapp.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
myapp.use(cors());
myapp.use("/pdfler", Pdfroutes);

// Dosya yolu
const pdfDirectory = path.join(__dirname, "pdfs");

myapp.get("/", (req, res) => res.send("Welcome to Elmir Sultan's project"));
myapp.get("/cancel", (req, res) => res.send("test"));
myapp.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

myapp.post("/sendPDF", async (req, res) => {
  const { email, category,name,surname } = req.body;

  let pdfFiles = [];
  switch (category) {
    case "Milyon Dollarlıq Məsləhət":
      pdfFiles = ["Milyon Dollarlıq Məsləhət.pdf"]; // Kategori 1'in PDF dosyası
      break;
    case "E-Commerce Nədir?":
      pdfFiles = ["E-Commerce Nədir.pdf"]; // Kategori 2'nin PDF dosyası
      break;
    case "Sahibkarlar üçün 10 Qızıl Qayda":
      pdfFiles = ["Sahibkarlar üçün 10 Qızıl Qayda.pdf"]; // Kategori 3'ün PDF dosyası
      break;
      case "Həyatda Ən Lazımlı Bacarıq":
        pdfFiles = ["Həyatda Ən Lazımlı Bacarıq.pdf"]; // Kategori 3'ün PDF dosyası
        break;
      
    default:
      return res.status(400).json({ message: "Geçersiz kategori" });
  }

  try {
    await sendEmail(email, category, pdfFiles,name,surname);
    res.send("PDF gönderildi");
  } catch (error) {
    console.error("Email gönderilirken hata oluştu:", error);
    res.status(500).send("PDF gönderilirken bir hata oluştu");
  }
});

async function sendEmail(email, category, pdfFiles,name,surname) {
  
  const transporter = nodemailer.createTransport({
    host: 'bamboo.hostns.io',
    port: 465,
    secure: true, // SSL kullanılarak güvenli bağlantı sağlanıyor
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS // E-posta hesabının şifresi buraya yazılmalı
    }
});

// Gönderilecek e-postanın detayları


  const attachments = pdfFiles.map((file) => ({
    filename: file,
    path: path.join(pdfDirectory, file),
  }));

  const mailOptions = {
    from:'Manatrix <info@manatrixacademy.com>',
    to: email,
    subject: `Özəl Hədiyyə`,
    html: `
            <div>
        
          <div style="text-align:center; margin-bottom: 30px;">
           
            <img src="https://res.cloudinary.com/dxhdjso8d/image/upload/v1711643214/logo_soonpd.png" alt="MANATRIX LOGO" style="width:200px; height:200px; margin: 0 auto; display:block;">
            <h3 style="text-align: center;">Təşəkkürlər!</h3>
            <p style="text-align: center; margin-bottom:20px;">Qeydiyyatınız uğurla tamamlandı! Aşağıya keçib sifarişinizi götürə bilərsiz. Daha çoxu üçün "Keçid et" düyməsinə klikləyib Manatrix-ə qayıda bilərsiz.</p>
            <a href="https://manatrixacademy.com" style="font-size: 16px; font-weight: 600;padding: 10px; border-radius: 5px; background-color: #D09626; color: white; text-decoration: none; text-align:center;">Keçid et</a>
           </div>
           <b>Salam ${name} ${surname},</b>
           <p>Sifarişin üçün təşəkkür edirik.
        
           Sənə gələcəyin üçün lazım olan ən önəmli fundamental bilikləri təqdim edirik. 
           Sualın olarsa, bu ünvana cavab yazmaqdan çəkinmə. 
           </p>
           <b>Hörmətlə, <br> Manatrix Komandası</b>
          </div>
          
        `,
    attachments: attachments,
  };










  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Email gönderilirken hata oluştu:", error);
    throw error;
  }
}

















const PORT = process.env.PORT || 4505;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    myapp.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor.`));
  })
  .catch((error) => console.log(`${error} expected`));
