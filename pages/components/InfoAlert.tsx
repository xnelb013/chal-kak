import { FunctionComponent, useEffect } from "react";
import { useRecoilState } from "recoil";
import { alertState } from "@/utils/atoms";

const InfoAlert: FunctionComponent = () => {
  const [alert, setAlert] = useRecoilState(alertState);

  useEffect(() => {
    let timerId: number | null = null;

    if (alert.open) {
      timerId = setTimeout(() => {
        setAlert({ open: false, message: "" });
      }, 4000) as unknown as number;
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [alert, setAlert]);
  return (
    <div
      className={`fixed left-5 bottom-5 flex items-center transition-all duration-500 ease-out transform ${
        alert.open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div
        className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
        role="alert"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-7 h-6 mt-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="sr-only">Info</span>
        <div>{alert.message}</div>
      </div>
    </div>
  );
};

export default InfoAlert;
