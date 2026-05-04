import { useEffect } from 'react';

export default function ClickSoundEffect() {
  useEffect(() => {
    // Look for the audio file inside the public/ directory
    const clickAudio = new Audio('/click.mp3');
    clickAudio.volume = 0.5; // Set volume between 0.0 and 1.0
    
    const handleClick = () => {
      // Clone the audio node so rapid clicks can play over each other
      const soundClone = clickAudio.cloneNode();
      soundClone.volume = clickAudio.volume;
      soundClone.play().catch(() => {
        // Ignore autoplay policy errors (if user hasn't interacted with page yet)
      });
    };
    
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  return null;
}
