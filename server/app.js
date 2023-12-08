/* Runs the simulation on a server, allowing users to view a UI verision of the simulation on the web browser. */

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

// intitializes the express app
const app = express();

// adds in middleware for the assets folder
app.use('/assets', express.static(path.resolve(`./hosted/`)));

// disables the x-powered-by header for security
app.disable('x-powered-by');

// configures the view engine
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.resolve(`./views`));

// configures cookie and body parsing middleware
app.use(cookieParser());
app.use(bodyParser.json());

// configures the router
router(app);

// starts the server and starts it listening on the port
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});