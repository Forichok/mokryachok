import fastify from 'fastify';

import db from './plugins/db';
import healthHandler from './modules/health/routes';
import { lecturerHandler, productHandler, studentsHandler } from './modules/products/routes';

function createServer() {
	const server = fastify();
	server.register(require('fastify-cors'));

	server.register(require('fastify-oas'), {
		routePrefix: '/docs',
		exposeRoute: true,
		swagger: {
			info: {
				title: 'product api',
				description: 'api documentation',
				version: '0.1.0'
			},
			servers: [
				{ url: 'http://localhost:3000', description: 'development' },
				{
					url: 'https://<production-url>',
					description: 'production'
				}
			],
			schemes: ['http'],
			consumes: ['application/json'],
			produces: ['application/json'],
		}
	});

	server.register(db);
	server.register(healthHandler, { prefix: '/health' });
	server.register(productHandler, { prefix: '/product' });
	server.register(lecturerHandler, { prefix: '/lecturer' });
	server.register(studentsHandler, { prefix: '/lecturer' });
	

	server.setErrorHandler((error, req, res) => {
		req.log.error(error.toString());
		res.send({ error });
	});

	return server;
}

export default createServer;
