const express = require('express')
const bodyParser = require('body-parser')
const mergeRouter = require('./routes/merge');
const splitRouter = require('./routes/split');
const editorRouter = require('./routes/editor');
const watermarkRouter = require('./routes/watermark');
const deleteRouter = require('./routes/delete');
const pageNoRoute = require('./routes/pageno');
const rotateRoute = require('./routes/rotatepdf');
const compressRoute = require('./routes/compress');
const cors = require('cors');

const app = express();
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use(mergeRouter);
app.use(splitRouter);
app.use(editorRouter);
app.use(watermarkRouter);
app.use(deleteRouter);
app.use(pageNoRoute);
app.use(rotateRoute);
app.use(compressRoute);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
