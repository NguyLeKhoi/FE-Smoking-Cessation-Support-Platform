import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { gsap } from 'gsap';


const GlowingDotsGrid = ({
    baseColor = "#245E51",
    activeColor = "#A8FF51",
    threshold = 150,
    speedThreshold = 100,
    shockRadius = 250,
    shockPower = 5,
    maxSpeed = 5000,
    centerHole = true,
    sx = {}
}) => {
    const containerRef = useRef(null);
    const dotsRef = useRef([]);
    const dotCentersRef = useRef([]);

    // Check if InertiaPlugin is available
    const hasInertiaPlugin = gsap.plugins.inertia !== undefined;

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const colors = { base: baseColor, active: activeColor };

        const buildGrid = () => {
            container.innerHTML = "";
            dotsRef.current = [];
            dotCentersRef.current = [];

            const style = getComputedStyle(container);
            const dotPx = parseFloat(style.fontSize);
            const gapPx = dotPx * 2;
            const contW = container.clientWidth;
            const contH = container.clientHeight;

            const cols = Math.floor((contW + gapPx) / (dotPx + gapPx));
            const rows = Math.floor((contH + gapPx) / (dotPx + gapPx));
            const total = cols * rows;

            const holeCols = centerHole ? (cols % 2 === 0 ? 4 : 5) : 0;
            const holeRows = centerHole ? (rows % 2 === 0 ? 4 : 5) : 0;
            const startCol = (cols - holeCols) / 2;
            const startRow = (rows - holeRows) / 2;

            for (let i = 0; i < total; i++) {
                const row = Math.floor(i / cols);
                const col = i % cols;
                const isHole = centerHole &&
                    row >= startRow && row < startRow + holeRows &&
                    col >= startCol && col < startCol + holeCols;

                const d = document.createElement("div");
                d.classList.add("dot");

                if (isHole) {
                    d.style.visibility = "hidden";
                    d._isHole = true;
                } else {
                    gsap.set(d, { x: 0, y: 0, backgroundColor: colors.base });
                    d._inertiaApplied = false;
                }

                container.appendChild(d);
                dotsRef.current.push(d);
            }

            requestAnimationFrame(() => {
                dotCentersRef.current = dotsRef.current
                    .filter(d => !d._isHole)
                    .map(d => {
                        const r = d.getBoundingClientRect();
                        return {
                            el: d,
                            x: r.left + window.scrollX + r.width / 2,
                            y: r.top + window.scrollY + r.height / 2,
                        };
                    });
            });
        };

        buildGrid();

        const handleResize = () => {
            buildGrid();
        };

        let lastTime = 0, lastX = 0, lastY = 0;

        const handleMouseMove = (e) => {
            const now = performance.now();
            const dt = now - lastTime || 16;
            let dx = e.pageX - lastX;
            let dy = e.pageY - lastY;
            let vx = dx / dt * 1000;
            let vy = dy / dt * 1000;
            let speed = Math.hypot(vx, vy);

            if (speed > maxSpeed) {
                const scale = maxSpeed / speed;
                vx *= scale;
                vy *= scale;
                speed = maxSpeed;
            }

            lastTime = now;
            lastX = e.pageX;
            lastY = e.pageY;

            requestAnimationFrame(() => {
                dotCentersRef.current.forEach(({ el, x, y }) => {
                    const dist = Math.hypot(x - e.pageX, y - e.pageY);
                    const t = Math.max(0, 1 - dist / threshold);
                    const col = gsap.utils.interpolate(colors.base, colors.active, t);
                    gsap.set(el, { backgroundColor: col });

                    if (speed > speedThreshold && dist < threshold && !el._inertiaApplied) {
                        el._inertiaApplied = true;
                        const pushX = (x - e.pageX) + vx * 0.005;
                        const pushY = (y - e.pageY) + vy * 0.005;

                        if (hasInertiaPlugin) {
                            gsap.to(el, {
                                inertia: { x: pushX, y: pushY, resistance: 750 },
                                onComplete() {
                                    gsap.to(el, {
                                        x: 0,
                                        y: 0,
                                        duration: 1.5,
                                        ease: "elastic.out(1,0.75)",
                                    });
                                    el._inertiaApplied = false;
                                },
                            });
                        } else {
                            // Fallback animation without InertiaPlugin
                            gsap.to(el, {
                                x: pushX,
                                y: pushY,
                                duration: 0.5,
                                ease: "power2.out",
                                onComplete() {
                                    gsap.to(el, {
                                        x: 0,
                                        y: 0,
                                        duration: 1.5,
                                        ease: "elastic.out(1,0.75)",
                                    });
                                    el._inertiaApplied = false;
                                },
                            });
                        }
                    }
                });
            });
        };

        const handleClick = (e) => {
            dotCentersRef.current.forEach(({ el, x, y }) => {
                const dist = Math.hypot(x - e.pageX, y - e.pageY);
                if (dist < shockRadius && !el._inertiaApplied) {
                    el._inertiaApplied = true;
                    const falloff = Math.max(0, 1 - dist / shockRadius);
                    const pushX = (x - e.pageX) * shockPower * falloff;
                    const pushY = (y - e.pageY) * shockPower * falloff;

                    if (hasInertiaPlugin) {
                        gsap.to(el, {
                            inertia: { x: pushX, y: pushY, resistance: 750 },
                            onComplete() {
                                gsap.to(el, {
                                    x: 0,
                                    y: 0,
                                    duration: 1.5,
                                    ease: "elastic.out(1,0.75)",
                                });
                                el._inertiaApplied = false;
                            },
                        });
                    } else {
                        // Fallback animation without InertiaPlugin
                        gsap.to(el, {
                            x: pushX,
                            y: pushY,
                            duration: 0.5,
                            ease: "power2.out",
                            onComplete() {
                                gsap.to(el, {
                                    x: 0,
                                    y: 0,
                                    duration: 1.5,
                                    ease: "elastic.out(1,0.75)",
                                });
                                el._inertiaApplied = false;
                            },
                        });
                    }
                }
            });
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleClick);
        };
    }, [baseColor, activeColor, threshold, speedThreshold, shockRadius, shockPower, maxSpeed, centerHole]);

    return (
        <Box
            ref={containerRef}
            data-dots-container-init="true"
            sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                fontSize: '8px',
                display: 'flex',
                flexFlow: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2em',
                pointerEvents: 'none',
                '& .dot': {
                    position: 'relative',
                    width: '1em',
                    height: '1em',
                    borderRadius: '50%',
                    willChange: 'transform, background-color',
                },
                ...sx
            }}
        />
    );
};

export default GlowingDotsGrid;