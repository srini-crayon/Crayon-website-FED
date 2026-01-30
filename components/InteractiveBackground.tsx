"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    opacity: number;
    velocityX: number;
    velocityY: number;
    rotationSpeed: number;
    type: "dash" | "dot" | "line";
}

export default function InteractiveBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<Particle[]>([]);
    const animationRef = useRef<number | null>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const width = rect.width || window.innerWidth;
        const height = rect.height || window.innerHeight;

        // Generate random particles
        const particleCount = 60;
        const newParticles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            const types: ("dash" | "dot" | "line")[] = ["dash", "dash", "line", "dot"];
            newParticles.push({
                id: i,
                x: Math.random() * width,
                y: Math.random() * height,
                size: 4 + Math.random() * 8,
                rotation: Math.random() * 360,
                opacity: 0.3 + Math.random() * 0.5,
                velocityX: (Math.random() - 0.5) * 0.8,
                velocityY: (Math.random() - 0.5) * 0.8,
                rotationSpeed: (Math.random() - 0.5) * 1.2,
                type: types[Math.floor(Math.random() * types.length)],
            });
        }

        setParticles(newParticles);

        // Animation loop
        let lastTime = performance.now();
        const animate = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) / 16; // Normalize to ~60fps
            lastTime = currentTime;

            setParticles((prevParticles) =>
                prevParticles.map((particle) => {
                    let newX = particle.x + particle.velocityX * deltaTime;
                    let newY = particle.y + particle.velocityY * deltaTime;
                    let newRotation = particle.rotation + particle.rotationSpeed * deltaTime;

                    // Wrap around screen edges
                    if (newX < -20) newX = width + 20;
                    if (newX > width + 20) newX = -20;
                    if (newY < -20) newY = height + 20;
                    if (newY > height + 20) newY = -20;

                    // Mouse repulsion effect
                    const dx = newX - mouseRef.current.x;
                    const dy = newY - mouseRef.current.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const repulsionRadius = 200;

                    if (distance < repulsionRadius && distance > 0) {
                        const force = (repulsionRadius - distance) / repulsionRadius;
                        const angle = Math.atan2(dy, dx);
                        newX += Math.cos(angle) * force * 8;
                        newY += Math.sin(angle) * force * 8;
                    }

                    return {
                        ...particle,
                        x: newX,
                        y: newY,
                        rotation: newRotation,
                    };
                })
            );

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        // Mouse move handler
        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        container.addEventListener("mousemove", handleMouseMove, { passive: true });

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            container.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 0,
                overflow: "hidden",
            }}
        >
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    style={{
                        position: "absolute",
                        left: particle.x,
                        top: particle.y,
                        width: particle.type === "dot" ? particle.size / 2 : particle.size,
                        height: particle.type === "line" ? particle.size * 2 : particle.type === "dash" ? particle.size / 3 : particle.size / 2,
                        backgroundColor: "#3B82F6",
                        borderRadius: particle.type === "dot" ? "50%" : "2px",
                        opacity: particle.opacity,
                        transform: `rotate(${particle.rotation}deg)`,
                        willChange: "transform, left, top",
                        transition: "none",
                    }}
                />
            ))}
        </div>
    );
}
