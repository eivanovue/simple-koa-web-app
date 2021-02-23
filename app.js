const Koa = require('koa');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-body');
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs');
const fs = require('fs');

const app = new Koa();
const router = new KoaRouter();
const data = require('./data.json');

// JSON Prettier Middleware
app.use(json());

render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false,
});

router.get('/', async (ctx) => {
  await ctx.render('main');
});

router.get('/features', async (ctx) => {
  await ctx.render('features');
});

router.get('/all', async (ctx) => {
  await ctx.render('all', {
    people: data,
  });
});

router.get('/search', async (ctx) => {
  await ctx.render('search');
});

router.get('/add', async (ctx) => {
  await ctx.render('add', {
    title: 'Add person',
    people: data,
  });
});

router.get('/people/search', (ctx) => {
  const query = Object.keys(ctx.request.query).toString();
  const value = Object.values(ctx.request.query).toString();
  // eslint-disable-next-line max-len
  const result = data.filter((person) => (person[query].toString().toLowerCase() === value.toLowerCase()));
  ctx.body = result;
});

router.get('/people/all', (ctx) => {
  ctx.body = data;
});

router.get('/person', (ctx) => {
  const result = data.find((person) => Number(person.id) === Number(ctx.request.query.id));
  ctx.body = result;
});

router.get('/person/:id', (ctx) => {
  const result = data.find((person) => Number(person.id) === Number(ctx.params.id));
  ctx.body = result;
});

router.post('/create', (ctx) => {
  const newId = data[data.length - 1].id + 1;

  data.push({
    id: newId,
    first_name: ctx.request.body.first_name,
    last_name: ctx.request.body.last_name,
    email: ctx.request.body.email,
    gender: ctx.request.body.gender,
  });

  // write to JSON file
  // eslint-disable-next-line no-console
  fs.writeFile('./data.json', JSON.stringify(data), 'utf8', () => { console.log('Writing to JSON file...'); });
  ctx.body = 'Person successfully added!';
});

app.use(bodyParser());

app.use(router.routes())
  .use(router.allowedMethods());

// eslint-disable-next-line no-console
app.listen(80, () => console.log('Running on port 80'));
