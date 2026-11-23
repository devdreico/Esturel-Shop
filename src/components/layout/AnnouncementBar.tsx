import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../../config/site'

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)
  if (!site.announcement.enabled || dismissed) return null
  return (
    <div className="relative z-[45] bg-urple-600 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-1.5 text-xs font-semibold sm:px-6">
        <span>{site.announcement.text}</span>
        {site.announcement.linkHref && (
          <Link to={site.announcement.linkHref} className="underline underline-offset-2 hover:opacity-90">
            {site.announcement.linkLabel}
          </Link>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/20"
          aria-label="Cerrar anuncio"
        >
          ×
        </button>
      </div>
    </div>
  )
}
