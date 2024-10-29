window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;
    const halfScreenHeight = window.innerHeight / 4;
  
    if (scrollPosition >= halfScreenHeight) {
      header.style.backdropFilter = 'blur(8px)';
      header.style.backgroundColor = 'rgba(13, 13, 13, 0.5)';
      header.style.width = '100%';
      header.style.opacity = '1';
      header.style.willChange = 'auto';
    } else {
      header.style = '';
    }
  });