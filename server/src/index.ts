import 'dotenv/config';
import express from 'express';
import 'tsconfig-paths/register';
// import { connect } from '@/utils';
const app = express();
const port = process.env.PORT || 2345;

const ROUTE_PREFIX = '/api/v1';
// connect();

app.get(ROUTE_PREFIX, (_req: Express.Request, res: Express.Response) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
