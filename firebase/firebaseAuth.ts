import { getAuth } from "firebase/auth";
import app from "./firebaseConfig";

export const auth = getAuth(app);
