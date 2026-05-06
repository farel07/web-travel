'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import destinations from '../data/destinations.json';

// ─── CONFIG ────────────────────────────────────────────────────
const IG_URL = 'https://www.instagram.com/libraarifin'; 



function formatPrice(p) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);
}

function waLink(number, name) {
  const text = encodeURIComponent(`Halo, saya tertarik dengan paket wisata *${name}*. Boleh minta info lebih lanjut?`);
  return `https://wa.me/${number}?text=${text}`;
}

// ─── ICONS ─────────────────────────────────────────────────────
const IconWa = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.108.548 4.09 1.508 5.814L.057 23.386a.75.75 0 00.914.914l5.57-1.451A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.72 9.72 0 01-4.964-1.361l-.357-.21-3.702.965.985-3.596-.232-.371A9.72 9.72 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

const IconIg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

// ─── IMAGE CAROUSEL ────────────────────────────────────────────
function ImageCarousel({ images, alt, className, wrapClassName }) {
  const [current, setCurrent] = useState(0);
  const imgs = images && images.length > 0 ? images : ['/placeholder.png'];

  const prev = useCallback((e) => {
    e.stopPropagation();
    setCurrent(i => (i - 1 + imgs.length) % imgs.length);
  }, [imgs.length]);

  const next = useCallback((e) => {
    e.stopPropagation();
    setCurrent(i => (i + 1) % imgs.length);
  }, [imgs.length]);

  return (
    <div className={`${styles.carousel} ${wrapClassName || ''}`}>
      <div className={styles.carouselTrack} style={{ transform: `translateX(-${current * 100}%)` }}>
        {imgs.map((src, i) => (
          <img key={i} src={src} alt={`${alt} ${i + 1}`} className={`${styles.carouselImg} ${className || ''}`} loading="lazy" />
        ))}
      </div>
      {imgs.length > 1 && (
        <>
          <button className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`} onClick={prev} aria-label="Foto sebelumnya">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className={`${styles.carouselBtn} ${styles.carouselBtnNext}`} onClick={next} aria-label="Foto berikutnya">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div className={styles.carouselDots}>
            {imgs.map((_, i) => (
              <button
                key={i}
                className={`${styles.carouselDot} ${i === current ? styles.carouselDotActive : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── CARD ──────────────────────────────────────────────────────
function DestinationCard({ dest, onClick }) {

  function handleWa(e) {
    e.stopPropagation();
    window.open(waLink(dest.whatsapp, dest.name), '_blank', 'noopener');
  }

  return (
    <article
      className={styles.card}
      onClick={() => onClick(dest)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(dest)}
      role="button"
      aria-label={`Lihat detail ${dest.name}`}
    >
      <div className={styles.cardImgWrap}>
        <ImageCarousel images={dest.images} alt={dest.name} className={styles.cardImg} />
        <div className={styles.cardOverlay} />
        {dest.badge && <span className={styles.badge}>{dest.badge}</span>}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardDuration}>⏱ {dest.duration}</span>
        </div>
        <h3 className={styles.cardTitle}>{dest.name}</h3>
        <p className={styles.cardLocation}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          {dest.location}
        </p>
        <p className={styles.cardDesc}>{dest.description.substring(0, 88)}…</p>
        <div className={styles.cardFooter}>
          <div className={styles.cardPrice}>
            <span className={styles.priceLabel}>Mulai dari</span>
            <span className={styles.priceVal}>{formatPrice(dest.price)}</span>
          </div>
          <button
            className={styles.cardWaBtn}
            onClick={handleWa}
            id={`wa-card-${dest.slug}`}
            aria-label={`Chat WhatsApp untuk ${dest.name}`}
          >
            <IconWa /> Chat WA
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── MODAL ─────────────────────────────────────────────────────
function Modal({ dest, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  if (!dest) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalImgWrap}>
          <ImageCarousel images={dest.images} alt={dest.name} className={styles.modalImg} wrapClassName={styles.modalCarousel} />
          <div className={styles.modalImgOverlay} />
          <button className={styles.modalClose} onClick={onClose} aria-label="Tutup">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          {dest.badge && <span className={styles.modalBadge}>{dest.badge}</span>}
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalHeader}>
            <div>
              <h2 className={styles.modalTitle}>{dest.name}</h2>
              <p className={styles.modalLocation}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {dest.location}
              </p>
            </div>
            <div className={styles.modalPriceSide}>
              <p className={styles.modalPriceLabel}>Mulai dari</p>
              <p className={styles.modalPrice}>{formatPrice(dest.price)}<span>/orang</span></p>
            </div>
          </div>

          <div className={styles.modalStats}>
            <div className={styles.modalStat}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              <span>{dest.duration}</span>
            </div>
            <div className={styles.modalStat}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span>{dest.bestTime}</span>
            </div>
          </div>

          <p className={styles.modalDesc}>{dest.description}</p>

          {dest.destinations && dest.destinations.length > 0 && (
            <div className={styles.modalDestinations}>
              <h4 className={styles.modalDestinationsTitle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                Destinasi yang Dikunjungi
              </h4>
              <div className={styles.modalDestinationsList}>
                {dest.destinations.map((spot, i) => (
                  <span key={i} className={styles.modalDestinationChip}>
                    📍 {spot}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.modalCta}>
            <a
              href={waLink(dest.whatsapp, dest.name)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnWa}
              id={`book-${dest.slug}`}
            >
              <IconWa />
              Pesan via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────
export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedDest, setSelectedDest] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // tutup menu burger saat resize ke desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setNavOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // kunci scroll saat menu terbuka
  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return destinations;
    const q = search.toLowerCase().trim();
    return destinations.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.location.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      (d.destinations && d.destinations.some(s => s.toLowerCase().includes(q)))
    );
  }, [search]);

  const stats = useMemo(() => ({
    total: destinations.length,
    provinces: [...new Set(destinations.map(d => d.province))].length,
  }), []);

  const LogoSvg = ({ id }) => (
    <svg viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill={`url(#lg-${id})`}/>
      <path d="M8 20c3-6 5-10 8-10s5 4 8 10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 10v12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284c7"/><stop offset="1" stopColor="#6366f1"/>
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <main>

      {/* ── NAVBAR ── */}
      <nav className={`${styles.nav} ${navScrolled ? styles.navScrolled : ''}`} id="navbar">
        <div className={styles.navInner}>
          <div className={styles.navLogo}>
            <LogoSvg id="nav" />
            <span>NusaJelajah</span>
          </div>

          {/* Desktop links */}
          <div className={styles.navLinks}>
            <a href="#destinations" id="nav-destinations">Destinasi</a>
            <a href="#about" id="nav-about">Tentang</a>
          </div>
          <div className={styles.navActions}>
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navIg}
              id="nav-ig"
              aria-label="Instagram NusaJelajah"
            >
              <IconIg /> Instagram
            </a>
            <a href="#destinations" className={styles.navCta} id="nav-cta">Mulai Perjalanan</a>
          </div>

          {/* Burger button — mobile only */}
          <button
            className={`${styles.burger} ${navOpen ? styles.burgerOpen : ''}`}
            onClick={() => setNavOpen(o => !o)}
            aria-label={navOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={navOpen}
            id="burger-btn"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {navOpen && (
        <div className={styles.mobileOverlay} onClick={() => setNavOpen(false)} aria-hidden="true" />
      )}

      {/* Mobile drawer */}
      <div className={`${styles.mobileMenu} ${navOpen ? styles.mobileMenuOpen : ''}`} id="mobile-menu">
        <a href="#destinations" className={styles.mobileLink} onClick={() => setNavOpen(false)}>🗺️ Destinasi</a>
        <a href="#about" className={styles.mobileLink} onClick={() => setNavOpen(false)}>ℹ️ Tentang</a>
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mobileLinkIg}
          onClick={() => setNavOpen(false)}
        >
          <IconIg /> Instagram
        </a>
        <a
          href="#destinations"
          className={styles.mobileCta}
          onClick={() => setNavOpen(false)}
        >
          Mulai Perjalanan
        </a>
      </div>

      {/* ── HERO ── */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroImg}>
          <img src="/hero_bromo.png" alt="Gunung Bromo yang megah saat sunrise" />
          <div className={styles.heroDim} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span>🇮🇩</span> Jelajahi Keindahan Nusantara
          </div>
          <h1 className={styles.heroTitle}>
            Temukan <span className={styles.heroHighlight}>Surga</span><br/>di Indonesia
          </h1>
          <p className={styles.heroSubtitle}>
            Dari gunung berapi yang megah hingga lautan biru jernih, Indonesia menyimpan keajaiban yang menunggu untuk dijelajahi.
          </p>
          <div className={styles.heroSearch}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              id="hero-search"
              type="search"
              placeholder="Cari destinasi, lokasi, atau aktivitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Cari destinasi wisata"
            />
            <button className={styles.searchBtn} id="search-btn">Cari</button>
          </div>
        </div>
        <div className={styles.heroScroll} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className={styles.section} id="destinations">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionLabel}>Destinasi Pilihan</div>
            <h2 className={styles.sectionTitle}>
              Tempat Wisata <span className={styles.gradient}>Terbaik Indonesia</span>
            </h2>
            <p className={styles.sectionSub}>
              Dari keajaiban vulkanik hingga keindahan bawah laut — hubungi kami langsung via WhatsApp untuk info &amp; pemesanan
            </p>
          </div>


          {filtered.length > 0 ? (
            <div className={styles.grid}>
              {filtered.map(dest => (
                <DestinationCard key={dest.id} dest={dest} onClick={setSelectedDest} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <span>🔍</span>
              <p>Tidak ada destinasi yang cocok dengan &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch('')} className={styles.emptyBtn}>
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className={styles.about} id="about">
        <div className={styles.container}>
          <div className={styles.aboutHead}>
            <div className={styles.sectionLabel}>Tentang Kami</div>
            <h2 className={styles.aboutTitle}>Mengapa Memilih <span className={styles.gradient}>NusaJelajah?</span></h2>
            <p className={styles.aboutText}>
              Kami adalah platform wisata Indonesia yang berdedikasi membantu Anda menemukan dan merencanakan perjalanan impian ke berbagai penjuru Nusantara.
            </p>
          </div>
          <div className={styles.featureCards}>
            {[
              { icon: '🛡️', title: 'Terpercaya', desc: 'Destinasi terverifikasi langsung dari tim kami di lapangan. Data selalu diperbarui.' },
              { icon: '💬', title: 'Respon Cepat', desc: 'Chat langsung via WhatsApp, kami siap membantu Anda kapan saja dan di mana saja.' },
              { icon: '📍', title: 'Lokal & Autentik', desc: 'Pengalaman wisata autentik bersama pemandu lokal berpengalaman yang ramah.' },
              { icon: '💰', title: 'Harga Terjangkau', desc: 'Paket wisata dengan harga terbaik tanpa mengorbankan kualitas pengalaman.' },
              { icon: '🗓️', title: 'Jadwal Fleksibel', desc: 'Tentukan sendiri tanggal keberangkatan sesuai kenyamanan dan jadwal Anda.' },
              { icon: '🌿', title: 'Wisata Bertanggung Jawab', desc: 'Kami berkomitmen menjaga kelestarian alam dan budaya destinasi wisata.' },
            ].map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureCardIcon}>{f.icon}</div>
                <h4 className={styles.featureCardTitle}>{f.title}</h4>
                <p className={styles.featureCardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.aboutCta}>
            <a
              href={waLink('6281234567890', 'Paket Wisata NusaJelajah')}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.aboutWaBtn}
              id="about-wa-btn"
            >
              <IconWa /> Hubungi Kami via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <div className={styles.navLogo}>
                <LogoSvg id="footer" />
                <span>NusaJelajah</span>
              </div>
              <p>Temukan keajaiban Indonesia bersama kami. Jelajahi setiap sudut nusantara yang memukau.</p>
            </div>
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerIg}
              id="footer-ig"
              aria-label="Follow Instagram NusaJelajah"
            >
              <IconIg /> @nusajelajah
            </a>
            <p className={styles.footerCopy}>© 2025 NusaJelajah. Dibuat dengan ❤️ untuk Nusantara.</p>
          </div>
        </div>
      </footer>

      {selectedDest && <Modal dest={selectedDest} onClose={() => setSelectedDest(null)} />}
    </main>
  );
}
