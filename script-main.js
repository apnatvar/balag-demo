loadSlides();

document.addEventListener("DOMContentLoaded", function () {
  // Fade out the overlay after 3 seconds
  setTimeout(() => {
    const overlay = document.getElementById("intro-overlay");
    overlay.classList.add("hidden");

    // Optional: mark intro as shown
    localStorage.setItem("introShown", "true");

    // Fully remove it from DOM after transition
    setTimeout(() => {
      overlay.remove();
    }, 500); // match with CSS transition duration
  }, 4000);
});

const menuToggle = document.getElementById('menuToggle');
const menuList = document.getElementById('menuList');

menuToggle.addEventListener('click', () => {
  const isVisible = menuList.style.display === 'block';
  menuList.style.display = isVisible ? 'none' : 'block';
});

let videos = [];
let currentIndex = 0;
let interval;

const carousel = document.getElementById('hero-carousel');

function loadSlides() {
  fetch('assets/jsons/hero-vidoes.json')
    .then(response => response.json())
    .then(data => {
      slides = data;
      renderSlides();
      startCarousel();
    });
}

function renderSlides() {
  slides.forEach((item, index) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('slide');
    if (index === 0) wrapper.classList.add('active');
    wrapper.setAttribute('data-index', index);

    let mediaElement;
    if (item.type === 'video') {
      mediaElement = document.createElement('video');
      mediaElement.src = item.src;
      mediaElement.autoplay = true;
      mediaElement.loop = true;
      mediaElement.muted = true;
      mediaElement.playsInline = true;
    } else if (item.type === 'image') {
      mediaElement = document.createElement('img');
      mediaElement.src = item.src;
      mediaElement.alt = `Image ${index + 1}`;
    }

    wrapper.appendChild(mediaElement);

    // Handle click to redirect
    wrapper.addEventListener('click', (e) => {
      if (!e.target.classList.contains('nav-button')) {
        window.location.href = item.link;
      }
    });

    carousel.appendChild(wrapper);
  });

  document.querySelector('.nav-button.left').addEventListener('click', showPrevSlide);
  document.querySelector('.nav-button.right').addEventListener('click', showNextSlide);
}

function startCarousel() {
  interval = setInterval(() => {
    showNextSlide();
  }, 8000);
}

function showSlide(index) {
  document.querySelectorAll('.slide').forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  currentIndex = index;
}

function showNextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
  resetInterval();
}

function showPrevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
  resetInterval();
}

function resetInterval() {
  clearInterval(interval);
  startCarousel();
}

// const heroSection = document.querySelector('#section1');
// const audio = document.getElementById('heroAudio');
// const muteButton = document.getElementById('muteButton');

// // Mute toggle logic
// let isMuted = false;
// muteButton.addEventListener('click', () => {
//   isMuted = !isMuted;
//   audio.muted = isMuted;
//   muteButton.textContent = isMuted ? '🔇' : '🔊';
// });

// Scroll stop logic
// window.addEventListener('scroll', () => {
//   const scrollY = window.scrollY;
//   const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
//   const scrollPercent = (scrollY / pageHeight) * 100;

//   if (scrollPercent > 50) {
//     audio.pause();
//   } else if (!audio.paused && !isMuted) {
//     // Don't force play if muted or already playing
//     return;
//   } else {
//     audio.play().catch(() => {
//       // Autoplay might be blocked; can be manually triggered via mute button
//     });
//   }
// });

// Section 2 Trailers Logic
let trailerData = [];

const carouselTrack = document.getElementById('carouselTrack');
const filterButtons = document.querySelectorAll('.filter-btn');

// Load JSON data
fetch('assets/jsons/trailers.json')
  .then(response => response.json())
  .then(data => {
    trailerData = data;
    loadTrailers('recents'); // default filter
  })
  .catch(error => {
    console.error('Error loading trailer data:', error);
  });

function loadTrailers(category) {
  carouselTrack.innerHTML = '';

  const filtered = trailerData.filter(trailer =>
    category === 'all' || trailer.categories.includes(category)
  );

  filtered.forEach(trailer => {
    const item = document.createElement('div');
    item.classList.add('carousel-item');

    const link = document.createElement('a');
    link.href = trailer.link;

    const img = document.createElement('img');
    img.src = trailer.image;
    img.alt = trailer.title;

    link.appendChild(img);
    item.appendChild(link);
    carouselTrack.appendChild(item);
  });
}

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    loadTrailers(filter);
  });
});

const nextButton = document.querySelector('.carousel-next');

function smoothScrollBy(element, distance, duration) {
  const start = element.scrollLeft;
  const startTime = performance.now();

  function scroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutQuad(progress); // Easing function

    element.scrollLeft = start + distance * ease;

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  }
  requestAnimationFrame(scroll);
}

function easeInOutQuad(t) {
  return t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t; 
}

nextButton.addEventListener('click', () => {
    smoothScrollBy(carouselTrack, 220, 2000); // 220px over 1000ms
});

// Section 2 trailers logic

// Section 4 carousel

if (document.getElementById("carousel-gallery")) {
  const maxImages = 20; // number of images available
  const totalImagesPerRow = 20;

  for (let i = 1; i <= 4; i++) {
    const row = document.getElementById(`row-${i}`);

    // We'll duplicate images to create seamless scroll effect
    for (let repeat = 0; repeat < 2; repeat++) { // duplicate twice for seamless scroll
      for (let j = 0; j < totalImagesPerRow; j++) {
        const wrapper = document.createElement("div");
        wrapper.className = "img-wrapper";

        const img = document.createElement("img");
        const randNum = Math.floor(Math.random() * maxImages) + 1;
        const width = 80 + Math.floor(Math.random() * 100);

        img.src = `assets/auto-carousel/${randNum}.jpg`;
        img.alt = `Carousel ${i}-${j}`;
        img.style.width = `${width}px`;

        wrapper.appendChild(img);
        row.appendChild(wrapper);
      }
    }
  }
}

// Section 4 carousel 

// Section 3
const mapContainer = document.querySelector('.map-column-inner');
const mapImage = document.getElementById('india-map');

// Map bounds for the India SVG
const bounds = {
  topLat: 37.1,
  bottomLat: 8.9,
  leftLng: 68.3,
  rightLng: 97.4
};

// Convert lat/lon to % coordinates relative to map container
function latLonToPercent(lat, lon) {
  const xPercent = ((lon - bounds.leftLng) / (bounds.rightLng - bounds.leftLng)) * 100;
  const yPercent = ((bounds.topLat - lat) / (bounds.topLat - bounds.bottomLat)) * 100;
  return { xPercent, yPercent };
}

// Ensure map image is fully loaded before placing pins
async function initializePins() {
  try {
    fetch('assets/jsons/locations.json')
      .then(response => response.json())
      .then(locations => {
        locations.forEach(location => {
          const coords = latLonToPercent(location.lat, location.lon);
          console.log("pins firing")
          const pin = document.createElement('div');
          pin.className = 'map-pin';
          pin.style.left = `${coords.xPercent}%`;
          pin.style.top = `${coords.yPercent}%`;
          pin.dataset.location = location.name;
          pin.dataset.link = location.link;

          const label = document.createElement('span');
          label.className = 'pin-label';
          label.textContent = location.name;
          pin.appendChild(label);

          pin.addEventListener('click', () => {
            window.location.href = location.link;
          });

          mapContainer.appendChild(pin);
        });
      })
  } catch (err) {
    console.error('Error fetching location data:', err);
  }
};

document.addEventListener("DOMContentLoaded", initializePins());
// Section 3


// section 6
document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("content-h2");

  const observer = new IntersectionObserver(
    ([entry], observer) => {
      if (entry.isIntersecting) {
        target.classList.add("animate");
        observer.unobserve(target); 
      }
    },
    {
      threshold: 0.3, 
    }
  );
  observer.observe(target);
});
// section 6
