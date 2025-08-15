import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import accountBookRoutes from './routes/accountBook.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/account-book', accountBookRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
