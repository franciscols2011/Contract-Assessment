import { Resend} from "resend"


const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

export const sendPremiumConfirmationEmail = async (
    email: string,
    userName: string
) =>{
    try {
        await resend.emails.send({
            from: "<onboarding@resend.dev>",
            to: email,
            subject: "Welcome to the Premium Plan",
            html: `<h1>Welcome to the Premium Plan, ${userName}!</h1>`,
        })
    } catch (error) {
        console.log(error);
        
    }
}