import { Request, Response } from "express";
import multer from "multer";
import { IUser } from "../models/user.model";
import redis from "../config/redis";
import { extractTextFromPDF } from "../services/ai.services";

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
            cb(new Error("File type not allowed"));
        }
    },
}).single("contract");


export const detectAndConfirmContractType = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    if(!req.file){
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const fileKey = `file:${user._id}:${Date.now()}`;
        await redis.set(fileKey, req.file.buffer)

        await redis.expire(fileKey, 3600)
        
        const pdfText = await extractTextFromPDF(fileKey);
    } catch (error) {
        console.log(error);
    }

};