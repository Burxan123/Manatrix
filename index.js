import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import path from "path";
import { fileURLToPath } from 'url';
import Pdfroutes from './routes/pdfroutes.js'



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
myapp.use('/pdfler', Pdfroutes);


// Dosya yolu
const pdfDirectory = path.join(__dirname, 'pdfs');

myapp.get("/", (req, res) => res.send("Welcome to Elmir Sultan's project"));
myapp.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

myapp.post('/sendPDF', async (req, res) => {
    const { email, category } = req.body;

    let pdfFiles = [];
    switch (category) {
      case 'Business':
        pdfFiles = ['Business.pdf']; // Kategori 1'in PDF dosyası
        break;
      case 'Social Media':
        pdfFiles = ['E-Commerce.pdf']; // Kategori 2'nin PDF dosyası
        break;
      case 'Content Creation':
        pdfFiles = ['Sahibkar.pdf']; // Kategori 3'ün PDF dosyası
        break;
      default:
        return res.status(400).json({ message: 'Geçersiz kategori' });
    }
   
    try {
        await sendEmail(email, category, pdfFiles);
        res.send('PDF gönderildi');
    } catch (error) {
        console.error('Email gönderilirken hata oluştu:', error);
        res.status(500).send('PDF gönderilirken bir hata oluştu');
    }
});

async function sendEmail(email, category, pdfFiles) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const attachments = pdfFiles.map(file => ({
        filename: file,
        path: path.join(pdfDirectory, file)
    }));

    const mailOptions = {
        from: 'hesenliburxan@gmail.com',
        to: email,
        subject: `PDF for ${category} category`,
        text: `Attached is the PDF for ${category} category.`,
        attachments: attachments
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Email gönderilirken hata oluştu:', error);
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







