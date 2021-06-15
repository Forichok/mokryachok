import 'reflect-metadata';
import fp from 'fastify-plugin';
import {
	ConnectionOptions,
	createConnection,
	getConnectionOptions,
} from 'typeorm';
import { Product } from '../modules/products/entity';

import * as path from 'path';

const root: string = path.resolve(__dirname, '..');

export default fp(async (server) => {
	try {
		const connectionOptions = await getConnectionOptions();
		Object.assign(connectionOptions, {
			options: { encrypt: true },
			entities: [Product],
		});

		const options: ConnectionOptions = {
			type: 'sqlite',
			database: `${root}/data/db.sqlite`,
			entities: [Product],
			logging: true,
		};

		const connection = await createConnection(options)
		console.log('database connected');

		server.decorate('db', {
			products: connection.getRepository(Product),
		});
	} catch (error) {
		console.log(error);
		console.log('make sure you have set .env variables - see .env.sample');
	}
});
