import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "./components/Navbar";
import "../public/fonts/font.css";
import "../public/fonts/notoSansKr.css";

export default function App({ Component, pageProps }: AppProps) {
  if (process.env.NODE_ENV === "development") {
    if (typeof window === "undefined") {
      (async () => {
        const { server } = await import("../mocks/server");
        server.listen();
      })();
    } else {
      (async () => {
        const { worker } = await import("../mocks/browser");
        worker.start();
      })();
    }
  }
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
