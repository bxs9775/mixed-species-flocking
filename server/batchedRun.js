// imports
import fs from "fs";
import yargs from "yargs";
import { csvParse, csvFormat } from "d3";

import Species from "./models/Species.js";
import StearingInteraction from "./models/StearingInteraction.js";
import World from "./models/World.js";
import LotkaVolterraInteraction from "./models/LotkaVolterraInteraction.js";

const iterations = 100;
// process
const { argv } = yargs(process.argv);
if(!argv.species || !argv.init_pops || !argv.interactions || !argv.outputDir || !argv.runs){
    throw Error("Missing arguements");
}

try{
    let folder = `./output/${argv.outputDir}`;
    
    if(!fs.existsSync(folder)){
        fs.mkdirSync(folder);
    }
    
    let species_raw = fs.readFileSync(argv.species,{encoding: 'utf8', flag: 'r'});
    console.log(species_raw);
    fs.writeFileSync(`${folder}/species.csv`,species_raw);
    let species_obj = csvParse(species_raw);
    //console.log(species_obj);
    let species = {}
    species_obj.forEach((s) => {
        species[s.name] = new Species(s.name,s.max_speed,s.color);
    });
    //console.log(species);
    
    let init_pops_raw = fs.readFileSync(argv.init_pops,{encoding: 'utf8', flag: 'r'});
    fs.writeFileSync(`${folder}/init_pops.csv`,init_pops_raw);
    let init_pops_obj = csvParse(init_pops_raw)[0];
    let init_pops = {};
    Object.entries(init_pops_obj).forEach((entry) => {
        init_pops[entry[0]] = parseInt(entry[1]);
    });
    console.log(init_pops);
    
    let ix_raw = fs.readFileSync(argv.interactions,{encoding: 'utf8', flag: 'r'});
    fs.writeFileSync(`${folder}/interactions.csv`,ix_raw);
    let ix_obj = csvParse(ix_raw);
    //console.log(ix_obj);
    Object.values(species).forEach((s) => {
        let ixs = ix_obj.filter((ix) => ix.species == s.name);
        s.stearingIxs = ixs.filter((ix) => ix.generalType == "steering").map((ix) => {
            let targets = ix.targets.split(",");
            return new StearingInteraction(ix.interactionType,ix.range,ix.value,targets)
        });
        s.lotkaVolterraIxs = ixs.filter((ix) => ix.generalType == "latka").map((ix) => {
            let targets = ix.targets.split(",");
            return new LotkaVolterraInteraction(ix.interactionType,ix.range,ix.value,targets)
        });
        console.log(s.stearingIxs);
        console.log(s.lotkaVolterraIxs);
    });
    console.log(species);

    let results = [];
    console.log("Running simulations");
    for(let i = 0; i < argv.runs;i++){
        console.log(`Run #${i}`);
        let world = new World([700,500],species,init_pops);
        for(let j=0;j < iterations; j++){
            world.runStep();
        }
        let hist = world.getHistory();
        results.push(hist);
    }

    let adverages = []
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
    fs.writeFileSync(`${folder}/run-adv.csv`,csvFormat(adverages));
} catch(e){
    console.error(e);
}

