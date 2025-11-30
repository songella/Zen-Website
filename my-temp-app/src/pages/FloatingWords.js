import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const FloatingWords = () => {
    const [inputValue, setInputValue] = useState('');
    const [floatingLetters, setFloatingLetters] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [theme, setTheme] = useState('night');
    const containerRef = useRef(null);

    const themes = {
        night: {
            background: '#001f3f', // Dark blue background
            texture: 'https://www.transparenttextures.com/patterns/stardust.png',
        },
        sunset: {
            background: 'linear-gradient(180deg, #ff6b6b 0%, #ee5a6f 20%, #c06c84 50%, #6c5b7b 80%, #355c7d 100%)',
            texture: '',
        },
        ocean: {
            background: 'linear-gradient(180deg, #2e3192 0%, #1bffff 40%, #5dade2 70%, #1ba1bb 100%)',
            texture: '',
        },
        forest: {
            background: 'linear-gradient(180deg, #1a472a 0%, #2d5f3f 30%, #4a7c59 60%, #68a07a 100%)',
            texture: '',
        },
    };

    const currentTheme = themes[theme];

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fadeText();
        }
    };

    const fadeText = () => {
        const text = inputValue.trim();
        if (text === '') return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const startX = rect.left + 10;
        const startY = rect.top - 50;

        const newLetters = text.split('').map((letter, index) => {
            const driftX = (Math.random() - 0.5) * 40;
            const driftY = (Math.random() - 0.5) * 40 + 300;

            return {
                id: nextId + index,
                letter,
                startX: startX + index * 10,
                startY,
                driftX,
                driftY,
            };
        });

        setFloatingLetters(prev => [...prev, ...newLetters]);
        setNextId(prev => prev + newLetters.length);
        setInputValue('');

        setTimeout(() => {
            setFloatingLetters(prev =>
                prev.filter(l => !newLetters.find(nl => nl.id === l.id))
            );
        }, 10500);
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            overflow: 'hidden',
            background: currentTheme.background, // Use the gradient again
            backgroundImage: currentTheme.texture ? `url(${currentTheme.texture})` : 'none',
            transition: 'all 1s ease-in-out',
        }}>

            {/* Theme Switcher */}
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                display: 'flex',
                gap: '8px',
            }}>
                <button
                    onClick={() => setTheme('night')}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: theme === 'night' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Night
                </button>
                <button
                    onClick={() => setTheme('sunset')}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: theme === 'sunset' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Sunset
                </button>
                <button
                    onClick={() => setTheme('ocean')}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: theme === 'ocean' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Ocean
                </button>
                <button
                    onClick={() => setTheme('forest')}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: theme === 'forest' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Forest
                </button>
            </div>
            {/* Navigation to Koi Pond */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
            }}>
                <Link to="/koi-pond" style={{
                    color: '#e6e6fa',
                    textDecoration: 'none',
                    fontSize: '18px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                }}>
                    Koi Pond
                </Link>
            </div>
            {/* Floating Letters */}
            {floatingLetters.map(letter => (
                <div
                    key={letter.id}
                    style={{
                        position: 'fixed',
                        left: `${letter.startX}px`,
                        top: `${letter.startY}px`,
                        color: '#fff',
                        fontSize: '18px',
                        animation: 'drift 10s ease-out forwards',
                        animationDelay: '0.5s',
                        '--drift-x': letter.driftX,
                        '--drift-y': letter.driftY,
                    }}
                >
                    {letter.letter}
                </div>
            ))}

            {/* Input Container */}
            <div
                ref={containerRef}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    maxWidth: '600px',
                    textAlign: 'center',
                }}
            >
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your thoughts here..."
                    style={{
                        width: '100%',
                        height: '40px',
                        fontSize: '18px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        outline: 'none',
                        resize: 'none',
                        backgroundColor: '#fff',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    }}
                />
            </div>

            <style>{`
        @keyframes drift {
          0% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(var(--drift-x) * 1px), calc(var(--drift-y) * -1px));
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default FloatingWords;