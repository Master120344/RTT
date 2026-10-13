/* Small usability touches shared by the seasonal pages. */
document.addEventListener('DOMContentLoaded', function () {
  var photo = document.querySelector('#hero-slideshow-image, #hero-mobile-slideshow');
  if (photo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var pause = document.createElement('button');
    pause.type = 'button';
    pause.className = 'photo-pause';
    pause.textContent = 'Pause photos';
    pause.setAttribute('aria-pressed', 'false');
    pause.addEventListener('click', function () {
      var paused = photo.dataset.paused !== 'true';
      photo.dataset.paused = String(paused);
      pause.setAttribute('aria-pressed', String(paused));
      pause.textContent = paused ? 'Play photos' : 'Pause photos';
    });
    photo.parentElement.appendChild(pause);
  }
  var menu = document.querySelector('.mobile-menu');
  var toggle = document.querySelector('.mobile-menu-toggle');
  if (menu && toggle) {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }
});
