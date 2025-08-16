const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let index = 0;

nextBtn.addEventListener('click', () => {
  const cards = document.querySelectorAll('.card').length;
  if (index < cards - 1) index++;
  track.style.transform = `translateX(-${index * 270}px)`;
});

prevBtn.addEventListener('click', () => {
  if (index > 0) index--;
  track.style.transform = `translateX(-${index * 270}px)`;
});