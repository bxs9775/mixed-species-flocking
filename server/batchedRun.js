/**
 * Runs the simulation as a batched job without the UI.
 * 
 * Usage: node batchedRun.js --species [species.csv] --init_pops [populations.csv] --interactions [interactions.csv] --outputDir [test_name] --runs [# of runs]
 * See sampleInputs for examples
 */
// imports
import fs from "fs";
import yargs from "yargs";
import { csvParse, csvFormat } from "d3";

import Species from "./models/Species.js";
import SteeringInteraction from "./models/SteeringInteraction.js";
import World from "./models/World.js";
import LotkaVolterraInteraction from "./models/LotkaVolterraInteraction.js";

// specifies the number of iterations used for each run
const iterations = 100;

// check the commandline arguements
const { argv } = yargs(process.argv);
if(!argv.species || !argv.init_pops || !argv.interactions || !argv.outputDir || !argv.runs){
    throw Error("Missing arguements");
}

try{
    // define the path for the output folder
    let folder = `./output/${argv.outputDir}`;
    
    // if the output folder doesn't exist, add it
    if(!fs.existsSync(folder)){
        fs.mkdirSync(folder);
    }
    
    // read in the species file
    let species_raw = fs.readFileSync(argv.species,{encoding: 'utf8', flag: 'r'});
    fs.writeFileSync(`${folder}/species.csv`,species_raw);
    let species_obj = csvParse(species_raw);
    let species = {}
    // map the species csv to server-side models
    species_obj.forEach((s) => {
        species[s.name] = new Species(s.name,s.max_speed,s.color);
    });
    
    // read in the initial populations file
    let init_pops_raw = fs.readFileSync(argv.init_pops,{encoding: 'utf8', flag: 'r'});
    fs.writeFileSync(`${folder}/init_pops.csv`,init_pops_raw);
    let init_pops_obj = csvParse(init_pops_raw)[0];
    let init_pops = {};
     // map the initial populations csv to server-side models
    Object.entries(init_pops_obj).forEach((entry) => {
        init_pops[entry[0]] = parseInt(entry[1]);
    });

    // read in the interactions file
    let ix_raw = fs.readFileSync(argv.interactions,{encoding: 'utf8', flag: 'r'});
    fs.writeFileSync(`${folder}/interactions.csv`,ix_raw);
    let ix_obj = csvParse(ix_raw);
     // map the interactions csv to server-side models
    Object.values(species).forEach((s) => {
        let ixs = ix_obj.filter((ix) => ix.species == s.name);
        s.steeringIxs = ixs.filter((ix) => ix.generalType == "steering").map((ix) => {
            let targets = ix.targets.split(",");
            return new SteeringInteraction(ix.interactionType,ix.range,ix.value,targets)
        });
        s.lotkaVolterraIxs = ixs.filter((ix) => ix.generalType == "latka").map((ix) => {
            let targets = ix.targets.split(",");
            return new LotkaVolterraInteraction(ix.interactionType,ix.range,ix.value,targets)
        });
    });

    // create an emptyarray to store the results for each run
    let results = [];
    // Log simulation start for debugging
    console.log("Running simulations");
    // iterate through and run each simulation
    for(let i = 0; i < argv.runs;i++){
        // Log the current run for debugging
        console.log(`Run #${i}`);
        // create a fresh world for each simulation
        let world = new World([700,500],species,init_pops);
        // run each simulation for several iterations (the exact number is specified above)
        for(let j=0;j < iterations; j++){
            world.runStep();
        }
        // add this run's history to the results
        let hist = world.getHistory();
        results.push(hist);
    }

    // calculate the adverage results over all simulation runs
    let adverages = []
    // logs result preparation for debugging
    console.log("Preparing results");
    for(let i=0;i <= iterations; i++){
        let {t,...counts} = results[0][i];
        let adv = {t};
        Object.keys(counts).forEach((s) => {
            let sum = results.reduce((sum,run) => {
                return sum+run.filter((count) => count.t == i)[0][s];
            },0);
            adv[s] = sum/results.length;
        });
        adverages.push(adv);
    }
    // write the adverage results to a new csv file
    fs.writeFileSync(`${folder}/run-adv.csv`,csvFormat(adverages));
} catch(e){
    console.error(e);
}

