
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


const cards = ['frontend-card', 'backend-card', 'design-card'];
  const texts = ['frontend', 'backend', 'design'];
  let currentIndex = 0;
  let intervalId;

  function showText(index) {
    texts.forEach((text, i) => {
      document.getElementById(text).style.display = i === index ? 'initial' : 'none';
    });

    cards.forEach((card, i) => {
      const cardElement = document.getElementById(card);
      if (i === index) {
        cardElement.classList.add('card-hover');
      } else {
        cardElement.classList.remove('card-hover');
      }
    });
  }

  function startAutoHover() {
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) < cards.length ? currentIndex + 1 : 0;
      showText(currentIndex);
    }, 7000);
  }

  function stopAutoHover() {
    clearInterval(intervalId);
  }

  cards.forEach((card, index) => {
    const cardElement = document.getElementById(card);
    cardElement.addEventListener('mouseenter', () => {
      stopAutoHover();
      showText(index);
    });

    cardElement.addEventListener('mouseleave', () => {
      startAutoHover();
    });
  });

  startAutoHover();