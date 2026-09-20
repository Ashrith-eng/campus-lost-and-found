const resultsEl = document.getElementById('results');

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function renderItems(items) {
  resultsEl.innerHTML = '';

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = `card ${item.type}`;

    card.innerHTML = `
      <div class="card-top">
        <span class="badge ${item.type}">${item.type}</span>
        <span class="category">${capitalize(item.category)}</span>
      </div>
      <h3>${item.title}</h3>
      <p class="meta">Location: ${item.location}</p>
      <p class="meta">Date: ${formatDate(item.date)}</p>
      <p class="meta">Contact: ${item.contactName} — ${item.contactInfo}</p>
      <button class="claim-btn" type="button">Mark as claimed</button>
    `;

    resultsEl.appendChild(card);
  });
}

async function loadItems() {
  const response = await fetch('/api/items');
  const items = await response.json();
  renderItems(items);
}

loadItems();
