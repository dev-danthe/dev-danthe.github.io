const body = document.querySelector('body');

fetch('src/components/header.add')
  .then(response => response.text())
  .then(data => {
    body.insertAdjacentHTML('afterbegin', data);
    })  
  .catch(error => console.error('Erro ao carregar o conteúdo do header:', error));

const hero = document.querySelector('.hero');

fetch('src/pages/home/hero.page')
  .then(response => response.text())
  .then(data => {
    hero.insertAdjacentHTML('afterbegin', data);
    })
  .catch(error => console.error('Erro ao carregar o conteúdo do hero:', error));

const resumo = document.querySelector('.resumo');

fetch('src/pages/home/resumo.page')
  .then(response => response.text())
  .then(data => {
    resumo.insertAdjacentHTML('afterbegin', data);
    })
  .catch(error => console.error('Erro ao carregar o conteúdo do hero:', error));

const skills = document.querySelector('.skills');

fetch('src/pages/home/skills.page')
  .then(response => response.text())
  .then(data => {
    skills.insertAdjacentHTML('afterbegin', data);
    })
  .catch(error => console.error('Erro ao carregar o conteúdo do hero:', error));