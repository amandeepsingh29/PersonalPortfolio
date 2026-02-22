import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, delay = 0, speed = 50 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typingInterval);
                setCompleted(true);
            }
        }, speed);

        return () => clearInterval(typingInterval);
    }, [text, started, speed]);

    return (
        <span className="relative inline-block">
            {displayedText}
            <span
                className={`inline-block w-[3px] h-[1em] bg-red-600 align-middle ml-1 ${completed ? 'animate-pulse' : 'animate-pulse'}`}
                style={{ opacity: started ? 1 : 0 }}
            ></span>
        </span>
    );
};

export default Typewriter;
