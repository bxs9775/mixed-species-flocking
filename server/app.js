// imports
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import {engine} from 'express-handlebars';
import bodyParser from 'body-parser';

// get the routers for the program
import {router} from './router.js';

// sets the port for the server to use
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

app.use('/assets', express.static(path.resolve(`./hosted/`)));
app.disable('x-powered-by');

//app.registerPartials(`./views/partials`);
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.resolve(`./views`));

app.use(cookieParser());
app.use(bodyParser.json());

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});