import * as Simulation from "./controllers/Simulation.js";
import * as UI from "./controllers/UI.js";

export const router = (app) => {
  app.get('/', UI.getSimulationPage);
  app.get('/api/simulation',Simulation.getState);
  app.get('/api/simulation/history',Simulation.getHistory);

  app.post('/api/simulation/new',Simulation.startSimulation);
  app.post('/api/simulation/runStep',Simulation.runNextStep);
};