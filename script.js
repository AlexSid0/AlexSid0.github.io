function AgeCounter() {
  var startYear = new Date("2010-06-10");
  var now = new Date();
  var years = now.getTime() - startYear.getTime();
  var age = years / 31557600000;
  var ageElement = document.getElementById("age");
  if (ageElement) {
    ageElement.textContent = "I am " + age.toFixed(9) + " years old";
  }
}
setInterval(AgeCounter, 50);

const markdownUrls = [
  'https://raw.githubusercontent.com/alexsid0/fastengine/main/README.md',
  'https://raw.githubusercontent.com/alexsid0/perlinnoise/main/README.md'
];

async function initCarousel() {
  const carouselWrapper = document.getElementById('carousel-wrapper');

  for (const url of markdownUrls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn('Failed to fetch:', url);
        continue;
      }

      const markdown = await response.text();
      
      const baseRawUrl = url.substring(0, url.lastIndexOf('/') + 1);
      const fixedMarkdown = markdown.replace(/!\[(.*?)\]\((?!http)(.*?)\)/g, (match, alt, imgPath) => {

        let path = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        const absoluteUrl = baseRawUrl + path;
        return `![${alt}](${absoluteUrl})`;
      });

      const html = marked.parse(fixedMarkdown);

      const repoNameMatch = url.match(/githubusercontent\.com\/[^\/]+\/([^\/]+)\//);
      const repoName = repoNameMatch ? repoNameMatch[1] : 'Repository';

      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      slide.innerHTML = `
        <h2>${repoName}</h2>
        <div>${html}</div>
      `;

      carouselWrapper.appendChild(slide);
    } catch (error) {
      console.error('Error loading markdown from', url, error);
    }
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

// Initialize the carousel
initCarousel();
