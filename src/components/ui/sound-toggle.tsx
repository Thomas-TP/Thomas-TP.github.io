import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '@/hooks/useSound';

export function SoundToggle() {
  const { muted, toggle, sfx } = useSound();

  return (
    <button
      onClick={() => {
        // Play a click before muting so the user hears the toggle confirm
        if (muted) sfx.pop();
        else sfx.click();
        toggle();
      }}
      className="relative flex items-center justify-center p-2 md:p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-300 cursor-pointer"
      aria-label={muted ? 'Unmute UI sounds' : 'Mute UI sounds'}
      title={muted ? 'Unmute UI sounds' : 'Mute UI sounds'}
    >
      {muted ? (
        <VolumeX className="h-[1.2rem] w-[1.2rem]" strokeWidth={1.5} />
      ) : (
        <Volume2 className="h-[1.2rem] w-[1.2rem]" strokeWidth={1.5} />
      )}
    </button>
  );
}
