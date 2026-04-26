import { useEffect, useState } from 'react';
import { isMuted, setMuted, sfx, SOUND_EVENT } from '@/lib/sound';

export function useSound() {
  const [muted, setLocalMuted] = useState(() => isMuted());

  useEffect(() => {
    const handler = (e: Event) => setLocalMuted((e as CustomEvent<boolean>).detail);
    window.addEventListener(SOUND_EVENT, handler);
    return () => window.removeEventListener(SOUND_EVENT, handler);
  }, []);

  return {
    muted,
    setMuted,
    toggle: () => setMuted(!muted),
    sfx,
  };
}
