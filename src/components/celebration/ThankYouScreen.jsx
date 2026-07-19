import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../hooks/useLanguage';

const DISPLAY_DURATION_MS = 3000;
const FADE_MS = 800;

export function ThankYouScreen({ onComplete }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Fade in is handled by initial opacity transition
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, DISPLAY_DURATION_MS);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, DISPLAY_DURATION_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  const rawText = t('celebration.thankYou');
  const lines = rawText.split('\n');

  return createPortal(
    <div
      className="thankyou-screen"
      style={{
        opacity: fadingOut ? 0 : 1,
      }}
    >
      <p className="thankyou-text">
        {lines.map((line, index) => {
          if (line.includes('❤️')) {
            const parts = line.split('❤️');
            return (
              <span key={index}>
                {parts[0]}
                <span className="thankyou-heart">❤️</span>
                {parts[1]}
                {index < lines.length - 1 && <br />}
              </span>
            );
          }
          return (
            <span key={index}>
              {line}
              {index < lines.length - 1 && <br />}
            </span>
          );
        })}
      </p>
    </div>,
    document.body,
  );
}
