const slidesContainer = document.getElementById('slides');
const indicators = document.getElementById('indicators');
const slider = document.getElementById('slider');
const maxSlides = 10;
const folders = ['post', 'news', 'story'];

let index = 0;
let posts = [];
let interval = null;

async function loadPosts() {
  let slideCount = 0;

  for (const folder of folders) {
    for (let i = 1; i <= maxSlides; i++) {
      try {
        const res = await fetch(`${folder}/post${i}.html`);
        if (!res.ok) break;
        const html = await res.text();

        const wrapper = document.createElement('div');
        wrapper.className = 'slide';
        wrapper.style.marginTop = '-10px';

        const htmlDiv = document.createElement('div');
        htmlDiv.innerHTML = html;

        const imageDiv = document.createElement('div');
        imageDiv.className = 'post-image';
        const img = htmlDiv.querySelector('img');
        if (img) imageDiv.appendChild(img);

        const textDiv = document.createElement('div');
        textDiv.className = 'post-text';

        const tags = htmlDiv.querySelectorAll('h1, h2, h3, p, span');
        tags.forEach(el => {
          const clone = el.cloneNode(false);
          const text = el.textContent.trim();
          if (text.length > 0) {
            clone.setAttribute('data-original', text);
            clone.textContent = '';
            textDiv.appendChild(clone);
          }
        });

        wrapper.appendChild(imageDiv);
        wrapper.appendChild(textDiv);

        const postlogFile = `${slideCount + 1}`;
        wrapper.addEventListener('click', () => {
          window.location.href = `main.html?post=${postlogFile}`;
        });

        slidesContainer.appendChild(wrapper);

        const dot = document.createElement('div');
        dot.className = 'dot';
        if (posts.length === 0) dot.classList.add('active');
        indicators.appendChild(dot);

        posts.push(wrapper);
        slideCount++;
      } catch (e) {
        break;
      }
    }
  }

  showSlide(0);
  resetInterval(); // ✅ 처음부터 안전하게 시작
}

// 타자기 효과
function typeText(element, text, speed = 30) {
  if (!text) return;
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

// 슬라이드 전환
function showSlide(i) {
  index = (i + posts.length) % posts.length;
  posts.forEach((slide, idx) => {
    slide.classList.remove('active', 'prev', 'next');

    if (idx === index) {
      slide.classList.add('active');

      const textBlock = slide.querySelector('.post-text');
      const elements = textBlock.querySelectorAll('[data-original]');

      elements.forEach((el, order) => {
        const content = el.getAttribute('data-original');
        el.textContent = '';
        setTimeout(() => {
          typeText(el, content);
        }, order * 200);
      });

    } else if (idx === (index - 1 + posts.length) % posts.length) {
      slide.classList.add('prev');
    } else if (idx === (index + 1) % posts.length) {
      slide.classList.add('next');
    }
  });

  indicators.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === index);
  });
}

// 🛠 interval 중복 방지
function resetInterval() {
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
  interval = setInterval(() => showSlide(index + 1), 12000);
}

// 버튼 이벤트
document.getElementById('prev').onclick = () => {
  showSlide(index - 1);
  resetInterval();
};
document.getElementById('next').onclick = () => {
  showSlide(index + 1);
  resetInterval();
};

// 터치 슬라이드
let startX = 0;
slider.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});
slider.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) > 50) {
    if (diff < 0) showSlide(index + 1);
    else showSlide(index - 1);
    resetInterval();
  }
});

// 초기 실행
loadPosts();
