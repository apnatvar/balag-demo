// section 7
async function loadReviews() {
    try {
      const response = await fetch('assets/jsons/reviews.json');
      const allReviews = await response.json();
      console.log('Reviews Loaded from JSONs');
      // Shuffle and pick 5 random reviews (no repeats)
      const selected = allReviews
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      const container = document.getElementById('reviewGrid');

      selected.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.style.backgroundImage = `url('${review.image}')`;

        card.innerHTML = `
          <div class="review-overlay">
            <p>${review.review}</p>
            <div class="reviewer-name">– ${review.name}</div>
          </div>
        `;

        container.appendChild(card);
      });
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  }

  document.addEventListener("load", loadReviews);
// section 7
