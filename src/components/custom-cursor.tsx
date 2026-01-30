import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [borderRadius, setBorderRadius] = useState('50%');

    const hoveredElementRef = useRef<HTMLElement | null>(null);

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

    useEffect(() => {
        if (!isVisible) return;

        const handleMouseMove = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clickable = target.closest('a, button, input, textarea, [role="button"], .cursor-pointer') as HTMLElement;

            if (clickable) {
                const rect = clickable.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const targetWidth = rect.width + 12;
                const targetHeight = rect.height + 12;

                // Direct spring updates for zero latency
                mouseX.set(centerX);
                mouseY.set(centerY);
                widthMV.set(targetWidth);
                heightMV.set(targetHeight);

                // Update visual state if changed
                if (hoveredElementRef.current !== clickable) {
                    hoveredElementRef.current = clickable;
                    const style = window.getComputedStyle(clickable);
                    setIsHovering(true);
                    setBorderRadius(style.borderRadius === '0px' ? '8px' : style.borderRadius);
                }
            } else {
                hoveredElementRef.current = null;

                mouseX.set(e.clientX);
                mouseY.set(e.clientY);
                widthMV.set(12);
                heightMV.set(12);

                if (isHovering) {
                    setIsHovering(false);
                    setBorderRadius('50%');
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isVisible, isHovering, mouseX, mouseY, widthMV, heightMV]);

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
                    backgroundColor: { duration: isHovering ? 0 : 0.15 }, // Instant transparent on hover
                    borderWidth: { duration: 0.1 },
                    default: { duration: 0.15 }
                }}
            />
        </motion.div>
    );
}
