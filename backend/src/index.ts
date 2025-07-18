import express from 'express';

const app = express();

app.get('/', (req, res, next) => res.send('TEST'))

const PORT = 8000;

const start  = async () => {
	app.listen(
		PORT,
		() => {
			console.log(`start http://localhost:${PORT}`);
		}
	)
}


start();
