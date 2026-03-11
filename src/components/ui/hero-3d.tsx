'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/components/ui/theme-provider';

function ParticleNetwork(props: any) {
  const ref = useRef<any>(null);
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  // Safely resolve the actual displayed theme
  useMemo(() => {
    if (typeof document !== 'undefined') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(theme === 'dark' || (theme === 'system' && isSystemDark));
    }
  }, [theme]);
  
  // Create thousands of random points
  const [positions, setPositions] = useState<Float32Array | null>(null);
  
  useMemo(() => {
    const count = 3000;
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        p[i * 3]     = (Math.random() - 0.5) * 10;
        p[i * 3 + 1] = (Math.random() - 0.5) * 10;
        p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    setPositions(p);
  }, []);

  // Manual mouse tracking since Canvas has pointer-events: none
  const mouse = useRef({ x: 0, y: 0 });
  const smoothedMouse = useRef({ x: 0, y: 0 });
  
  useMemo(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Lerp mouse position for smooth transitions
      smoothedMouse.current.x += (mouse.current.x - smoothedMouse.current.x) * delta * 2;
      smoothedMouse.current.y += (mouse.current.y - smoothedMouse.current.y) * delta * 2;

      // Base rotation (slower) + smoothed mouse influence (less reactive)
      ref.current.rotation.x -= (delta / 30) + (smoothedMouse.current.y * delta * 0.15);
      ref.current.rotation.y -= (delta / 40) - (smoothedMouse.current.x * delta * 0.15);
    }
  });

  if (!positions) return null;

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color={isDark ? '#4ade80' : '#000000'}
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={isDark ? 0.6 : 1}
        />
      </Points>
    </group>
  );
}

export function Hero3D() {
  return (
    <div 
      className="absolute inset-x-0 top-0 h-[150vh] z-[-1] pointer-events-none opacity-50 dark:opacity-40 flex items-center justify-center overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)'
      }}
    >
      <Canvas camera={{ position: [0, 0, 1] }} className="!h-full !w-full">
        <ParticleNetwork />
      </Canvas>
    </div>
  );
}
