  window.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('OverlayStory');
    const openBtn = document.getElementById('openStoryBtn');
    const closeBtn = document.getElementById('closeStoryBtn');

    openBtn.addEventListener('click', () => {
      overlay.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
    });
  });