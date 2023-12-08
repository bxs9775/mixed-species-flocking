import * as Simulation from "./controllers/Simulation.js";
import * as UI from "./controllers/UI.js";

/**
 * Application router for the server-version of the simulation
 * @param {Express} app - the app that will use this router
 */
export const router = (app) => {
  // GET routes
  app.get('/', UI.getSimulationPage);
  app.get('/api/simulation',Simulation.getState);
  app.get('/api/simulation/history',Simulation.getHistory);

  // POST routes
  app.post('/api/simulation/new',Simulation.startSimulation);
  app.post('/api/simulation/runStep',Simulation.runNextStep);
};