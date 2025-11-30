import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const KoiPond = () => {
    const [koi, setKoi] = useState([]);
    const [ripples, setRipples] = useState([]);
    const [nextId, setNextId] = useState(0);
    const canvasRef = useRef(null);

    const koiImage = '/images/koi-1.png';

    // Add initial koi
    useEffect(() => {
        const initialKoi = Array.from({ length: 3 }, (_, i) => createKoi(
            Math.random() * 500 + 50,
            Math.random() * 400 + 50,
            i
        ));
        setKoi(initialKoi);
        setNextId(3);
    }, []);

    const createKoi = (x, y, id) => {
        return {
            id,
            x,
            y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 40 + 60,
            angle: Math.random() * Math.PI * 2,
            wiggle: Math.random() * Math.PI * 2,
            flipX: Math.random() > 0.5 ? -1 : 1,
        };
    };

    const handleClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setRipples(prev => [...prev, { x, y, radius: 0, id: Date.now() }]);
        setKoi(prev => [...prev, createKoi(x, y, nextId)]);
        setNextId(prev => prev + 1);
    };

    // Animation loop
    useEffect(() => {
        const interval = setInterval(() => {
            setKoi(prevKoi =>
                prevKoi.map(k => {
                    let newX = k.x + k.vx;
                    let newY = k.y + k.vy;
                    let newVx = k.vx;
                    let newVy = k.vy;

                    if (newX < 50 || newX > 550) {
                        newVx = -k.vx + (Math.random() - 0.5) * 0.2;
                        newX = Math.max(50, Math.min(550, newX));
                    }
                    if (newY < 50 || newY > 450) {
                        newVy = -k.vy + (Math.random() - 0.5) * 0.2;
                        newY = Math.max(50, Math.min(450, newY));
                    }

                    if (Math.random() < 0.02) {
                        newVx += (Math.random() - 0.5) * 0.1;
                        newVy += (Math.random() - 0.5) * 0.1;
                    }

                    const speed = Math.sqrt(newVx * newVx + newVy * newVy);
                    if (speed > 0.8) {
                        newVx = (newVx / speed) * 0.8;
                        newVy = (newVy / speed) * 0.8;
                    }

                    const angle = Math.atan2(newVy, newVx);

                    return {
                        ...k,
                        x: newX,
                        y: newY,
                        vx: newVx,
                        vy: newVy,
                        angle,
                        wiggle: k.wiggle + 0.1,
                    };
                })
            );

            setRipples(prev =>
                prev
                    .map(r => ({ ...r, radius: r.radius + 3 }))
                    .filter(r => r.radius < 100)
            );
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #7dd3fc, #38bdf8)',
            padding: '20px',
        }}>
            <div style={{ textAlign: 'center' }}>
                {/* Navigation */}
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                }}>
                    <Link to="/" style={{
                        color: '#0c4a6e',
                        textDecoration: 'none',
                        fontSize: '18px',
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                    }}>
                        Back to Words
                    </Link>
                </div>

                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 300,
                    color: '#0c4a6e',
                    marginBottom: '8px',
                }}>
                    Koi Pond
                </h1>
                <p style={{
                    color: '#0369a1',
                    fontSize: '0.875rem',
                    marginBottom: '24px',
                }}>
                    tap anywhere to add koi
                </p>

                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div
                        ref={canvasRef}
                        onClick={handleClick}
                        style={{
                            width: '600px',
                            height: '500px',
                            cursor: 'pointer',
                            borderRadius: '24px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                            backgroundImage: 'url(/images/lily-pad-background.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Ripples */}
                        <svg
                            width="600"
                            height="500"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                pointerEvents: 'none',
                            }}
                        >
                            {ripples.map(ripple => (
                                <circle
                                    key={ripple.id}
                                    cx={ripple.x}
                                    cy={ripple.y}
                                    r={ripple.radius}
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.4)"
                                    strokeWidth="2"
                                    opacity={1 - ripple.radius / 100}
                                />
                            ))}
                        </svg>

                        {/* Koi */}
                        {koi.map(k => (
                            <img
                                key={k.id}
                                src={koiImage}
                                alt="koi"
                                style={{
                                    position: 'absolute',
                                    left: `${k.x}px`,
                                    top: `${k.y}px`,
                                    width: `${k.size}px`,
                                    height: `${k.size}px`,
                                    transform: `translate(-50%, -50%) rotate(${k.angle * 180 / Math.PI}deg) scaleX(${k.flipX})`,
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                                    pointerEvents: 'none',
                                }}
                            />
                        ))}
                    </div>

                    <div style={{
                        marginTop: '16px',
                        color: '#0c4a6e',
                        fontSize: '0.75rem',
                    }}>
                        {koi.length} koi swimming peacefully
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KoiPond;