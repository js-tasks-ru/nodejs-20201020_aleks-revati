const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let clients = [];

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve) => {
    clients.push(resolve);
  });

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const { message } = ctx.request.body;
  if (!message) {
    ctx.throw(400, 'Bad request');
  };

  for await (const res of clients) {
    res(message);
  }

  ctx.body = 'ok';
  clients = [];
});

app.use(router.routes());

module.exports = app;
