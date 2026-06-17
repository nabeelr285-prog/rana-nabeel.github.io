/* script.js */
document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initThreeScene();
    initTypewriter();
    initNavbar();
    initTheme();
    initScrollAnimations();
    initCounters();
    initAccordion();
    initParallax();
    initContactForm();
});

function initLoader() {
    const loader = document.getElementById("loader");
    const progress = document.querySelector(".progress");
    let width = 0;
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            gsap.to(loader, {
                opacity: 0,
                duration: 0.6,
                onComplete: () => {
                    loader.style.display = "none";
                    document.body.style.overflow = "auto";
                    triggerHeroAnimations();
                }
            });
        } else {
            width += Math.floor(Math.random() * 15) + 5;
            if (width > 100) width = 100;
            progress.style.width = width + "%";
        }
    }, 400);
}

function triggerHeroAnimations() {
    gsap.from(".hero-content h1", { opacity: 0, y: 40, duration: 1, ease: "power4.out" });
    gsap.from(".hero-content h2", { opacity: 0, y: 30, duration: 1, delay: 0.3, ease: "power4.out" });
    gsap.from(".hero-content .tagline", { opacity: 0, y: 20, duration: 1, delay: 0.5, ease: "power4.out" });
    gsap.from(".hero-content .cta-group", { opacity: 0, y: 20, duration: 1, delay: 0.7, ease: "power4.out" });
}

let scene, camera, renderer, particles;
function initThreeScene() {
    const container = document.getElementById("three-canvas-container");
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const count = 1800;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 12;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const isLight = document.body.classList.contains("light-mode");
    const material = new THREE.PointsMaterial({
        size: 0.025,
        color: isLight ? 0xaa8413 : 0xd4af37,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 4;

    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    window.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;
        gsap.to(particles.rotation, { y: mouseX * 0.5, x: mouseY * 0.5, duration: 1, ease: "power2.out" });
    });
}

function updateThreeMaterialColor(isLight) {
    if (particles && particles.material) {
        particles.material.color.setHex(isLight ? 0xaa8413 : 0xd4af37);
    }
}

function initTypewriter() {
    const element = document.querySelector(".typewriter");
    if (!element) return;
    const words = JSON.parse(element.getAttribute("data-words"));
    let wordIndex = 0;
    let txt = "";
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex % words.length];
        if (isDeleting) {
            txt = currentWord.substring(0, txt.length - 1);
        } else {
            txt = currentWord.substring(0, txt.length + 1);
        }
        element.textContent = txt;

        let typeSpeed = 100;
        if (isDeleting) typeSpeed /= 2;

        if (!isDeleting && txt === currentWord) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && txt === "") {
            isDeleting = false;
            wordIndex++;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    type();
}

function initNavbar() {
    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links a");

    menuBtn.addEventListener("click", () => {
        menuBtn.classList.toggle("open");
        navLinks.classList.toggle("open");
    });

    links.forEach(link => {
        link.addEventListener("click", () => {
            menuBtn.classList.remove("open");
            navLinks.classList.remove("open");
        });
    });

    const sections = document.querySelectorAll("section");
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 120) {
                current = section.getAttribute("id");
            }
        });
        links.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });
}

function initTheme() {
    const toggle = document.getElementById("theme-toggle");
    const icon = toggle.querySelector("i");

    toggle.addEventListener("click", () => {
        if (document.body.classList.contains("dark-mode")) {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
            icon.className = "fas fa-moon";
            updateThreeMaterialColor(true);
        } else {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
            icon.className = "fas fa-sun";
            updateThreeMaterialColor(false);
        }
    });
}

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".glass-card, .section-title").forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray(".skill-bar-fill").forEach(bar => {
        const targetWidth = bar.getAttribute("data-width");
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: "top 90%"
            },
            width: targetWidth,
            duration: 1.5,
            ease: "power2.out"
        });
    });
}

function initCounters() {
    const counters = document.querySelectorAll(".counter");
    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 85%",
            onEnter: () => {
                let count = 0;
                const updateCount = () => {
                    const increment = target / 40;
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 25);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            },
            once: true
        });
    });
}

function initAccordion() {
    const headers = document.querySelectorAll(".accordion-header");
    headers.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const body = item.querySelector(".accordion-body");
            const isOpen = item.classList.contains("open");

            document.querySelectorAll(".accordion-item").forEach(i => {
                i.classList.remove("open");
                i.querySelector(".accordion-body").style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add("open");
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });
}

function initParallax() {
    window.addEventListener("mousemove", (e) => {
        const elements = document.querySelectorAll(".parallax-element");
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        elements.forEach(el => {
            const speed = el.getAttribute("data-speed") || 0.05;
            const xShift = (window.innerWidth / 2 - e.clientX) * speed;
            const yShift = (window.innerHeight / 2 - e.clientY) * speed;
            gsap.to(el, { x: xShift, y: yShift, duration: 0.6, ease: "power1.out" });
        });
    });

    const aboutImgWrapper = document.querySelector(".about-image-wrapper");
    if(aboutImgWrapper) {
        const mainPortrait = aboutImgWrapper.querySelector(".main-portrait");
        const fullPortrait = aboutImgWrapper.querySelector(".full-portrait");
        
        aboutImgWrapper.addEventListener("mouseenter", () => {
            mainPortrait.classList.add("hidden");
            fullPortrait.classList.remove("hidden");
        });
        
        aboutImgWrapper.addEventListener("mouseleave", () => {
            fullPortrait.classList.add("hidden");
            mainPortrait.classList.remove("hidden");
        });
    }
}

function initContactForm() {
    const form = document.getElementById("portfolio-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = form.querySelector(".form-submit-btn");
        const origText = btn.textContent;
        
        btn.textContent = "Processing Stream Network Payload...";
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = "Pipeline Connection Operational!";
            form.reset();
            setTimeout(() => {
                btn.textContent = origText;
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}