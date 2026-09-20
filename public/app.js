const resultsEl = document.getElementById('results');
const typeToggleEl = document.querySelector('.type-toggle');
const categoryFilterEl = document.getElementById('categoryFilter');
const searchInputEl = document.getElementById('searchInput');
const showClaimedEl = document.getElementById('showClaimed');

const postItemBtn = document.getElementById('postItemBtn');
const postModal = document.getElementById('postModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const postForm = document.getElementById('postForm');
const formError = document.getElementById('formError');

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
    card.dataset.id = item.id;

    const actionHtml = item.status === 'claimed'
      ? '<button class="claim-btn" type="button" disabled>Claimed</button>'
      : '<button class="claim-btn" type="button">Mark as claimed</button>';

    card.innerHTML = `
      <div class="card-top">
        <span class="badge ${item.type}">${item.type}</span>
        <span class="category">${capitalize(item.category)}</span>
      </div>
      <h3>${item.title}</h3>
      <p class="meta">Location: ${item.location}</p>
      <p class="meta">Date: ${formatDate(item.date)}</p>
      <p class="meta">Contact: ${item.contactName} — ${item.contactInfo}</p>
      ${actionHtml}
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

resultsEl.addEventListener('click', async (event) => {
  const button = event.target.closest('.claim-btn');
  if (!button || button.disabled) return;

  const card = button.closest('.card');
  await fetch(`/api/items/${card.dataset.id}`, { method: 'PATCH' });
  loadItems();
});

function openModal() {
  formError.classList.add('hidden');
  postForm.reset();
  document.getElementById('formDate').value = new Date().toISOString().slice(0, 10);
  postModal.classList.remove('hidden');
}

function closeModal() {
  postModal.classList.add('hidden');
}

postItemBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelFormBtn.addEventListener('click', closeModal);
postModal.addEventListener('click', (event) => {
  if (event.target === postModal) closeModal();
});

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.classList.add('hidden');

  const newItem = {
    type: document.getElementById('formType').value,
    title: document.getElementById('formTitle').value.trim(),
    description: document.getElementById('formDescription').value.trim(),
    category: document.getElementById('formCategory').value,
    location: document.getElementById('formLocation').value.trim(),
    date: document.getElementById('formDate').value,
    contactName: document.getElementById('formContactName').value.trim(),
    contactInfo: document.getElementById('formContactInfo').value.trim(),
    imageUrl: document.getElementById('formImageUrl').value.trim() || null,
  };

  const response = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });

  if (!response.ok) {
    const body = await response.json();
    formError.textContent = body.error || 'Something went wrong. Please try again.';
    formError.classList.remove('hidden');
    return;
  }

  closeModal();
  loadItems();
});

loadItems();
