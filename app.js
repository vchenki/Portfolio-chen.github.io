(function() {
  var currentIndex = 0;
  var images = [];
  var lightbox = null;
  var isOpen = false;

  function initLightbox() {
    if (lightbox) return;
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML =
      '<div class="lightbox-overlay"></div>' +
      '<div class="lightbox-content">' +
        '<img src="" alt="">' +
      '</div>' +
      '<button class="lightbox-close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
          '<line x1="18" y1="6" x2="6" y2="18"></line>' +
          '<line x1="6" y1="6" x2="18" y2="18"></line>' +
        '</svg>' +
      '</button>' +
      '<button class="lightbox-nav lightbox-prev">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
          '<polyline points="15 18 9 12 15 6"></polyline>' +
        '</svg>' +
      '</button>' +
      '<button class="lightbox-nav lightbox-next">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">' +
          '<polyline points="9 18 15 12 9 6"></polyline>' +
        '</svg>' +
      '</button>' +
      '<div class="lightbox-counter"></div>';
    document.body.appendChild(lightbox);

    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);
    lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);

    document.addEventListener('keydown', function(e) {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });
  }

  function openLightbox(src, index, imgs) {
    initLightbox();
    images = imgs;
    currentIndex = index;
    isOpen = true;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('img').src = src;
    lightbox.classList.add('active');
    updateCounter();
    updateNavVisibility();
  }

  function closeLightbox() {
    if (!lightbox) return;
    isOpen = false;
    document.body.style.overflow = '';
    lightbox.classList.remove('active');
  }

  function prevImage() {
    if (images.length <= 1) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightbox.querySelector('img').src = images[currentIndex];
    updateCounter();
    updateNavVisibility();
  }

  function nextImage() {
    if (images.length <= 1) return;
    currentIndex = (currentIndex + 1) % images.length;
    lightbox.querySelector('img').src = images[currentIndex];
    updateCounter();
    updateNavVisibility();
  }

  function updateCounter() {
    if (!lightbox) return;
    var counter = lightbox.querySelector('.lightbox-counter');
    if (images.length > 1) {
      counter.textContent = (currentIndex + 1) + ' / ' + images.length;
      counter.style.display = '';
    } else {
      counter.style.display = 'none';
    }
  }

  function updateNavVisibility() {
    if (!lightbox) return;
    var prev = lightbox.querySelector('.lightbox-prev');
    var next = lightbox.querySelector('.lightbox-next');
    if (images.length <= 1) {
      prev.style.display = 'none';
      next.style.display = 'none';
    } else {
      prev.style.display = '';
      next.style.display = '';
    }
  }

  function bindLightbox() {
    document.querySelectorAll('.media-card').forEach(function(card) {
      var img = card.querySelector('img');
      if (!img || img.closest('.media-placeholder')) return;
      var allImgs = [];
      var allSrcs = [];
      var cards = card.closest('.media-grid').querySelectorAll('.media-card');
      cards.forEach(function(c, i) {
        var im = c.querySelector('img');
        if (im && !im.closest('.media-placeholder')) {
          allImgs.push(im);
          allSrcs.push(im.src);
        }
      });
      var index = allImgs.indexOf(img);
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function(e) {
        e.stopPropagation();
        openLightbox(img.src, index, allSrcs);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindLightbox);
  } else {
    bindLightbox();
  }
})();