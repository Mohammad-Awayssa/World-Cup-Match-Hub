import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { getMatchScores } from '../../utils/score';
import { getFlagUrl } from '../../utils/flagUrl';
import { useLanguage } from '../../hooks/useLanguage';
import { localizeTeam } from '../../i18n/entities';


const STORAGE_KEY = 'wc2026-celebration-shown';
const CELEBRATION_DURATION_MS = 10000;
const MODAL_DELAY_MS = 1500;
const FADE_OUT_MS = 800;

/* ── Determine winner from final match ── */
function getWinner(match) {
  if (!match || match.status !== 'finished') return null;
  const { homeScore, awayScore, homePenalties, awayPenalties } = getMatchScores(match);
  if (homeScore == null || awayScore == null) return null;

  let side = null;
  if (homeScore !== awayScore) {
    side = homeScore > awayScore ? 'home' : 'away';
  } else if (homePenalties != null && awayPenalties != null && homePenalties !== awayPenalties) {
    side = homePenalties > awayPenalties ? 'home' : 'away';
  }
  if (!side) return null;

  return {
    team: match[`${side}Team`],
    code: match[`${side}Code`],
  };
}

/* ── Canvas particle system ── */
function createParticleSystem(canvas) {
  const ctx = canvas.getContext('2d');
  let animId = null;
  let particles = [];
  let fireworks = [];
  let sparkles = [];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize);

  const goldColors = [
    '#FFD700', '#FFC125', '#FFF1C1', '#F5A623',
    '#FFEC8B', '#DAA520', '#FFE4B5', '#FF8C00',
    '#FFFFFF', '#FFD700', '#F0E68C',
  ];

  // Spawn confetti
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      w: Math.random() * 8 + 4,
      h: Math.random() * 5 + 2,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 1.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      color: goldColors[Math.floor(Math.random() * goldColors.length)],
      opacity: Math.random() * 0.5 + 0.5,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // Spawn sparkles
  for (let i = 0; i < 40; i++) {
    sparkles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      opacity: 0,
      opacityDir: 1,
      speed: Math.random() * 0.03 + 0.01,
      color: goldColors[Math.floor(Math.random() * goldColors.length)],
      delay: Math.random() * 3000,
      born: performance.now(),
    });
  }

  // Launch fireworks periodically
  let lastFirework = 0;
  const launchFirework = (now) => {
    if (now - lastFirework < 800) return;
    lastFirework = now;
    const cx = Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2;
    const cy = Math.random() * window.innerHeight * 0.3 + window.innerHeight * 0.1;
    const count = Math.floor(Math.random() * 15) + 12;
    const color = goldColors[Math.floor(Math.random() * goldColors.length)];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 2 + 1.5;
      fireworks.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.015 + 0.01,
        color,
        size: Math.random() * 2.5 + 1,
      });
    }
  };

  let startTime = performance.now();

  const draw = (now) => {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Global fade out in last 2 seconds
    const globalAlpha = elapsed > CELEBRATION_DURATION_MS - 2000
      ? Math.max(0, (CELEBRATION_DURATION_MS - elapsed) / 2000)
      : 1;

    ctx.globalAlpha = globalAlpha;

    // Draw confetti
    for (const p of particles) {
      p.x += p.vx + Math.sin(now / 1000 + p.phase) * 0.5;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      if (p.y > window.innerHeight + 20) {
        p.y = -20;
        p.x = Math.random() * window.innerWidth;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity * globalAlpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    // Draw sparkles
    for (const s of sparkles) {
      const age = now - s.born;
      if (age < s.delay) continue;

      s.opacity += s.speed * s.opacityDir;
      if (s.opacity >= 1) { s.opacity = 1; s.opacityDir = -1; }
      if (s.opacity <= 0) {
        s.opacity = 0;
        s.opacityDir = 1;
        s.x = Math.random() * window.innerWidth;
        s.y = Math.random() * window.innerHeight;
      }

      ctx.save();
      ctx.globalAlpha = s.opacity * globalAlpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      // 4-point star
      const r = s.size;
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        ctx.lineTo(s.x + Math.cos(angle) * r * 2, s.y + Math.sin(angle) * r * 2);
        ctx.lineTo(
          s.x + Math.cos(angle + Math.PI / 4) * r * 0.5,
          s.y + Math.sin(angle + Math.PI / 4) * r * 0.5,
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Fireworks
    if (elapsed < CELEBRATION_DURATION_MS - 2000) {
      launchFirework(elapsed);
    }
    fireworks = fireworks.filter((fw) => fw.life > 0);
    for (const fw of fireworks) {
      fw.x += fw.vx;
      fw.y += fw.vy;
      fw.vy += 0.03; // gravity
      fw.life -= fw.decay;

      ctx.save();
      ctx.globalAlpha = fw.life * globalAlpha;
      ctx.fillStyle = fw.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = fw.color;
      ctx.beginPath();
      ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.globalAlpha = 1;

    if (elapsed < CELEBRATION_DURATION_MS) {
      animId = requestAnimationFrame(draw);
    }
  };

  animId = requestAnimationFrame(draw);

  return () => {
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}

/* ── Main Component ── */
export function WinnerCelebration({ finalMatch, onComplete, onViewMatch }) {
  const { t, language } = useLanguage();
  const canvasRef = useRef(null);
  const cleanupRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [visible, setVisible] = useState(false);
  const hasRun = useRef(false);

  // Memoize winner so it stays stable across live-data polls
  // (structuredClone creates new object refs every poll cycle)
  const winner = useMemo(() => getWinner(finalMatch), [
    finalMatch?.status,
    finalMatch?.homeScore, finalMatch?.awayScore,
    finalMatch?.homePenalties, finalMatch?.awayPenalties,
    finalMatch?.homeTeam, finalMatch?.awayTeam,
    finalMatch?.homeCode, finalMatch?.awayCode,
  ]);

  const hasWinner = !!winner;

  const dismiss = useCallback(() => {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, FADE_OUT_MS);
  }, [fadingOut, onComplete]);

  useEffect(() => {
    if (!hasWinner) return;
    if (hasRun.current) return;



    hasRun.current = true;
    setVisible(true);

    // Show modal after delay
    const modalTimer = setTimeout(() => setShowModal(true), MODAL_DELAY_MS);

    // Auto-dismiss after celebration duration
    const autoTimer = setTimeout(() => dismiss(), CELEBRATION_DURATION_MS);

    return () => {
      clearTimeout(modalTimer);
      clearTimeout(autoTimer);
    };
  }, [hasWinner, dismiss, onComplete]);

  // Start canvas animations when visible
  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    cleanupRef.current = createParticleSystem(canvasRef.current);
    return () => { cleanupRef.current?.(); };
  }, [visible]);

  if (!visible || !winner) return null;

  const flagUrl = getFlagUrl(winner.code, 160);
  const winnerName = localizeTeam(winner.team, winner.code, language);

  const content = (
    <>
      <div
        className="celebration-overlay"
        style={{ opacity: fadingOut ? 0 : 1 }}
        onClick={dismiss}
      />

      <canvas
        ref={canvasRef}
        className="celebration-canvas"
        style={{ opacity: fadingOut ? 0 : 1, transition: `opacity ${FADE_OUT_MS}ms ease` }}
      />

      {showModal && (
        <div
          className="celebration-modal"
          style={{ opacity: fadingOut ? 0 : 1, transition: `opacity ${FADE_OUT_MS}ms ease` }}
          role="dialog"
          aria-label={t('celebration.worldChampions')}
        >
          <span className="celebration-modal-trophy" aria-hidden="true">🏆</span>
          <h2 className="celebration-modal-title">{t('celebration.worldChampions')}</h2>

          {flagUrl && (
            <img
              src={flagUrl}
              alt={t('common.flagAlt', { team: winnerName })}
              className="celebration-modal-flag"
            />
          )}

          <p className="celebration-modal-winner">{winnerName}</p>
          <p className="celebration-modal-subtitle">
            {t('celebration.congratulations')}
          </p>

          <div className="celebration-modal-buttons">
            <button
              className="celebration-btn celebration-btn-primary"
              onClick={() => { dismiss(); onViewMatch?.(); }}
            >
              {t('celebration.viewMatch')}
            </button>
            <button
              className="celebration-btn celebration-btn-secondary"
              onClick={dismiss}
            >
              {t('celebration.continue')}
            </button>
          </div>
        </div>
      )}
    </>
  );

  return createPortal(content, document.body);
}

export { STORAGE_KEY };
