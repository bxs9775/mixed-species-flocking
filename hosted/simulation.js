import CanvasDisplay from "./classes/CanvasDisplay.js";
import Species from "./classes/Species.js";
import Utils from "./classes/Utils.js";

let display = {};
console.log("Running simulation.js");
//define agent species
let species = {
    "prey1": new Species("prey1",10.0,"blue"),
    "prey2": new Species("prey2",9.0,"green"),
    "predator": new Species("predator",12.0,"red")
}
let init_pops = {
    "prey1": 50,
    "prey2": 50,
    "predator": 20
}


// define interactions
species["prey1"].addStearingIx("flee",120,2,["predator"]);
species["prey1"].addStearingIx("cohesion",60,0.5,["prey1","prey2"]);
species["prey1"].addStearingIx("seperate",10,0.5,["prey1","prey2"]);
species["prey1"].addStearingIx("alignment",25,1,["prey1","prey2"]);
species["prey1"].addLatkaVolterraIx("birth",30,0.07,["prey1","prey2"]);
species["prey1"].addLatkaVolterraIx("death",0,0.05,[]);

species["prey2"].addStearingIx("flee",150,2,["predator"]);
species["prey2"].addStearingIx("cohesion",60,0.5,["prey1","prey2"]);
species["prey2"].addStearingIx("seperate",10,0.5,["prey1","prey2"]);
species["prey2"].addStearingIx("alignment",25,1,["prey1","prey2"]);
species["prey2"].addLatkaVolterraIx("birth",30,0.07,["prey2"]);
species["prey2"].addLatkaVolterraIx("death",0,0.05,[]);


species["predator"].addStearingIx("seek",120,2,["prey1","prey2"]);
species["predator"].addStearingIx("cohesion",60,0.5,["predator"]);
species["predator"].addStearingIx("seperate",10,0.5,["predator"]);
species["predator"].addStearingIx("alignment",25,1,["predator"]);
species["predator"].addLatkaVolterraIx("eat",30,0.2,["prey1","prey2"]);
species["predator"].addLatkaVolterraIx("death",0,0.05,[]);

function draw(data){
    display.clear();
    display.write([10,10],data.t);
    data,data.agents.forEach(a => {
        display.draw(a);
    });
};

async function runSimulation(iterations){
    for(let i = 0; i < iterations; i++){
        let data = (await axios.post("http://localhost:3000/api/simulation/runStep",{})).data;
        draw(data);
        await Utils.sleep(100);
    }
    axios.get("http://localhost:3000/api/simulation/history")
        .then((response) => {
            console.log(response.data);
        })
};

function startSimulation(){
    console.log("running onload");
    let canvas = document.getElementById("simulation_world");
    display = new CanvasDisplay(canvas);

    let bounds = [canvas.width,canvas.height];

    axios.post("http://localhost:3000/api/simulation/new",{
        bounds,
        species: Object.values(species),
        init_pops
    }).then((res) => {
        let data = res.data;
        draw(data);
        runSimulation(100);
    });
};

window.addEventListener("load",startSimulation);