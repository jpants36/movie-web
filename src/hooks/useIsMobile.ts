import { useEffect, useRef, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const isMobileCurrent = useRef<boolean | null>(false);

  useEffect(() => {
    function onResize() {
      const value = window.innerWidth < 1024;
      const isChanged = isMobileCurrent.current !== value;
      if (!isChanged) return;

      isMobileCurrent.current = value;
      setIsMobile(value);
    }

    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return {
    isMobile,
  };
}
