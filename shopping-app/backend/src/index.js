const Fastify = require('fastify');
const cors = require('@fastify/cors');
const swagger = require('@fastify/swagger');
require('dotenv').config();

const fastify = Fastify({ logger: true });

// ✅ CORS-Konfiguration
fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
});

// ✅ Swagger (optional)
fastify.register(swagger, {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Shopping API',
      description: 'API für Shopping Items',
      version: '1.0.0',
    }
  },
  exposeRoute: true
});

// ✅ In-Memory-Datenbank
let items = [];
let nextId = 1;

fastify.get('/items', async () => items);

fastify.post('/items', async (request, reply) => {
  const { name, quantity } = request.body;
  if (!name || typeof quantity !== 'number') {
    return reply.code(400).send({ error: 'Invalid input' });
  }
  const existing = items.find(i => i.name === name);
  if (existing) {
    existing.quantity += quantity;
    return reply.code(200).send(existing);
  }
  const newItem = { id: nextId++, name, quantity };
  items.push(newItem);
  return reply.code(201).send(newItem);
});

fastify.get('/items/:itemId', async (request, reply) => {
  const id = Number(request.params.itemId);
  const item = items.find(i => i.id === id);
  return item ? item : reply.code(404).send({ error: 'Item not found' });
});

fastify.put('/items/:itemId', async (request, reply) => {
  const id = Number(request.params.itemId);
  const { name, quantity } = request.body;
  const item = items.find(i => i.id === id);
  if (!item) return reply.code(404).send({ error: 'Item not found' });
  item.name = name;
  item.quantity = quantity;
  return item;
});

fastify.delete('/items/:itemId', async (request, reply) => {
  const id = Number(request.params.itemId);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return reply.code(404).send({ error: 'Item not found' });
  items.splice(index, 1);
  return reply.code(204).send();
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
