const resultsEl = document.getElementById('results');
const typeToggleEl = document.querySelector('.type-toggle');
const categoryFilterEl = document.getElementById('categoryFilter');
const searchInputEl = document.getElementById('searchInput');
const showClaimedEl = document.getElementById('showClaimed');

const filters = {
  type: '',
  category: '',
  q: '',
};

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

  if (items.length === 0) {
    resultsEl.innerHTML = '<p class="empty-state">No items match your filters.</p>';
    return;
  }

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
  const params = new URLSearchParams();

  if (filters.type) params.set('type', filters.type);
  if (filters.category) params.set('category', filters.category);
  if (filters.q) params.set('q', filters.q);
  if (!showClaimedEl.checked) params.set('status', 'open');

  const response = await fetch(`/api/items?${params.toString()}`);
  const items = await response.json();
  renderItems(items);
}

typeToggleEl.addEventListener('click', (event) => {
  const button = event.target.closest('.toggle-btn');
  if (!button) return;

  typeToggleEl.querySelectorAll('.toggle-btn').forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');

  filters.type = button.dataset.type;
  loadItems();
});

categoryFilterEl.addEventListener('change', () => {
  filters.category = categoryFilterEl.value;
  loadItems();
});

let searchDebounce;
searchInputEl.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    filters.q = searchInputEl.value.trim();
    loadItems();
  }, 300);
});

showClaimedEl.addEventListener('change', loadItems);

loadItems();
