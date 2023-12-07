import Vehicle from "./Vehicle.js";
import StearingInteraction from "./StearingInteraction.js";
import LotkaVolterraInteraction from "./LotkaVolterraInteraction.js";

export default class Species{
    constructor(name,max_speed,color){
        this.name = name;
        this.stearingIxs = [];
        this.lotkaVolterraIxs = [];
        this.color = color;

        this.max_speed = max_speed;
    }

    addStearingIx(interactionType,range,weight,targets){
        this.stearingIxs.push(new StearingInteraction(interactionType,range,weight,targets));
    }

    addLatkaVolterraIx(interactionType,range,chance,targets){
        this.lotkaVolterraIxs.push(new LotkaVolterraInteraction(interactionType,range,chance,targets))
    }

    createInstance(world,pos,dir){
        return new Vehicle(world,this.name,pos,dir,this.max_speed,this.color,this.stearingIxs,this.lotkaVolterraIxs);
    }
}