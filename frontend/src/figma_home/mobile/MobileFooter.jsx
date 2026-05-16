/**
 * MobileFooter — pixel-accurate Figma "Mobile Footer" frame (360 × 1219).
 *
 * Extracted verbatim from `MobileHomePage.jsx` so the EXACT same footer is
 * rendered on every public mobile route (catalog, blog, single-car, calc,
 * about, contacts, …).  Logic is intentionally duplicated 1:1 from the
 * homepage; this is the single source of truth going forward.
 *
 * Dynamic data is hydrated from `GET /api/site-info`:
 *   • header.phones                        → top phone numbers
 *   • footer.contacts.addresses            → address block
 *   • footer.contacts.working_hours        → "Working hours: …"
 *   • footer.contacts.registration_address → "Registration address: …"
 *   • footer.viber_community.{url,label*}  → "Join our group …" + Viber icon
 *   • footer.socials.{instagram,facebook,telegram}.url → social icons
 *
 * Modals are reused from the SAME providers as the desktop footer:
 *   • useGetInTouch  → "Get in touch" button
 *   • usePolicyModal → CONDITIONS / PRIVACY POLICY / COOKIES legal row
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGetInTouch } from '../../components/public/GetInTouchModal';
import { usePolicyModal } from '../../components/public/PolicyModal';

const API = process.env.REACT_APP_BACKEND_URL || '';

const FALLBACK_PHONES = ['+359 875 313 158', '+359 897 884 804'];
const FALLBACK_ADDRESSES = [
  'Bulgaria, Sofia, Dragalevtsi, Vitosha Blvd. No. 230',
  'Bulgaria, Sofia, Bulgaria Blvd., No. 81',
];

/* Minimal `fmtLang` helper — identical to the homepage’s logic.  Accepts a
 * string OR an object with `{ en, bg }` and returns the requested locale. */
function fmtLang(value, langKey) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return value[langKey] || value.en || value.bg || '';
  return String(value);
}

export default function MobileFooter({ lang = 'en' }) {
  const [siteInfo, setSiteInfo] = useState(null);
  const { open: openGetInTouch } = useGetInTouch();
  const { open: openPolicy } = usePolicyModal();

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API}/api/site-info`)
      .then((r) => { if (!cancelled) setSiteInfo(r.data || null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const phones    = siteInfo?.header?.phones || siteInfo?.footer?.contacts?.phones || FALLBACK_PHONES;
  const addresses = siteInfo?.footer?.contacts?.addresses || FALLBACK_ADDRESSES;
  const socials   = siteInfo?.footer?.socials || {};
  const langKey   = (lang || 'en').toLowerCase().startsWith('bg') ? 'bg' : 'en';
  const viberCommunity = siteInfo?.footer?.viber_community || {};
  const viberLabel = fmtLang(viberCommunity[`label_${langKey}`] || viberCommunity.label, langKey)
    || 'Join our group and get the hottest offers';

  return (
    <footer
      data-testid="mobile-footer"
      style={{
        position: 'relative',
        width: '100%',
        height: 1219,
        background: '#000',
        color: '#FFFFFF',
        fontFamily: "'Mazzard', 'Mazzard H', system-ui, -apple-system, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* 1 — LOGO BIBI */}
      <img
        src="/figma/BiBi-logo-02-1.svg"
        alt="BIBI Cars"
        data-testid="footer-logo"
        style={{ position: 'absolute', left: 16, top: 53, width: 133, height: 46, objectFit: 'contain' }}
      />

      {/* 2 — PHONE NUMBER block */}
      <div data-testid="footer-phone-block" style={{ position: 'absolute', top: 141, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontWeight: 500, fontSize: 12, lineHeight: '14px', color: '#FFFFFF', letterSpacing: 0 }}>
          Phone number:
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {phones.map((p, i) => (
            <a
              key={i}
              href={`tel:${p.replace(/\s+/g, '')}`}
              data-testid={`footer-phone-${i}`}
              style={{ fontWeight: 500, fontSize: 18, lineHeight: '22px', color: '#FEAE00', textDecoration: 'none' }}
            >
              {p}
            </a>
          ))}
        </div>
      </div>

      {/* 3 — GET IN TOUCH (outline yellow button) */}
      <button
        type="button"
        data-testid="footer-get-in-touch"
        onClick={() => openGetInTouch()}
        style={{
          position: 'absolute', top: 267, left: 16, right: 16, width: 'auto', height: 45,
          background: 'transparent', color: '#FEAE00', border: '1px solid #FEAE00',
          borderRadius: 4, padding: '10px 32px', boxSizing: 'border-box',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Mazzard', 'Mazzard H', system-ui, -apple-system, sans-serif",
          fontWeight: 500, fontSize: 14, lineHeight: '17px', letterSpacing: '0.02em',
          cursor: 'pointer', transition: 'background 150ms ease, color 150ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#FEAE00'; e.currentTarget.style.color = '#000'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FEAE00'; }}
      >
        Get in touch
      </button>

      {/* 4 — ADDRESS */}
      <div data-testid="footer-address-block" style={{ position: 'absolute', top: 386.6, left: 16, right: 16 }}>
        <div style={{ fontWeight: 500, fontSize: 12, lineHeight: '14px', color: '#FFFFFF' }}>Address:</div>
        <div style={{ marginTop: 16, fontWeight: 500, fontSize: 18, lineHeight: '24px', color: '#FEAE00' }}>
          {addresses.map((a, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 8 }}>{a}</div>
          ))}
        </div>
      </div>

      {/* 5 — WORKING HOURS */}
      <div
        data-testid="footer-working-hours"
        style={{ position: 'absolute', top: 514.6, left: 16, right: 16, fontWeight: 500, fontSize: 14, lineHeight: '18px', color: '#949494' }}
      >
        ( Working hours: {siteInfo?.footer?.contacts?.working_hours || 'Mon - Fri, 10.00 - 19.00'} )
      </div>

      {/* 5b — REGISTRATION ADDRESS */}
      <div
        data-testid="footer-registration-address"
        style={{ position: 'absolute', top: 542.6, left: 16, right: 16, fontWeight: 500, fontSize: 14, lineHeight: '18px', color: '#949494' }}
      >
        <div>Registration address:</div>
        <div>
          {siteInfo?.footer?.contacts?.registration_address
            || 'Republic of Bulgaria, 1415, Sofia, Cherni Vrah Blvd., 230'}
        </div>
      </div>

      {/* 6 — DIVIDER */}
      <div aria-hidden style={{ position: 'absolute', left: 16, right: 16, top: 627.6, height: 1, background: '#3a3a38' }} />

      {/* 7a — JOIN OUR GROUP */}
      <div
        data-testid="footer-join-our-group"
        style={{ position: 'absolute', top: 652.6, left: 16, maxWidth: 196, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}
      >
        <span style={{ fontWeight: 500, fontSize: 12, lineHeight: '15px', color: '#FFFFFF', letterSpacing: 0 }}>
          {viberLabel}
        </span>
        <a
          href={viberCommunity?.url || 'viber://chat?number=%2B359875313158'}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Viber community"
          data-testid="footer-viber-link"
          style={{ display: 'inline-flex' }}
        >
          <img src="/figma/basil-viber-outline.svg" alt="" width={42} height={42} style={{ display: 'block' }} />
        </a>
      </div>

      {/* 7b — SOCIAL MEDIA */}
      <div
        data-testid="footer-social-media"
        style={{ position: 'absolute', top: 652.6, right: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <span style={{ fontWeight: 500, fontSize: 12, lineHeight: '14px', color: '#FFFFFF', letterSpacing: 0 }}>
          Social media:
        </span>
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href={socials?.instagram?.url || '#'} target="_blank" rel="noreferrer noopener" aria-label="Instagram" data-testid="footer-social-instagram" style={{ display: 'inline-flex' }}>
            <img src="/figma/ri-instagram-line.svg" alt="" width={32} height={32} style={{ display: 'block' }} />
          </a>
          <a href={socials?.facebook?.url || '#'} target="_blank" rel="noreferrer noopener" aria-label="Facebook" data-testid="footer-social-facebook" style={{ display: 'inline-flex' }}>
            <img src="/figma/ic-twotone-facebook.svg" alt="" width={32} height={32} style={{ display: 'block' }} />
          </a>
          <a href={socials?.telegram?.url || '#'} target="_blank" rel="noreferrer noopener" aria-label="Telegram" data-testid="footer-social-telegram" style={{ display: 'inline-flex' }}>
            <img src="/figma/ic-round-telegram.svg" alt="" width={32} height={32} style={{ display: 'block' }} />
          </a>
        </div>
      </div>

      {/* 8 — NAV */}
      <nav
        data-testid="footer-nav"
        style={{ position: 'absolute', top: 792.6, left: 41, right: 41, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}
      >
        {[
          { label: 'CATALOG',    href: '/catalog' },
          { label: 'CALCULATOR', href: '/calculator' },
          { label: 'ABOUT US',   href: '/about' },
          { label: 'BLOG',       href: '/blog' },
        ].map((it) => (
          <a
            key={it.label}
            href={it.href}
            data-testid={`footer-nav-${it.label.toLowerCase().replace(' ', '-')}`}
            style={{ fontWeight: 400, fontSize: 16, lineHeight: '20px', letterSpacing: '0.04em', color: '#FFFFFF', textDecoration: 'none', transition: 'color 150ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FEAE00'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
          >
            {it.label}
          </a>
        ))}
      </nav>

      {/* 9 — LEGAL ROW */}
      <div
        data-testid="footer-legal-row"
        style={{ position: 'absolute', top: 1006.48, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        {[
          { label: 'CONDITIONS',     key: 'conditions' },
          { label: 'PRIVACY POLICY', key: 'privacy'    },
          { label: 'COOKIES',        key: 'cookies'    },
        ].map((it) => (
          <button
            key={it.key}
            type="button"
            data-testid={`footer-policy-${it.key}`}
            onClick={() => openPolicy(it.key)}
            style={{
              background: 'transparent', border: 'none', padding: 0, margin: 0, cursor: 'pointer',
              fontFamily: "'Mazzard', 'Mazzard H', system-ui, -apple-system, sans-serif",
              fontWeight: 500, fontSize: 12, lineHeight: '14px', letterSpacing: '0.04em',
              color: '#FFFFFF', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FEAE00'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
          >
            {it.label}
          </button>
        ))}
      </div>

      {/* 10 — VAT / ID / COMPANY */}
      <div
        data-testid="footer-vat-id"
        style={{
          position: 'absolute', top: 1041.601, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontWeight: 500, fontSize: 10, lineHeight: '14px', letterSpacing: '0.04em', color: '#5E5E5E',
        }}
      >
        <span>VAT BG206637283</span>
        <span>ID 206637283</span>
        <span>PM AUTO GROUP LTD</span>
      </div>

      {/* 11 — WEBSITE CREDITS */}
      <div
        data-testid="footer-website-credits"
        style={{ position: 'absolute', top: 1136.06, left: 16, right: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
      >
        <a
          href="https://www.olhalazarieva.com"
          target="_blank"
          rel="noreferrer noopener"
          data-testid="footer-credit-design"
          style={{ fontWeight: 500, fontSize: 12, lineHeight: '14px', letterSpacing: '0.04em', color: '#FFFFFF', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 150ms ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FEAE00'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
        >
          / Website design - O.la /
        </a>
        <a
          href="https://www.eva-x.cx.com"
          target="_blank"
          rel="noreferrer noopener"
          data-testid="footer-credit-evax"
          style={{ fontWeight: 500, fontSize: 12, lineHeight: '14px', letterSpacing: '0.04em', color: '#FFFFFF', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 150ms ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FEAE00'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
        >
          / Website made with Eva-X /
        </a>
      </div>

      {/* 12 — © COPYRIGHT */}
      <div
        data-testid="footer-copyright"
        style={{ position: 'absolute', bottom: 19, left: 72, right: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: '#FFFFFF' }}
      >
        <img
          src="/figma/ant-design-copyright-circle-outlined.svg"
          alt=""
          width={18}
          height={18}
          style={{ display: 'block' }}
          aria-hidden="true"
        />
        <span style={{ fontWeight: 500, fontSize: 10, lineHeight: '14px', letterSpacing: '0.04em', color: '#FFFFFF', whiteSpace: 'nowrap' }}>
          {new Date().getFullYear()}. All right reserved. BIBI CARS
        </span>
      </div>
    </footer>
  );
}
