const crypto = require('crypto');
const express = require('express');
const { readItems, writeItems } = require('./data/store');

const app = express();
const PORT = process.env.PORT || 3000;

const VALID_TYPES = ['lost', 'found'];
const VALID_CATEGORIES = ['electronics', 'documents', 'keys', 'clothing', 'books', 'other'];
const REQUIRED_FIELDS = ['type', 'title', 'description', 'category', 'location', 'date', 'contactName', 'contactInfo'];

app.use(express.json({ limit: '8mb' }));
app.use(express.static('public'));

app.get('/api/items', (req, res) => {
  let items = readItems();
  const { type, category, status, q } = req.query;

  if (type) items = items.filter((item) => item.type === type);
  if (category) items = items.filter((item) => item.category === category);
  if (status) items = items.filter((item) => item.status === status);
  if (q) {
    const query = q.toLowerCase();
    items = items.filter((item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    );
  }

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const body = req.body;

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || typeof body[field] !== 'string' || !body[field].trim()) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }
  if (!VALID_TYPES.includes(body.type)) {
    return res.status(400).json({ error: `type must be one of: ${VALID_TYPES.join(', ')}` });
  }
  if (!VALID_CATEGORIES.includes(body.category)) {
    return res.status(400).json({ error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
  }
  if (body.imageUrl && !body.imageUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'imageUrl must be a data:image/... URI' });
  }

  const newItem = {
    id: crypto.randomUUID(),
    type: body.type,
    title: body.title,
    description: body.description,
    category: body.category,
    location: body.location,
    date: body.date,
    contactName: body.contactName,
    contactInfo: body.contactInfo,
    imageUrl: body.imageUrl || null,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  const items = readItems();
  items.push(newItem);
  writeItems(items);

  res.status(201).json(newItem);
});

app.patch('/api/items/:id', (req, res) => {
  const items = readItems();
  const item = items.find((item) => item.id === req.params.id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  item.status = 'claimed';
  writeItems(items);

  res.json(item);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
