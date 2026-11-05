import { useCallback, useEffect, useRef, useState } from 'react';

const SPEEDS = { lambat: 28, normal: 60, instan: Infinity };

// Menampilkan teks huruf demi huruf. Pemain bisa menyelesaikannya kapan saja.
export default function useTypewriter(text, speedKey = 'normal', reduceMotion = false) {
  const cps = reduceMotion ? Infinity : SPEEDS[speedKey] || SPEEDS.normal;
  const [count, setCount] = useState(cps === Infinity ? text.length : 0);
  const raf = useRef(0);

  useEffect(() => {
    if (cps === Infinity) {
      setCount(text.length);
      return undefined;
    }
    setCount(0);
    const start = performance.now();
    const tick = (now) => {
      const n = Math.min(text.length, Math.floor(((now - start) / 1000) * cps));
      setCount(n);
      if (n < text.length) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text, cps]);

  const finish = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setCount(text.length);
  }, [text]);

  return { shown: text.slice(0, count), done: count >= text.length, finish };
}
