import { FunctionComponent, useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";

interface AlertProps {
    open: boolean;
    setOpen: (state: boolean) => void;
    message: string;
}

const Alert: FunctionComponent<AlertProps> = ({open, setOpen, message}) => {
    if (!open) return null;

    useEffect(() => {
        let timerId: number | null = null; //timerId 변수를 정의하며 초기값은 null로 설정 나중에 setTimeout 함수에서 반환되는 값을 저장

        if (open) {
            timerId = setTimeout(() => {
                setOpen(false);
            }, 3000) as unknown as number;
        }

        // 클린업 함수 컴포넌트가 언마운트 될 때 호출되거나 useEffect 다시 실행되기 전에 호출, timerId 값이 존재할 경우 clearTimeout 함수를 사용해 타이머를 취소하고 초기화
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    },[open]);

    return (
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 mt-[12px] w-[400px] flex items-center justify-center bg-white ml-4">
        <FiAlertCircle className="w-[20px] h-[20px]" color="#FF4500" />
        <span className="font-medium text-center text-xs p-2">{message}</span>
        <button onClick={() => setOpen(false)} className="ml-4 focus:outline-none">
          &times;
        </button>
      </div> 
    );
};

export default Alert;
