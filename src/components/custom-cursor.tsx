import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [borderRadius, setBorderRadius] = useState('50%');

    const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    // Initial values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const widthMV = useMotionValue(12);
    const heightMV = useMotionValue(12);

    // Ultra-snappy physics (High stiffness = fast response)
    const springConfig = { damping: 35, stiffness: 800, mass: 0.5 };

    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);
    const cursorWidth = useSpring(widthMV, springConfig);
    const cursorHeight = useSpring(heightMV, springConfig);

    useEffect(() => {
        const checkPointer = () => setIsVisible(window.matchMedia("(pointer: fine)").matches);
        checkPointer();
        window.addEventListener('resize', checkPointer);
        return () => window.removeEventListener('resize', checkPointer);
    }, []);

    // 1. Global Mouse Tracking (Always runs to keep mouseRef updated)
    useEffect(() => {
        if (!isVisible) return;
        const trackMouse = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            if (!activeElement) {
                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
            }
        };
        window.addEventListener('mousemove', trackMouse, { passive: true });
        return () => window.removeEventListener('mousemove', trackMouse);
    }, [isVisible, activeElement, mouseX, mouseY]);

    // 2. Continuous Hover Detection (Global rAF)
    // This ensures we catch interactions even when scrolling stops or elements move under mouse
    useEffect(() => {
        if (!isVisible || activeElement) return;

        let rAFId: number;

        const checkHoverLoop = () => {
            const x = mouseRef.current.x;
            const y = mouseRef.current.y;

            if (x !== 0 || y !== 0) {
                const target = document.elementFromPoint(x, y) as HTMLElement;
                if (target) {
                    const clickable = target.closest('a, button, input, textarea, [role="button"], .cursor-pointer') as HTMLElement;
                    if (clickable) {
                        setActiveElement(clickable);
                        return; // Stop this loop, the locking loop will take over next render
                    }
                }
            }

            rAFId = requestAnimationFrame(checkHoverLoop);
        };

        checkHoverLoop();

        return () => {
            if (rAFId) cancelAnimationFrame(rAFId);
        };
    }, [isVisible, activeElement]);


    // 3. Active Element Locking & Tracking Loop (rAF)
    useEffect(() => {
        if (!activeElement) {
            // Reset cursor state when releasing
            if (isHovering) {
                setIsHovering(false);
                setBorderRadius('50%');
                widthMV.set(12);
                heightMV.set(12);
            }
            return;
        }

        let rAFId: number;

        const updateLoop = () => {
            // Check if element is still valid/connected
            if (!activeElement.isConnected) {
                setActiveElement(null);
                return;
            }

            const rect = activeElement.getBoundingClientRect();

            // Hit Test: Is mouse still effectively over the element?
            const padding = 15;
            const isOver =
                mouseRef.current.x >= rect.left - padding &&
                mouseRef.current.x <= rect.right + padding &&
                mouseRef.current.y >= rect.top - padding &&
                mouseRef.current.y <= rect.bottom + padding;

            if (!isOver) {
                // Lost hover
                setActiveElement(null);

                // Snap to real mouse pos
                mouseX.set(mouseRef.current.x);
                mouseY.set(mouseRef.current.y);

                // Re-Check Collision
                const newTarget = document.elementFromPoint(mouseRef.current.x, mouseRef.current.y) as HTMLElement;
                if (newTarget) {
                    const clickable = newTarget.closest('a, button, input, textarea, [role="button"], .cursor-pointer') as HTMLElement;
                    if (clickable) setActiveElement(clickable);
                }
                return;
            }

            // Magnetic Lock
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const targetWidth = rect.width + 12;
            const targetHeight = rect.height + 12;

            mouseX.set(centerX);
            mouseY.set(centerY);
            widthMV.set(targetWidth);
            heightMV.set(targetHeight);

            // Update Visuals
            if (!isHovering) setIsHovering(true);
            const style = window.getComputedStyle(activeElement);
            const r = style.borderRadius === '0px' ? '8px' : style.borderRadius;
            if (borderRadius !== r) setBorderRadius(r);

            rAFId = requestAnimationFrame(updateLoop);
        };

        updateLoop();

        return () => {
            if (rAFId) cancelAnimationFrame(rAFId);
        };
    }, [activeElement, isHovering, borderRadius, mouseX, mouseY, widthMV, heightMV]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
            style={{
                x: cursorX,
                y: cursorY,
                width: cursorWidth,
                height: cursorHeight,
                translateX: "-50%",
                translateY: "-50%"
            }}
        >
            <motion.div
                className="w-full h-full bg-white"
                style={{ borderRadius }}
                animate={{
                    backgroundColor: isHovering ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)",
                    borderWidth: isHovering ? 2 : 0,
                    borderColor: "rgba(255,255,255,1)"
                }}
                transition={{
                    backgroundColor: { duration: isHovering ? 0 : 0.15 },
                    borderWidth: { duration: 0.1 },
                    default: { duration: 0.15 }
                }}
            />
        </motion.div>
    );
}
