import StearingInteraction from "../models/StearingInteraction.js"
import LotkaVolterraInteraction from "../models/LotkaVolterraInteraction.js";
import Species from "../models/Species.js";
import World from "../models/World.js";
import session from "../util/SimSession.js";

export const runNextStep = async (req, res) => {
    let result = await session.world.runStep();
    return res.status(200).json(result);
};

export const getState= async (req, res) => {
    let result = session.world.getState();
    return res.status(200).json(result);
}

export const getHistory = (req,res) => {
    let result = session.world.getHistory();
    return res.status(200).json(result);
}

export const startSimulation = async (req, res) => {
    let data = req.body;

    let species = {};
    data.species.forEach(s => {
        let new_species = new Species(s.name,s.max_speed,s.color);
        new_species.stearingIxs = s.stearingIxs.map((ix) => new StearingInteraction(ix.interactionType,ix.range,ix.weight, ix.targets));
        new_species.lotkaVolterraIxs = s.lotkaVolterraIxs.map((ix) => new LotkaVolterraInteraction(ix.interactionType,ix.range,ix.chance,ix.targets));
        species[s.name] = new_species;
        
    });
    session.world = new World(data.bounds,species,data.init_pops);

    let result = session.world.getState();

    res.status(200).json(result);
}