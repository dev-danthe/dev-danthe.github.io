const body = document.querySelector('body');

fetch('src/components/header.add')
  .then(response => response.text())
  .then(data => {
    let header = data;
    body.insertAdjacentHTML('afterbegin', header);
  })  
  .catch(error => console.error('Erro ao carregar o conteúdo do header:', error));

  const container = document.querySelector('.container');

    fetch('src/pages/home/hero.page')
      .then(response => response.text())
      .then(data => {
        let hero = data;
        container.insertAdjacentHTML('afterbegin', hero);
      })
      .catch(error => console.error('Erro ao carregar o conteúdo do hero:', error));