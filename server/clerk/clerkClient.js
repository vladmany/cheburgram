import 'dotenv/config';
import {createClerkClient} from "@clerk/backend";

export default createClerkClient({secretKey: process.env.CLERK_SECRET_KEY});