import { listProductsSchema, deleteProductSchema } from './schema';

export function productHandler(server, options, next) {
	server.get(
		'/',
		{ schema: listProductsSchema },
		async (req, res) => {
			req.log.info('list products from db');
			const products = await server.db.products.find();
			res.send(products);
		}
	);

	server.get('/:_id', async (req, res) => {
		req.log.info('get one products from db');
		const product = await server.db.products.findOne(req.params._id);
		res.send(product);
	});

	server.post('/', async (req, res) => {
		req.log.info('Add products to db');
		const products = await server.db.products.save(req.body);
		res.status(201).send(products);
	});

	server.put('/:_id', async (req, res) => {
		req.log.info('Update product to db');
		const _id = req.params._id;
		const products = await server.db.products.save({ _id, ...req.body });
		res.status(200).send(products);
	});

	server.delete(
		'/:_id',
		{ schema: deleteProductSchema },
		async (req, res) => {
			req.log.info(`delete product ${req.params._id} from db`);
			const product = await server.db.products.findOne(req.params._id);
			await server.db.products.remove(product);
			res.code(200).send({});
		}
	);

	next();
}

export function studentsHandler(server, options, next) {

	server.get('/:studentId/subjects/:subjectId/tasks/:taskId', async (req, res) => {
		const entity = await server.db.tasks.findOne(req.params.taskId);
		res.send(entity);
	});

	server.get('/:studentId/subjects/:subjectId/tasks/:taskId/download_task', async (req, res) => {
		const entity = await server.db.tasks.findOne(req.params.taskId);
		res.send(entity.student_file);
	});


	server.get('/:studentId/subjects/:subjectId/tasks/:taskId/attempts/:attemptId/download_attempt', async (req, res) => {
		const entity = await server.db.attempts.findOne(req.params.attemptId);
		res.send(entity.student_file);
	});

	server.post('/:studentId/subjects/:subjectId/tasks/:taskId/attempts/:attemptId/upload_attempt', async (req, res) => {
		const attempt = await server.db.attempts.save({...req.body});
		const task = await server.db.tasks.findOne(req.params.taskId);
		task.attempts.push(attempt);
		await server.db.tasks.save(task);
		res.send(attempt._id);
	});

	next();
}

export function lecturerHandler(server, options, next) {
	server.get(
		'/groups',
		{ schema: listProductsSchema },
		async (req, res) => {
			const groups = await server.db.groups.find();
			res.send(groups);
		}
	);

	server.get(
		'//groups/:groupId/students/:studentId/unchecked_tasks',
		{ schema: listProductsSchema },
		async (req, res) => {
			const entity = await server.db.students.findOne(req.params.studentId);
			res.send(entity.unchecked_tasks);
		}
	);

	server.get('/:groupId/students/:studentId/uncheckedTasks/:taskId/get_last_attempt', async (req, res) => {
		const entity = await server.db.tasks.findOne(req.params.taskId);
		res.send(entity.attempts.sort((a,b) => b.created_at - a.created_at)[0]);
	});

	server.get('/:groupId/students/:studentId/uncheckedTasks/:taskId/set_mark', async (req, res) => {
		const task = await server.db.tasks.findOne(req.params.taskId);
		task.mark = req.body.mark;
		await server.db.tasks.save(task);
	});

	server.post('/assign', async (req, res) => {
		req.log.info('Add products to db');
		const entity = await server.db.attempts.save(req.body);
		res.status(201).send(entity);
	});

	next();
}
