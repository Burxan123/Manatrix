import newUsers from '../model/pdfuser.js';

export async function Addpdf(req, res) {
    try {
        const pdf = new newUsers(req.body);
        await pdf.save();
        res.status(200).json("TAMAMLANDI");
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export async function GosterPdf(req, res) {
    try {
        const gosterilenPdf = await newUsers.find();
        res.status(200).json(gosterilenPdf);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
