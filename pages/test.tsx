import { auth } from "@/firebase/firebaseAuth";
import axios from "axios";
import React, { useState } from "react";

export default function Test() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [agreement, setAgreement] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "nickname") {
      setNickname(value);
    } else if (name === "gender") {
      setGender(value);
    } else if (name === "height") {
      setHeight(Number(value));
    } else if (name === "weight") {
      setWeight(Number(value));
    } else if (name === "agreement") {
      setAgreement(!agreement);
    }
  };

  const handleSignup = async () => {
    try {
      if (!email || !password || !nickname || !gender || !height || !weight || !agreement) {
        alert("모든 항목을 입력해주세요.");
        return;
      }
      const response = await axios.post("/test", { email, password, nickname, gender, height, weight, agreement });
      if (response.status === 201) {
        const data = response.data;
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignin = async () => {
    try {
      if (!email || !password) {
        alert("이메일과 비밀번호를 입력해주세요.");
        return;
      }
      const res = await axios.post("/signin", { email, password });
      if (res.status === 200) {
        const data = res.data;
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserInfo = async () => {
    try {
      const res = await axios.get("/userinfo");
      if (res.status === 200) {
        const data = res.data;
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await axios.post("/delete", { email });
      if (res.status === 200) {
        const data = res.data;
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("1", auth.currentUser);
  return (
    <>
      <div>
        <div className="flex flex-col">
          <label htmlFor="email">이메일</label>
          <input type="text" id="email" name="email" value={email} onChange={handleOnChange} />
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" value={password} onChange={handleOnChange} />
          <label htmlFor="nickname">닉네임</label>
          <input type="text" id="nickname" name="nickname" value={nickname} onChange={handleOnChange} />
          <p>성별</p>
          <label htmlFor="male">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={handleOnChange}
            />
            남성
          </label>
          <label htmlFor="female">
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              checked={gender === "female"}
              onChange={handleOnChange}
            />
            여성
          </label>
          <label htmlFor="height">키</label>
          <input type="number" id="height" name="height" value={height} onChange={handleOnChange} />
          <label htmlFor="weight">몸무게</label>
          <input type="number" id="weight" name="weight" value={weight} onChange={handleOnChange} />
          <label htmlFor="agreement">
            <input type="checkbox" id="agreement" name="agreement" checked={agreement} onChange={handleOnChange} />
            이용약관에 동의합니다
          </label>
          <button onClick={handleSignup}>회원가입</button>
        </div>
      </div>
      <div>
        <div className="flex flex-col">
          <label htmlFor="email">이메일</label>
          <input type="text" id="email" name="email" value={email} onChange={handleOnChange} />
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" value={password} onChange={handleOnChange} />
          <button onClick={handleSignin}>로그인</button>
        </div>
      </div>
      <button onClick={handleUserInfo}>유저정보</button>
      <button onClick={handleDeleteUser}>유저삭제</button>
    </>
  );
}
