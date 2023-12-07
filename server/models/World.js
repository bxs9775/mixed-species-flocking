import {pi,rotate,distance} from "mathjs";

export default class World{
    constructor(bounds,species,init_pops){
        this.bounds = bounds;
        this.species = species;

        this.init_pops = init_pops;
        this.counts = {...init_pops};
        this.run_history = [];

        this.t = 0;
        this.agents = [];
        this.populate();
    }

    populate(){
        Object.entries(this.init_pops).forEach((entry) => {
            let spec = this.species[entry[0]]
            for(let i = 0; i < entry[1]; i++){
                let new_pos = [Math.floor(Math.random()*this.bounds[0]),Math.floor(Math.random()*this.bounds[1])];
                let dir = rotate([1,0],Math.random()*2*pi);
                //let dir = [1,0];
                this.agents.push(spec.createInstance(this,new_pos,dir));
            }
        });

        this.run_history.push({t:this.t,...this.counts});
    }

    getTargets(vehicle,ix){
        return this.agents.filter((agent) => {
            let is_not_self = (agent.id != vehicle.id);
            let is_alignment = (ix.interactionType == "alignment")
            let is_target_type = (ix.targets.includes(agent.species));
            let is_in_range = (distance(vehicle.pos,agent.pos) <= ix.range);
            return (is_not_self || is_alignment) && is_target_type && is_in_range;
        });
    }

    update(){
        this.t++;
        this.agents.forEach((a) => a.calcForces());
        this.agents.forEach((a) => a.update());
        this.run_history.push({t:this.t,...this.counts});
    }


    getState(){
        return {
            t: this.t,
            agents: this.agents.map((a) => {
            return { pos: a.pos, dir: a.dir, color: a.color }})
        }
    }
    
    getHistory(){
        return this.run_history;
    }

    runStep(){
        this.update();
        return this.getState();
    }
}