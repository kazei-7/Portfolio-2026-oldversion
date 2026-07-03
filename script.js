document.addEventListener('DOMContentLoaded', () => {

    // Enregistrer le plugin GSAP
    gsap.registerPlugin(ScrollTrigger);

    //  1. GESTION DU MENU MOBILE  
    const openBtn = document.getElementById('open-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu .nav-link-mobile');

    // Fonction pour ouvrir le menu (avec GSAP et blocage du scroll)
    function openMenu() {
        mobileMenu.classList.remove('hidden');
        gsap.fromTo(mobileMenu, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        document.body.style.overflow = 'hidden'; // Votre ajout (parfait !)
    }

    // Fonction pour fermer le menu (avec GSAP et restauration du scroll)
    function closeMenu() {
        gsap.to(mobileMenu, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => mobileMenu.classList.add('hidden')
        });
        document.body.style.overflow = 'auto'; 
    }

    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    //  2. DÉFILEMENT FLUIDE 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    //  3. CURSEUR ANIMÉ 
    const cursorDot = document.querySelector("#cursor-dot");
    const cursorOutline = document.querySelector("#cursor-outline");

    if (cursorDot && cursorOutline) {
        gsap.set([cursorDot, cursorOutline], { xPercent: -50, yPercent: -50 });

        window.addEventListener("mousemove", (e) => {
            const { clientX: posX, clientY: posY } = e;

            gsap.set(cursorDot, { x: posX, y: posY });
            gsap.to(cursorOutline, { duration: 0.5, x: posX, y: posY, ease: "power3.out" });
        });


        const interactiveElements = document.querySelectorAll('a, button, input, .tooltip-trigger, .group, [class*="hover:"]');
        
        interactiveElements.forEach((el) => {
            el.addEventListener("mouseover", () => {
                // Animation GSAP 
                gsap.to(cursorOutline, {
                    duration: 0.3,
                    scale: 1.7,
                    borderColor: "#facc15" 
                });
            });
            el.addEventListener("mouseout", () => {
                // Animation GSAP 
                gsap.to(cursorOutline, {
                    duration: 0.3,
                    scale: 1,
                    borderColor: "rgba(255, 255, 255, 0.5)" // Votre style par défaut
                });
            });
        });
    }

    //  4. ANIMATIONS D'ENTRÉE ET AU SCROLL  

    const heroTl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });
    heroTl.from('#hero-title', { opacity: 0, y: 30 }, 0.3)
          .from('#hero-section p', { opacity: 0, y: 30 }, 0.5)
          .from('.tooltip-trigger', { opacity: 0, scale: 0.5, duration: 0.7, ease: 'back.out' }, 0.8);

   
    //  FONCTION OPTIMISÉE 
const animateOnScroll = (selector, stagger = 0.1) => {
    const elements = gsap.utils.toArray(selector);
    if (elements.length === 0) return;

    gsap.set(elements, { opacity: 0, y: 50 });

    ScrollTrigger.batch(elements, {
        start: 'top 85%',
        
        
        once: true, 

        onEnter: batch => gsap.to(batch, { 
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: stagger,
            ease: 'power3.out'
        })
    });
};


    // Appels groupés pour les animations 
    animateOnScroll(
        '#about > .container > h2, #about img, #about .md\\:w-2\\/3 > p, #about .md\\:w-2\\/3 > h2.text-4xl, #about .space-y-8 > div', 
        0.1
    );
    animateOnScroll('#projects h2, #projects .grid > div', 0.15);
    animateOnScroll('main h2.text-3xl, main .relative .sm\\:flex', 0.15);
    animateOnScroll('#contact h2, #contact p, #contact a', 0.2);

});


document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
      // Fonction pour basculer l'état de la carte
      function toggleFlip(targetCard) {
        targetCard.classList.toggle('is-flipped');
        
        const isPressed = targetCard.classList.contains('is-flipped');
        targetCard.setAttribute('aria-pressed', isPressed);
      }

      // Écouteur pour le clic
      card.addEventListener('click', function () {
        toggleFlip(card);
      });

      // Écouteur pour le clavier (Touche "Entrée" ou "Espace")
      card.addEventListener('keydown', function (e) {
        if (e.code === 'Enter' || e.code === 'Space') {
          // Empêche la touche "Espace" de faire défiler la page
          e.preventDefault(); 
          toggleFlip(card);
        }
      });
    });
  });









var swiper = new Swiper(".mySwiper", {
    // Combien de slides afficher
    slidesPerView: 1, 
    
    // Espace entre les slides
    spaceBetween: 30, 
    
    // Centrer la slide active (bien pour 1 ou 3 slides)
    centeredSlides: true, 
    
    // Permet de "saisir" le slider avec la souris
    grabCursor: true, 
    
    // Permet de naviguer en boucle
    loop: true, 

    // Active la pagination (les points)
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    
    // Active les flèches de navigation
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    // "Breakpoints" permet de changer les options selon la taille de l'écran
    breakpoints: {
      // Quand la largeur est >= 768px (votre 'md:')
      768: {
        slidesPerView: 2, // Affiche 2 slides
        spaceBetween: 30,
      },
      // Quand la largeur est >= 1024px (votre 'lg:')
      1024: {
        slidesPerView: 3, // Affiche 3 slides
        spaceBetween: 40,
        centeredSlides: false, // Pas besoin de centrer avec 3 slides
      }
    }
  });


  document.addEventListener('DOMContentLoaded', function() {
    const paperPlaneArrow = document.querySelector('.paper-plane-arrow');
    const scrollThreshold = 1200; // La flèche apparaît après 1200px de défilement

    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            paperPlaneArrow.classList.add('is-visible');
        } else {
            paperPlaneArrow.classList.remove('is-visible');
        }
    });
});
