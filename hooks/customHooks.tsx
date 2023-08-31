import { useEffect } from "react";

function useInitialData<T>(initialData: T | undefined, setData: React.Dispatch<React.SetStateAction<T>>) {
  useEffect(() => {
    if (initialData !== undefined) {
      setData(initialData);
    }
  }, [initialData]);
}

export default useInitialData;
