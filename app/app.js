const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./../utils/appError');
const globalErrorHandler = require('./../controllers/errorController'); 


const productRouter = require('./../routes/productsRouter');
const userRouter = require('./../routes/usersRoute');
const reviewRouter = require('./../routes/reivewRouter');
const orderRouter = require('./../routes/ordersRouter');
const categoryRouter = require('./../routes/categoriesRouter');
const brandRouter = require('./../routes/brandsRouter');
const colorRouter = require('./../routes/colorRouter');
const couponRouter = require('./../routes/couponRouter');

const app = express();

// 1) GLOBAL MIDDLEWARES

// remember : helmet hide headers in http 
app.use(helmet());

// use it when you want to connect to front
// const corsOptions={
//   origin: process.env.FRONTEND_URL, 
//   credentials: true, // for for sending cooking betwen browser and server
// };
app.use(cors());



// morgan: logging http request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limiting request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "too many request : you should wait for next request"
});
app.use('/api', limiter);


app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// defend against nosql injection
app.use(mongoSanitize());


// 2) ROUTES
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/colors', colorRouter);
app.use('/api/v1/coupons', couponRouter);


// for not finding routes
app.all('*', (req, res, next) => {
  next(new AppError(`cant find this route ${req.originalUrl} `, 404));
});


app.use(globalErrorHandler);

module.exports = app;


