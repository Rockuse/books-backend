/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

async function init() {
  const server = Hapi.server({
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: 5000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);
  await server.start();
  console.log(`Server is running at ${server.info.uri}`);
}
init();
