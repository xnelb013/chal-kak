import { auth } from "@/firebase/firebaseAuth";
import { db } from "@/firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { rest } from "msw";

export const handlers = [
  // 회원가입 mocking API
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
  // 로그인 mocking API
  rest.post("http://localhost:3000/signin", async (req, res, ctx) => {
    const { email, password } = await req.json();
    try {
      await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        localStorage.setItem("user", JSON.stringify(userCredential.user));
        alert("로그인에 성공하였습니다.");
      });
      return res(ctx.status(200), ctx.json({ success: true }), ctx.json({ message: "로그인에 성공하였습니다." }));
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false }), ctx.json({ message: "로그인에 실패하였습니다." }));
    }
  }),
  // 로그아웃 mocking API
  rest.get("http://localhost:3000/signout", async (req, res, ctx) => {
    try {
      localStorage.removeItem("user");
      return res(ctx.status(200), ctx.json({ success: true }), ctx.json({ message: "로그아웃에 성공하였습니다." }));
    } catch (error) {
      return res(ctx.status(400), ctx.json({ success: false }), ctx.json({ message: "로그아웃에 실패하였습니다." }));
    }
  }),
  // 사용자 개인 정보 확인 mocking API
  rest.get("http://localhost:3000/userinfo", async (req, res, ctx) => {
    const user = localStorage.getItem("user");
    const { email } = JSON.parse(user as string);
    try {
      getDoc(doc(db, "users", email)).then((doc) => {
        console.log("userinfo", doc.data());
      });
      return res(
        ctx.status(200),
        ctx.json({ success: true }),
        ctx.json({ message: "사용자 정보를 불러오는데 성공하였습니다." }),
      );
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({ success: false }),
        ctx.json({ message: "사용자 정보를 불러오는데 실패하였습니다." }),
      );
    }
  }),
];
