import { useCallback, useLayoutEffect, useRef, useState } from "react";

export type UseTypingDecryptOptions = {
  start: boolean;
  delay?: number;
  speed?: {
    typing?: number;
    flash?: number; // tốc độ flash con trỏ
  };
  onEnded?: () => any | Promise<any>;
  lineDelay?: number;
};

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Custom hook tạo hiệu ứng typing với một ô chữ nhật flash liên tục
 */
export function useTypingDecrypt(
  textArray: string[],
  {
    start,
    delay = 0,
    speed = {},
    onEnded,
    lineDelay = 200,
  }: UseTypingDecryptOptions
) {
  const [textLines, setTextLines] = useState<React.ReactNode[]>([]);
  const [ended, setEnded] = useState(false);
  const [endValue, setEndValue] = useState<any>(undefined);
  const [running, setRunning] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const cancelledRef = useRef(false);
  const onEndedRef = useRef(onEnded);
  const speedRef = useRef(speed);
  const prevStartRef = useRef<boolean>(!!start);
  const prevTextArrayRef = useRef<string[]>(textArray);

  useLayoutEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useLayoutEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const reset = useCallback(() => {
    requestAnimationFrame(() => {
      cancelledRef.current = false;
      setTextLines([]);
      setEnded(false);
      setEndValue(undefined);
      setRunning(false);
      setCurrentLineIndex(0);
      prevStartRef.current = false;
      prevTextArrayRef.current = textArray;
    });
  }, [textArray]);

  const arraysEqual = useCallback((a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
  }, []);

  useLayoutEffect(() => {
    const shouldStart =
      (start && !prevStartRef.current) ||
      (start && !arraysEqual(prevTextArrayRef.current, textArray));

    prevStartRef.current = start;
    prevTextArrayRef.current = [...textArray];

    if (!shouldStart) return;

    cancelledRef.current = false;
    setTextLines([]);
    setEnded(false);
    setEndValue(undefined);
    setRunning(true);
    setCurrentLineIndex(0);

    const animate = async () => {
      try {
        const typingSpeed = speedRef.current?.typing ?? 80;
        const flashSpeed = speedRef.current?.flash ?? 120;
        const completedLines: React.ReactNode[] = [];

        for (let lineIndex = 0; lineIndex < textArray.length; lineIndex++) {
          if (cancelledRef.current) return setRunning(false);
          setCurrentLineIndex(lineIndex);
          const currentText = textArray[lineIndex];
          let out = "";
          for (let i = 0; i < currentText.length; i++) {
            if (cancelledRef.current) return setRunning(false);
            const target = currentText[i];

            const startFlash = Date.now();
            while (Date.now() - startFlash < typingSpeed) {
              if (cancelledRef.current) return setRunning(false);
              const elapsed = Date.now() - startFlash;
              const visible = Math.floor(elapsed / flashSpeed) % 2 === 0;
              setTextLines([
                ...completedLines,
                <>
                  {out}
                  {visible && (
                    <span
                      className="animate-pulse"
                      style={{
                        display: "inline-block",
                        width: "0.6em",
                        height: "1em",
                        background: "currentColor",
                        marginLeft: "2px",
                        animationDuration: "1000ms",
                      }}
                    />
                  )}
                </>,
              ]);
              await wait(flashSpeed);
            }

            out += target;

            setTextLines([...completedLines, out]);
          }
          completedLines.push(out);
          setTextLines([...completedLines]);
          if (lineIndex < textArray.length - 1) await wait(lineDelay);
        }

        if (delay > 0) {
          await wait(delay);
          if (cancelledRef.current) return;
        }

        if (!cancelledRef.current) {
          setRunning(false);
          setEnded(true);
        }

        if (onEndedRef.current) {
          try {
            const result = onEndedRef.current();
            if (result instanceof Promise) {
              const resolved = await result;
              if (!cancelledRef.current) setEndValue(resolved);
            } else {
              if (!cancelledRef.current) setEndValue(result);
            }
          } catch (error) {
            console.warn("Error in onEnded callback:", error);
            if (!cancelledRef.current) setEndValue(undefined);
          }
        }
      } catch (error) {
        console.warn("Error in typing decrypt animation:", error);
        if (!cancelledRef.current) setRunning(false);
      }
    };

    animate();
    return () => {
      cancelledRef.current = false;
    };
  }, [start, textArray, delay, lineDelay, arraysEqual]);

  return { textLines, ended, endValue, running, currentLineIndex, reset };
}
