import 'reflect-metadata';
import fp from 'fastify-plugin';
import {
	ConnectionOptions,
	createConnection,
	getConnectionOptions,
} from 'typeorm';
import { Group, Product, Student, Task, TaskAttempt } from '../modules/products/entity';

import * as path from 'path';

const root: string = path.resolve(__dirname, '..');

export default fp(async (server) => {
	try {
		const connectionOptions = await getConnectionOptions();
		Object.assign(connectionOptions, {
			options: { encrypt: false },
			entities: [Product, Group, Student, Task, TaskAttempt],
		});

		const options: ConnectionOptions = {
			type: 'sqlite',
			database: `${root}/data/db.sqlite`,
			entities: [Product, Group, Student, Task, TaskAttempt],
			logging: true,
		};

		const connection = await createConnection(options);
		console.log('database connected');

		server.decorate('db', {
			products: connection.getRepository(Product),
			attempts: connection.getRepository(TaskAttempt),
			tasks: connection.getRepository(Task),
			students: connection.getRepository(Student),
			groups: connection.getRepository(Group),
		});
	} catch (error) {
		console.log(error);
		console.log('make sure you have set .env variables - see .env.sample');
	}
});
