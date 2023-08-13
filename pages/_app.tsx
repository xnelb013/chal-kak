import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "./components/Navbar";
import "../public/fonts/font.css";
import "../public/fonts/notoSansKr.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="wrap">
        <div className="container">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
