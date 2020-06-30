const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

const router = require('./routes/router.js');
app.use(router);

const notifications = requires ('./routes/notifications.js');
app.use(notifications);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;