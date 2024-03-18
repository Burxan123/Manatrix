import express from 'express';
import  {Addpdf,GosterPdf}  from '../controllers/pdfcontrol.js'; // Ensure the correct function names are used here


const router = express.Router();

router.post('/addpdf', Addpdf);
router.get('/getpdf', GosterPdf); // Ensure correct function name here as well

export default router;
