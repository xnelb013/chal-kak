import { auth } from "@/firebase/firebaseAuth";
import { db } from "@/firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { rest } from "msw";

export const handlers = [
  rest.post("http://localhost:3000/test", async (req, res, ctx) => {
    const { email, password, nickname, gender, height, weight } = await req.json();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", email), {
        nickname,
        gender,
        height,
        weight,
      });
      return res(ctx.status(201), ctx.json({ success: true }), ctx.json({ message: "회원 가입에 성공하였습니다." }));
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false }), ctx.json({ message: "회원 가입에 실패하였습니다." }));
    }
  }),
];
