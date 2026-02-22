import { useState, useEffect, useRef } from 'react';

const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&!<>';
const randomChar = () => pool[Math.floor(Math.random() * pool.length)];

export default function TextScramble({ text, delay = 0, speed = 30, onComplete, className = '' }) {
  const [output, setOutput] = useState(() =>
    text.split('').map(c => (c === ' ' ? ' ' : randomChar())).join('')
  );
  const cbRef = useRef(onComplete);
  cbRef.current = onComplete;

  useEffect(() => {
    let revealed = 0;
    let tick = 0;
    let iv;

    const t = setTimeout(() => {
      iv = setInterval(() => {
        setOutput(
          text
            .split('')
            .map((c, i) => {
              if (c === ' ') return ' ';
              if (i < revealed) return c;
              return randomChar();
            })
            .join('')
        );
        tick++;
        if (tick % 3 === 0) revealed++;
        if (revealed > text.length) {
          clearInterval(iv);
          setOutput(text);
          cbRef.current?.();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(t);
      clearInterval(iv);
    };
  }, [text, delay, speed]);

  return <span className={className}>{output}</span>;
}
