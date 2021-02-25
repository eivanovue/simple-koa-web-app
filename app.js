const Koa = require('koa');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-body');
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs');
const CrudOperations = require('./dynamodb/crudOperations');

const app = new Koa();
const router = new KoaRouter();

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
  const result = await CrudOperations.getPeople().then((people) => people);
  await ctx.render('all', {
    people: result,
  });
});

router.get('/search', async (ctx) => {
  await ctx.render('search');
});

router.get('/add', async (ctx) => {
  await ctx.render('add', {
    title: 'Add person',
  });
});

router.get('/people/search', async (ctx) => {
  const query = Object.keys(ctx.request.query).toString();
  const value = Object.values(ctx.request.query).toString();
  const result = await CrudOperations.getPersonByAtttribute(query, value);
  ctx.body = result;
});

router.get('/people/all', async (ctx) => {
  const result = await CrudOperations.getPeople().then((people) => people);
  ctx.body = result;
});

router.get('/person', async (ctx) => {
  const personId = Number(ctx.request.query.id);
  const result = await CrudOperations.getPersonById(personId);
  ctx.body = result;
});

router.get('/person/:id', async (ctx) => {
  const personId = Number(ctx.params.id);
  const result = await CrudOperations.getPersonById(personId);
  ctx.body = result;
});

router.post('/create', async (ctx) => {
  const item = ctx.request.body;
  const result = await CrudOperations.addPerson(item);
  ctx.body = result;
  ctx.redirect('/all');
});

router.put('/update/:id', async (ctx) => {
  const item = ctx.request.body;
  const id = Number(ctx.params.id);
  const result = await CrudOperations.updatePerson(id, item);
  ctx.body = result;
});

router.delete('/delete/:id', async (ctx) => {
  const id = Number(ctx.params.id);
  const result = await CrudOperations.deletePerson(id);
  ctx.body = result;
});

app.use(bodyParser());

app.use(router.routes())
  .use(router.allowedMethods());

// eslint-disable-next-line no-console
app.listen(80, () => console.log('Running on port 80'));
