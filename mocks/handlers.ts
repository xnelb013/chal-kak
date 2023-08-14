import { rest } from "msw";

export const handlers = [
  rest.post("http://localhost:3000/api/Signup", (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ success: true }), ctx.json({ message: "회원 가입에 성공하였습니다." }));
  }),
];
