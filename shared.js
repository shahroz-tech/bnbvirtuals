const st = document.getElementById('scrollTop');
const nb = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (st) st.classList.toggle('visible', y > 400);
  if (nb) nb.classList.toggle('scrolled', y > 60);
});

// Apply scrolled immediately on inner pages (no hero)
if (nb && !document.querySelector('.hero')) {
  nb.classList.add('scrolled');
}


// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Highlight active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  } else {
    a.classList.remove('active');
  }
});

// Fade-in on scroll
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.service-card, .why-card, .testi-card, .step-item, .value-card, .service-row, .contact-detail'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  obs.observe(el);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      contactForm.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
      if (formSuccess) formSuccess.style.display = 'block';
      setTimeout(() => { if (formSuccess) formSuccess.style.display = 'none'; }, 6000);
    }, 1400);
  });
}

// Shared contact modal — available on every page that loads shared.js
(function () {
  // contact.html already contains its own modal markup, so skip there.
  if (document.getElementById('contactModal')) return;

  const modal = document.createElement('div');
  modal.className = 'contact-modal';
  modal.id = 'contactModal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="contact-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle">
      <div class="contact-modal-header">
        <div>
          <p class="contact-modal-eyebrow">Let's talk</p>
          <h2 id="contactModalTitle">Send Us a Message</h2>
          <p>Tell us about your properties and we'll get back to you within one business day.</p>
        </div>
        <button type="button" class="contact-modal-close" aria-label="Close contact form">&times;</button>
      </div>
      <form id="contactForm" class="modal-contact-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <input type="text" id="firstName" name="firstName" placeholder="e.g. Sarah" autocomplete="given-name" required />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input type="text" id="lastName" name="lastName" placeholder="e.g. Ahmed" autocomplete="family-name" required />
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email Address *</label>
          <input type="email" id="email" name="email" placeholder="you@example.com" autocomplete="email" required />
        </div>
        <div class="form-group">
          <label for="phone">Phone / WhatsApp Number</label>
          <input type="tel" id="phone" name="phone" placeholder="+44 7700 000 000" autocomplete="tel" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="properties">Number of Properties</label>
            <select id="properties" name="properties">
              <option value="">Select…</option>
              <option value="1">1 property</option>
              <option value="2-3">2–3 properties</option>
              <option value="4-8">4–8 properties</option>
              <option value="9+">9+ properties</option>
            </select>
          </div>
          <div class="form-group">
            <label for="enquiryType">Enquiry Type</label>
            <select id="enquiryType" name="enquiryType">
              <option value="">Select…</option>
              <option value="discovery">Book a Discovery Call</option>
              <option value="services">Service Enquiry</option>
              <option value="partnership">Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="message">Your Message *</label>
          <textarea id="message" name="message" placeholder="Tell us about your properties and what you're looking for…" required></textarea>
        </div>
        <div class="modal-consent">
          <input type="checkbox" id="consent" name="consent" required />
          <label for="consent">I agree to BnB Virtuals storing my information to respond to this enquiry. We never share your data with third parties.</label>
        </div>
        <button type="submit" class="form-submit">🚀 Send Message</button>
        <div class="modal-form-success" id="formSuccess" role="status" aria-live="polite">✅ Your form passed validation. Connect this form to your email/API backend to send the message securely.</div>
      </form>
    </div>`;
  document.body.appendChild(modal);

  const dialog = modal.querySelector('.contact-modal-dialog');
  const closeButton = modal.querySelector('.contact-modal-close');
  const form = modal.querySelector('#contactForm');
  const successMessage = modal.querySelector('#formSuccess');
  let lastFocusedElement = null;

  function openContactModal(event) {
    if (event) event.preventDefault();
    lastFocusedElement = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => {
      const first = modal.querySelector('#firstName');
      if (first) first.focus();
    }, 120);
  }

  function closeContactModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  // Event delegation: catches every contact link, even plain href="contact.html".
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest(
      '.contact-modal-trigger, a[href="#contactModal"], a[href$="contact.html"]'
    );
    if (trigger) openContactModal(event);
  });

  closeButton.addEventListener('click', closeContactModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeContactModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeContactModal();
    }
    if (event.key === 'Tab' && modal.classList.contains('is-open')) {
      const focusable = dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    successMessage.classList.add('is-visible');
    form.reset();
  });
})();
