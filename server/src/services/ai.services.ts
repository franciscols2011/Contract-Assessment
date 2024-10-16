import { getDocument } from "pdfjs-dist";
import redis from "../config/redis";


export const extractTextFromPDF = async (fileKey: string) => {
    try {
        const fileData = await redis.get(fileKey);
        if (!fileData) {
            throw new Error("File not found");
        }

        let fileBuffer: Uint8Array;

        if (Buffer.isBuffer(fileData)) {
            fileBuffer = new Uint8Array(fileData);
        } else if (typeof fileData === "object" && fileData !== null) {
            const bufferData = fileData as { type?: string; data?: number[] };

            if (bufferData.type === "Buffer" && Array.isArray(bufferData.data)) {
                fileBuffer = new Uint8Array(bufferData.data);
            } else {
                throw new Error("Invalid file data");
            }
        } else {
            throw new Error("Invalid file data");
        }

        const pdf = await getDocument({ data: fileBuffer }).promise;
        let text = '';
        for(let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const response = await page.getTextContent();
            text += response.items.map((item: any)=> item.str).join('') + "\n";
        }
        return text;
    } catch (error) {
        console.error(error);
        throw new Error(`Error extracting text from PDF. Error: ${JSON.stringify(error)}`);
    }
};
