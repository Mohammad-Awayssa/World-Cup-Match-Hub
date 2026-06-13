import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Download,
  Link2,
  LoaderCircle,
  MessageCircle,
  Share2,
  X,
} from 'lucide-react'
import { toBlob } from 'html-to-image'
import { useLanguage } from '../../hooks/useLanguage'

const SITE_URL = 'https://worldcupmatches.online'

function makeFilename(homeName, awayName) {
  return `${homeName}-${awayName}-world-cup-match`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function HeroShare({
  cardRef,
  homeName,
  awayName,
  matchDate,
  matchTime,
}) {
  const { isArabic } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const labels = isArabic
    ? {
        button: 'مشاركة المباراة',
        title: 'شارك هذه المباراة',
        apps: 'مشاركة الصورة',
        copy: 'نسخ الرابط',
        copied: 'تم نسخ الرابط',
        download: 'تنزيل الصورة',
        close: 'إغلاق خيارات المشاركة',
      }
    : {
        button: 'Share match',
        title: 'Share this match',
        apps: 'Share image',
        copy: 'Copy link',
        copied: 'Link copied',
        download: 'Download',
        close: 'Close share options',
      }
  const shareText = isArabic
    ? `${homeName} ضد ${awayName} - ${matchDate} الساعة ${matchTime}. تابع المباراة على World Cup Matches Online.`
    : `${homeName} vs ${awayName} - ${matchDate} at ${matchTime}. Follow the match on World Cup Matches Online.`

  const captureCard = async () => {
    if (!cardRef.current) {
      throw new Error('Match card is not available')
    }

    const blob = await toBlob(cardRef.current, {
      backgroundColor: '#030914',
      cacheBust: true,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    })

    if (!blob) {
      throw new Error('Could not create match image')
    }

    return blob
  }

  const runBusy = async (action) => {
    setIsBusy(true)
    try {
      await action()
    } finally {
      setIsBusy(false)
    }
  }

  const handleNativeShare = () =>
    runBusy(async () => {
      const blob = await captureCard()
      const file = new File(
        [blob],
        `${makeFilename(homeName, awayName)}.png`,
        { type: 'image/png' },
      )
      const payload = {
        title: labels.title,
        text: shareText,
        url: SITE_URL,
      }

      if (navigator.canShare?.({ files: [file] })) {
        payload.files = [file]
      }

      if (navigator.share) {
        await navigator.share(payload)
        return
      }

      const downloadUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = file.name
      anchor.click()
      URL.revokeObjectURL(downloadUrl)
    }).catch(() => {})

  const handleDownload = () =>
    runBusy(async () => {
      const blob = await captureCard()
      const downloadUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = `${makeFilename(homeName, awayName)}.png`
      anchor.click()
      URL.revokeObjectURL(downloadUrl)
    }).catch(() => {})

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SITE_URL)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const handleWhatsApp = () => {
    const message = `${shareText}\n${SITE_URL}`
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <div className="relative mt-5 flex justify-center" dir={isArabic ? 'rtl' : 'ltr'}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full border border-[#c8ff00]/35 bg-[#07101d]/90 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(200,255,0,0.1)] transition hover:border-[#c8ff00] hover:text-[#c8ff00]"
        aria-expanded={isOpen}
      >
        <Share2 size={16} />
        {labels.button}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="absolute top-14 z-30 w-[min(92vw,390px)] rounded-2xl border border-white/12 bg-[#050c17]/95 p-3 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-2 flex items-center justify-between px-2 py-1">
              <p className="text-sm font-black uppercase tracking-wide text-white">
                {labels.title}
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label={labels.close}
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleNativeShare}
                disabled={isBusy}
                className="share-option"
              >
                {isBusy ? <LoaderCircle className="animate-spin" size={18} /> : <Share2 size={18} />}
                {labels.apps}
              </button>
              <button type="button" onClick={handleWhatsApp} className="share-option">
                <MessageCircle size={18} />
                WhatsApp
              </button>
              <button type="button" onClick={handleCopy} className="share-option">
                {copied ? <Check size={18} /> : <Link2 size={18} />}
                {copied ? labels.copied : labels.copy}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={isBusy}
                className="share-option"
              >
                <Download size={18} />
                {labels.download}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
