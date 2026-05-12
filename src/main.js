// =========================================
// 1. INIT LENIS (SMOOTH SCROLLING ENGINE)
// =========================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Integrasi Lenis dengan GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// =========================================
// 2. TYPEWRITER EFFECT
// ========================================
const typewriterData = [
    { text: "🙏 Salam kenal, I am ", isBold: false },
    { text: "Maharani Yassar Dewanti", isBold: true },
    { text: " aka", isBold: false },
    { text: " Rani", isBold: true }
];

let partIndex = 0;
let charIndex = 0;

function runTypeWriter() {
    // 1. Pastikan string di dalam getElementById INI SAMA PERSIS dengan id di HTML-mu
    const target = document.getElementById("typewriter"); 
    
    if (!target) {
        console.warn("⚠️ TYPEWRITER GAGAL: Elemen dengan id='typewriter' tidak ditemukan di HTML!");
        return;
    }

    if (partIndex < typewriterData.length) {
        const currentPart = typewriterData[partIndex];
        
        // 2. BUG EMOJI FIX: Pecah string jadi array agar emoji tidak rusak saat diketik
        const textArray = [...currentPart.text]; 
        
        let currentSpan = target.querySelector(`.part-${partIndex}`);
        if (!currentSpan) {
            currentSpan = document.createElement("span");
            currentSpan.classList.add(`part-${partIndex}`);
            if (currentPart.isBold) currentSpan.classList.add("typewriter-bold");
            target.appendChild(currentSpan);
        }

        if (charIndex < textArray.length) {
            currentSpan.innerHTML += textArray[charIndex];
            charIndex++;
            setTimeout(runTypeWriter, 50); // Kecepatan ketik
        } else {
            partIndex++;
            charIndex = 0;
            setTimeout(runTypeWriter, 50);
        }
    }
}

// =========================================
// 3. GSAP ANIMATIONS: HERO PARALLAX
// =========================================
function initHeroParallax() {
    // Teks Latar Belakang (Scroll ke atas pelan)
    gsap.to(".bg-text-container", {
        y: -150,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-wrapper",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Gambar Utama (Bergerak ke atas lebih cepat)
    gsap.to(".hero-img", {
        y: -300,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-wrapper",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Info Stats (Bergerak ke bawah sedikit)
    gsap.to(".right-stats-container, .hero-info", {
        y: 100,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-wrapper",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}

// =========================================
// 4. GSAP: MILESTONE TUNNEL (AUTO-FINDER)
// =========================================
function initMilestoneAnimations() {
    const section = document.querySelector('.milestone-section');
    const layers = document.querySelectorAll('.m-layer');
    gsap.set(layers, { autoAlpha: 0, scale: 0.1 });
    gsap.set('.m-layer-intro', { autoAlpha: 1, scale: 1 });
    
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=" + (layers.length * 1000),
            scrub: 1,
            pin: true,
            pinType: "transform",   // ADD — keeps pin inside transform context
            anticipatePin: 1,        // ADD — prevents jump-flash on pin start
            invalidateOnRefresh: true // ADD — recalculates bounds on resize/rescale
        }
    });

    // Animasi tetap menargetkan layer di dalam stage yang sudah diskala
    layers.forEach((layer) => {
        tl.to(layer, { autoAlpha: 1, scale: 1, duration: 3 })
          .to(layer, { autoAlpha: 0, scale: 10, duration: 3 });
    });
}
// =========================================
// GSAP: EDUCATION (ORBIT & HOVER REVEAL)
// =========================================
function initEducationAnimations() {
    const section = document.querySelector('.education-orbit-section');
    const logos = document.querySelectorAll('.planet-core'); 
    const contents = document.querySelectorAll('.scatter-layout');

    if (!section || logos.length === 0) return;

    // 1. SETTING AWAL: Sembunyikan konten dan reset rotasi induknya
    gsap.set(contents, { autoAlpha: 0, display: 'none' });
    gsap.set(logos, { rotationY: 0 });

    // 2. LOGIKA SENSOR HOVER
    logos.forEach((logo, index) => {
        // Ambil elemen gambar (anak dari planet-core) agar kita bisa target spesifik
        const visual = logo.querySelector('.planet-visual');

        logo.style.cursor = 'pointer';
        logo.style.position = 'relative';
        logo.style.zIndex = '50';

        // Matikan warna dan glow pada gambar di awal
        if (visual) {
            gsap.set(visual, { filter: 'grayscale(100%) drop-shadow(0px 0px 0px rgba(0, 210, 255, 0))' });
        }

        logo.addEventListener('mouseenter', () => {
            // A. Induknya membalik 360 derajat
            gsap.to(logo, { rotationY: 360, duration: 0.6, ease: "back.out(1.5)" });
            
            // B. Anaknya (gambar) berubah full color & muncul Glow melingkari logo PNG-nya!
            if (visual) {
                gsap.to(visual, { 
                    filter: 'grayscale(0%) drop-shadow(0px 0px 15px gold)', 
                    duration: 0.4, 
                    delay: 0.2 
                });
            }
            
            // C. Munculkan ceritanya
            gsap.to(contents, { autoAlpha: 0, display: 'none', duration: 0.2 }); 
            if (contents[index]) {
                gsap.to(contents[index], { autoAlpha: 1, display: 'block', duration: 0.4, delay: 0.2 });
            }
        });

        logo.addEventListener('mouseleave', () => {
            // A. Induknya putar balik
            gsap.to(logo, { rotationY: 0, duration: 0.6, ease: "power2.out" });
            
            // B. Anaknya (gambar) kembali abu-abu & Glow mati
            if (visual) {
                gsap.to(visual, { 
                    filter: 'grayscale(100%) drop-shadow(0px 0px 0px rgba(0, 210, 255, 0))', 
                    duration: 0.4 
                });
            }
            
            // C. Sembunyikan ceritanya
            if (contents[index]) {
                gsap.to(contents[index], { autoAlpha: 0, display: 'none', duration: 0.3 });
            }
        });
    }); 
}
// =========================================
// 6. GSAP: CURSOR FLOATER (QUICK TO)
// =========================================
function initFloater() {
    const hoverTriggers = document.querySelectorAll('.hover-trigger');
    const floater = document.querySelector('.glass-floater');

    if(!floater) return;

    // GSAP quickTo untuk pergerakan kursor 60fps yang super empuk
    const xTo = gsap.quickTo(floater, "left", {duration: 0.4, ease: "power3"});
    const yTo = gsap.quickTo(floater, "top", {duration: 0.4, ease: "power3"});

    document.addEventListener('mousemove', (e) => {
        if (floater.classList.contains('active')) {
            xTo(e.clientX + 20); 
            yTo(e.clientY + 20);
        }
    });

    hoverTriggers.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const src = card.dataset.src;
            const type = card.dataset.type;
            
            if (src) {
                floater.innerHTML = ''; 
                if (type === 'video') {
                    const vid = document.createElement('video');
                    vid.src = src;
                    vid.autoplay = true; vid.loop = true; vid.muted = true;
                    floater.appendChild(vid);
                } else {
                    const img = document.createElement('img');
                    img.src = src;
                    floater.appendChild(img);
                }
                
                // Animasi GSAP saat muncul
                floater.classList.add('active');
                gsap.to(floater, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.5)" });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Animasi GSAP saat hilang
            gsap.to(floater, { opacity: 0, scale: 0.5, duration: 0.2, ease: "power2.in", onComplete: () => {
                floater.classList.remove('active');
                floater.innerHTML = ''; 
            }});
        });
    });
}


function initExperienceHill() {
    const section = document.querySelector('.experience-section');
    const container = document.querySelector('.carousel-container');
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.experience-section .card');

    if (!section || !track || cards.length === 0) return;

    // 1. GSAP SET ASLIMU TETAP ADA DI SINI
    gsap.set(section, { display: 'block', position: 'relative', height: '100vh', overflow: 'hidden' });
    gsap.set(container, { position: 'absolute', bottom: '8%', left: 0, width: '100%', display: 'flex', alignItems: 'flex-end', zIndex: 5 });
    gsap.set(track, { display: 'flex', flexWrap: 'nowrap', width: 'max-content', paddingLeft: '720px', paddingRight: '720px', gap: '50px', alignItems: 'flex-end' });
    gsap.set(cards, { width: '300px', height: '450px', flexShrink: 0, position: 'relative' });

    const cardInners = document.querySelectorAll('.card-inner-flip');

    // ==========================================
    // A. EFEK MELAYANG & ANGIN ASLIMU TETAP ADA
    // ==========================================
    cardInners.forEach((inner, i) => {
        gsap.to(inner, { 
            y: -15, 
            duration: 1.5 + (i % 3) * 0.5, 
            yoyo: true, 
            repeat: -1, 
            ease: "sine.inOut" 
        });
    });

    let windTimeout;
    window.addEventListener('wheel', (e) => {
        let tiltAngle = e.deltaY > 0 ? 10 : -10; 
        gsap.to(cardInners, { rotation: tiltAngle, duration: 0.3, ease: "power1.out" });
        clearTimeout(windTimeout);
        windTimeout = setTimeout(() => {
            gsap.to(cardInners, { rotation: 0, duration: 0.5, ease: "back.out(1.5)" });
        }, 150);
    });

    // ==========================================
    // B. LOGIKA SCROLL CLAUDE + WATERFALL ASLIMU
    // ==========================================
    let currentActiveCard = null;
    
    // [CLAUDE ADD] — Rasio Skala Panggung
    const getScale = () => Math.min(window.innerWidth / 1440, 1);

    let mainTl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            // [CLAUDE CHANGE] — Matematika layar yang benar
            end: () => "+=" + (track.scrollWidth - 1440) * getScale(), 
            scrub: 1,
            pin: true,
            pinType: "transform",    // [CLAUDE ADD]
            anticipatePin: 1,        // [CLAUDE ADD]
            invalidateOnRefresh: true, // [CLAUDE ADD]
            
            // [ASLI] Logika Matematika Bukitmu (onUpdate)
            onUpdate: () => {
                const centerX = 720;
                let closestCard = null;
                let minDistance = Infinity;

                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.left + rect.width / 2;
                    const distance = Math.abs(cardCenter - centerX);

                    const ratio = (cardCenter - centerX) / centerX; 
                    let hillHeight = 0;
                    let tilt = 0;
                    let cardOpacity = 1;

                    if (ratio < 0) {
                        let dropFactor = Math.abs(ratio);
                        hillHeight = -120 + Math.pow(dropFactor * 2.5, 2) * 150; 
                        tilt = ratio * 20; 
                        if (dropFactor > 0.3) {
                            cardOpacity = 1 - (dropFactor - 0.3) * 2;
                        }
                    } else {
                        hillHeight = -120 + Math.pow(ratio, 2) * 150;
                        tilt = ratio * 10; 
                    }
                    
                    gsap.set(card, { 
                        y: hillHeight, 
                        rotation: tilt,
                        opacity: Math.max(cardOpacity, 0) 
                    });

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCard = card;
                    }
                });

                if (closestCard && closestCard !== currentActiveCard) {
                    if (currentActiveCard) {
                        currentActiveCard.classList.remove('active-highlight');
                        const oldVid = currentActiveCard.querySelector('video');
                        if (oldVid) oldVid.pause();
                    }

                    currentActiveCard = closestCard;
                    currentActiveCard.classList.add('active-highlight');
                    
                    const newVid = currentActiveCard.querySelector('video');
                    if (newVid) newVid.play().catch(()=>{});

                    const titleEl = document.getElementById('global-title');
                    const descEl = document.getElementById('global-desc');
                    if (titleEl) titleEl.innerText = currentActiveCard.getAttribute('data-title');
                    if (descEl) descEl.innerText = currentActiveCard.getAttribute('data-desc');
                }
            }
        }
    });

    // [CLAUDE CHANGE] — Geser rel hanya sejauh sisa panggung (bukan sisa layar HP)
    mainTl.to(track, { x: () => -(track.scrollWidth - 1440), ease: "none" });
}
// =========================================
// INIT ALL + LENIS SYNC (SUPER ENGINE)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. SINKRONISASI LENIS & GSAP (PENTING AGAR TIDAK MACET)
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis();
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
        gsap.ticker.lagSmoothing(0);
        console.log("✅ Lenis Smooth Scroll tersinkronisasi!");
    }

    // 2. Jalankan semua fungsi
    initHeroParallax();
    initEducationAnimations();
    initMilestoneAnimations();
    initExperienceHill();
    
    // (Pastikan fungsi initFloater ada di atasnya)
    if (typeof initFloater === "function") initFloater();

    // =========================================
    // 🟢 SELIPKAN DI SINI: NYALAKAN MESIN KETIK
    // =========================================
    if (typeof runTypeWriter === "function") {
        setTimeout(runTypeWriter, 500); // Mulai ngetik setelah jeda setengah detik
    }

    window.addEventListener('load', () => {
        setTimeout(() => { ScrollTrigger.refresh(); }, 1000);
    });
});

// =========================================
// HOLO ENGINE: THE DOUBLE CONTAINER SCALER
// =========================================
function runHoloEngine() {
    const canvases = document.querySelectorAll('.holo-canvas');
    let scaleRatio = document.documentElement.clientWidth / 1440;
    if (scaleRatio > 1) scaleRatio = 1;
    canvases.forEach(canvas => {
        canvas.style.transform = `scale(${scaleRatio})`;
    });

    // ADD — re-measure all ScrollTrigger instances after DOM rescale
    // Use requestAnimationFrame to ensure the transform has been painted first
    requestAnimationFrame(() => ScrollTrigger.refresh());
}

// Jalankan saat web dimuat dan saat layar di-resize
window.addEventListener('DOMContentLoaded', runHoloEngine);
window.addEventListener('resize', runHoloEngine);
