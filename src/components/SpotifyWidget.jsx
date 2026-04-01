import React, { useState, useEffect } from 'react';
import { spotifySongs } from '../songsData';
import { useTheme } from '../ThemeContext';

// Simple pulsing equalizer animation component
const Equalizer = ({ isPlaying }) => {
    return (
        <div className="flex items-end gap-[2px] h-3 w-3">
            <span className={`w-[2px] bg-green-500 rounded-sm ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-1'}`} style={{ animationDuration: '0.8s' }} />
            <span className={`w-[2px] bg-green-500 rounded-sm ${isPlaying ? 'animate-[bounce_1s_infinite_0.3s]' : 'h-2'}`} style={{ animationDuration: '0.7s' }} />
            <span className={`w-[2px] bg-green-500 rounded-sm ${isPlaying ? 'animate-[bounce_1s_infinite_0.6s]' : 'h-[2px]'}`} style={{ animationDuration: '0.9s' }} />
        </div>
    );
};

const SpotifyWidget = () => {
    const { isDark } = useTheme();
    const [song, setSong] = useState(null);

    useEffect(() => {
        // Get the current day of the month (1-31)
        const today = new Date();
        const dayOfMonth = today.getDate();

        // Hash it nicely nicely so it doesn't break if months are long
        // Arrays are 0-indexed, days are 1-indexed. Use modulo just in case.
        const songIndex = (dayOfMonth - 1) % spotifySongs.length;

        setSong(spotifySongs[songIndex]);
    }, []);

    if (!song) return null;

    return (
        <div className={`hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-mono-space tracking-wider transition-colors max-w-[190px] overflow-hidden ${isDark
            ? 'bg-[#1a1a24]/80 border-gray-800 text-gray-300 hover:border-green-500/50'
            : 'bg-white/80 border-gray-200 text-gray-600 hover:border-green-400'
            }`}>
            {/* Spotify Icon SVG */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#1DB954]" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.3z" />
            </svg>

            <span className="flex gap-1 truncate min-w-0">
                <span className={`opacity-70 shrink-0 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Now:</span>
                <span className={isDark ? 'text-white font-bold truncate min-w-0' : 'text-gray-900 font-bold truncate min-w-0'}>{song.title}</span>
            </span>

            <div className="ml-1">
                <Equalizer isPlaying={true} />
            </div>
        </div>
    );
};

export default SpotifyWidget;
