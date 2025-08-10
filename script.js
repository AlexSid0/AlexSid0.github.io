function AgeCounter() {
    var startYear = new Date("2010-06-10");
    var now = new Date();
    var years = now.getTime() - startYear.getTime();
    var age = years / 31557600000;
    var ageElement = document.getElementById("age");
    if (ageElement) {
        ageElement.textContent = "I am " + age.toFixed(9) + " years";
    }
}
setInterval(AgeCounter, 50);

const username = 'alexsid0';

async function fetchRepos() {
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  if (!response.ok) {
    console.error('Failed to fetch repos:', response.status);
    return [];
  }
  const repos = await response.json();
  return repos;
}

async function fetchReadme(repoName) {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repoName}/readme`
  );

  if (!response.ok) return null;

  const data = await response.json();
  const content = atob(data.content);
  return content;
}

async function initCarousel() {
  const repos = await fetchRepos();
  const carouselWrapper = document.getElementById('carousel-wrapper');

  if (repos.length === 0) {
    carouselWrapper.innerHTML = '<p>No repositories found.</p>';
    return;
  }

  for (const repo of repos) {
    const markdown = await fetchReadme(repo.name);

    if (!markdown) continue;

    const html = marked.parse(markdown);

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.innerHTML = `
      <h2>${repo.name}</h2>
      <div>${html}</div>
    `;

    carouselWrapper.appendChild(slide);
  }

  new Swiper('.swiper-container', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    spaceBetween: 30,
  });
}

initCarousel();