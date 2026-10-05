/**
 * WeddingPlanner.io — Interactive Frontend Engine
 * Features:
 * 1. Mobile Navigation Drawer Toggle
 * 2. Package Selector & Auto-fill into Contact Form
 * 3. Filterable Portfolio Gallery (Category Tabs)
 * 4. Fullscreen Lightbox Modal (Keyboard & Nav Controls)
 * 5. FAQ Accordion (Smooth Expand / Collapse)
 * 6. Contact Form Submission & Toast Notifications
 * 7. Scroll Reveal & Back to Top Button
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MOBILE MENU TOGGLE
  // ==========================================
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 2. PACKAGE SELECTION AUTO-FILL
  // ==========================================
  const selectPkgButtons = document.querySelectorAll('.select-pkg-btn');
  const packageSelect = document.getElementById('packageSelect');

  selectPkgButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgName = btn.getAttribute('data-package');
      if (packageSelect) {
        packageSelect.value = pkgName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const nameField = document.getElementById('clientName');
        if (nameField) nameField.focus();
      }
      showToast(`Selected "${pkgName}"! Please fill in your details.`);
    });
  });

  // ==========================================
  // 3. FILTERABLE GALLERY
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 4. FULLSCREEN LIGHTBOX MODAL
  // ==========================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  const visibleCards = () => Array.from(galleryCards).filter(card => card.style.display !== 'none');

  function openLightbox(index) {
    const cards = visibleCards();
    if (!cards[index]) return;
    currentGalleryIndex = index;

    const img = cards[index].querySelector('img');
    const caption = cards[index].getAttribute('data-caption') || cards[index].querySelector('h4').textContent;

    if (lightboxImg) lightboxImg.src = img.src;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  galleryCards.forEach((card) => {
    card.addEventListener('click', () => {
      const cards = visibleCards();
      const index = cards.indexOf(card);
      openLightbox(index >= 0 ? index : 0);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      const cards = visibleCards();
      currentGalleryIndex = (currentGalleryIndex - 1 + cards.length) % cards.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const cards = visibleCards();
      currentGalleryIndex = (currentGalleryIndex + 1) % cards.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  // ==========================================
  // 5. FAQ ACCORDION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close other items
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));

        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // ==========================================
  // 6. CONTACT FORM SUBMISSION & TOAST
  // ==========================================
  const weddingForm = document.getElementById('weddingForm');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const toastClose = document.getElementById('toastClose');
  let toastTimer;

  function showToast(message, title = "✨ Inquiry Received!") {
    if (!toast) return;
    clearTimeout(toastTimer);
    if (toastMessage) toastMessage.textContent = message;
    const titleElem = document.getElementById('toastTitle');
    if (titleElem) titleElem.textContent = title;

    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      toast.classList.remove('show');
    });
  }

  if (weddingForm) {
    weddingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const submitBtn = document.getElementById('submitBtn');

      if (!name || !phone || !email) {
        alert("Please fill in your Name, Phone Number, and Email.");
        return;
      }

      // Button status feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('span:first-child').textContent = "Sending Details...";
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('span:first-child').textContent = "Send Wedding Inquiry";
        }
        
        showToast(`Thank you, ${name}! Your consultation request has been received. Our team will contact you shortly.`);
        weddingForm.reset();
      }, 900);
    });
  }

  // ==========================================
  // 7. SCROLL REVEAL & BACK TO TOP BUTTON
  // ==========================================
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // IntersectionObserver for reveal elements
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

});
