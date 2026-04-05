// components/CookieConsentManager.tsx
'use client'

import { useCookieConsent } from '@/providers/CookieConsentProvider'
import Script from 'next/script'
import { useState } from 'react'

const GA_ID = 'G-VXMNGDLCJV'

export default function CookieConsentManager() {
  const { consent, updateConsent, hasDecided } = useCookieConsent()
  const [showModal, setShowModal] = useState(false)

  const acceptAll = () => updateConsent({ analytics: true, externalMedia: true })

  const rejectAll = () => updateConsent({ analytics: false, externalMedia: false })

  return (
    <>
      {/* --- Google Analytics --- */}
      {consent.analytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* --- Initial Banner --- */}
      {!hasDecided && (
        <div style={banner.container}>
          <p>
            We use cookies for analytics and to embed external content such as Google
            Maps.
          </p>
          <div style={banner.buttons}>
            <button onClick={acceptAll} style={banner.accept}>
              Accept all
            </button>
            <button onClick={rejectAll} style={banner.reject}>
              Reject optional
            </button>
            <button onClick={() => setShowModal(true)} style={banner.settings}>
              Settings
            </button>
          </div>
        </div>
      )}

      {/* --- Manage Cookies Button (footer / settings) --- */}
      {hasDecided && (
        <button onClick={() => setShowModal(true)} className="links p-2">
          Cookie settings
        </button>
      )}

      {/* --- Modal --- */}
      {showModal && (
        <div style={modal.overlay}>
          <div style={modal.box}>
            <h2>Cookie Preferences</h2>

            <label>
              <input type="checkbox" checked disabled /> Necessary (always)
            </label>

            <label>
              <input
                type="checkbox"
                checked={consent.analytics}
                onChange={e => updateConsent({ analytics: e.target.checked })}
              />
              Analytics
            </label>

            <label>
              <input
                type="checkbox"
                checked={consent.externalMedia}
                onChange={e => updateConsent({ externalMedia: e.target.checked })}
              />
              External media (Google Maps, YouTube)
            </label>

            <div style={modal.actions}>
              <button onClick={rejectAll} style={modal.revoke}>
                Revoke all optional cookies
              </button>
              <button onClick={() => setShowModal(false)} style={modal.close}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const banner = {
  container: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    width: '100%',
    background: '#f3f4f6',
    padding: '1rem',
    textAlign: 'center' as const,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  accept: {
    background: '#4ade80',
    padding: '0.5rem 1rem',
    border: 'none',
    cursor: 'pointer',
  },
  reject: {
    background: '#ef4444',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    cursor: 'pointer',
  },
  settings: {
    background: '#e5e7eb',
    padding: '0.5rem 1rem',
    border: 'none',
    cursor: 'pointer',
  },
}

const modal = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 1001,
  },
  box: {
    background: '#fff',
    padding: '2rem',
    maxWidth: 420,
    margin: '10% auto',
    borderRadius: 8,
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  revoke: {
    background: '#ef4444',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    cursor: 'pointer',
  },
  close: {
    background: '#4ade80',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    cursor: 'pointer',
  },
}
