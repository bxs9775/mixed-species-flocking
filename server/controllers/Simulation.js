/** Simulation router for controlling and getting data from a running simulation */
import SteeringInteraction from "../models/SteeringInteraction.js"
import LotkaVolterraInteraction from "../models/LotkaVolterraInteraction.js";
import Species from "../models/Species.js";
import World from "../models/World.js";
import session from "../util/SimSession.js";

/**
 * Handles a POST request telling the simulation to run the next timestep
 * @param {Request} req - the HTML request recieved 
 * @param {Response} res - the HTML response that will be sent back
 * @returns {Object} the simulation state after running the step
 */
export const runNextStep = async (req, res) => {
    let result = await session.world.runStep();
    return res.status(200).json(result);
};
/**
 * Handles a GET request for the current simulation state
 * @param {Request} req - the HTML request recieved 
 * @param {Response} res - the HTML response that will be sent back
 * @returns {Object} the simulation state
 */
export const getState= async (req, res) => {
    let result = session.world.getState();
    return res.status(200).json(result);
}

/**
 * Handles a GET request for the history of the current run
 * @param {Request} req - the HTML request recieved 
 * @param {Response} res - the HTML response that will be sent back
 * @returns {Object} the history data of the current run
 */
export const getHistory = (req,res) => {
    let result = session.world.getHistory();
    return res.status(200).json(result);
}

/**
 * Handles a POST request telling the server to start a new simulation
 * @param {Request} req - the HTML request recieved 
 * @param {Response} res - the HTML response that will be sent back
 * @returns {Object} the initial simulation state
 */
export const startSimulation = async (req, res) => {
    // unpack the request body
    let data = req.body;

    // map the species list from the request into server-size classes
    let species = {};
    data.species.forEach(s => {
        let new_species = new Species(s.name,s.max_speed,s.color);
        new_species.steeringIxs = s.steeringIxs.map((ix) => new SteeringInteraction(ix.interactionType,ix.range,ix.weight, ix.targets));
        new_species.lotkaVolterraIxs = s.lotkaVolterraIxs.map((ix) => new LotkaVolterraInteraction(ix.interactionType,ix.range,ix.chance,ix.targets));
        species[s.name] = new_species;
        
    });

    // create a new World instance
    session.world = new World(data.bounds,species,data.init_pops);

    // get the world's initial state and return it
    let result = session.world.getState();
    res.status(200).json(result);
}