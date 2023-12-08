import Vehicle from "./Vehicle.js";
import SteeringInteraction from "./SteeringInteraction.js";
import LotkaVolterraInteraction from "./LotkaVolterraInteraction.js";

/**
 * Class representing a species in the simulation. A single species is defined with a maximum speed,
 * a color used to represent indeividuals of that species in the simulation, and lists of steering and Lotka-Volterra interactions
 */
export default class Species{
    /**
     * Creates a new instance of the Species class
     * @param {string} name - The identifier of this species used by other classes to reference it
     * @param {int} max_speed - the maximum magnitude for the velocity vectors of individuals of this species
     * @param {string} color - the color used to represent individuals of this species
     * @constructor
     */
    constructor(name,max_speed,color){
        this.name = name;
        this.steeringIxs = [];
        this.lotkaVolterraIxs = [];
        this.color = color;

        this.max_speed = max_speed;
    }

    /**
    * Adds a steering interaction to this species
    * @param {string} interactionType - Indicates the type of interaction this instance represents. The steering interaction types are:
    *   - "seek" - calculates a steering force towards a target agent
    *   - "flee" - calculates a steering force away from a target agent
    *   - "cohesion" - calculates a steering force towards the adverage position of a group of agents
    *   - "align" - calculates a steering force to align this vehicle with the adverage orientation of a group of agents
    * @param {int} range - the distance in pixels that the vehicle "sees" other agents for calculating this interaction
    * @param {int} weight - a scaler weight applied to the calculated steering force to determine how strong an effect it has on the vehicle
    * @param {List<string>} targets - lists the names of species that are included in calculating this interaction
    */
    addSteeringIx(interactionType,range,weight,targets){
        this.steeringIxs.push(new SteeringInteraction(interactionType,range,weight,targets));
    }

    /**
    * Adds a Lotka-Volterra interaction to this species
    * @param {string} interactionType - Indicates the type of interaction this instance represents. The Lotka-Volterra interaction types are:
    *   - "birth" - gives the agent a chance to produce offspring if other compatible agents are nearby
    *   - "death" - gives the agent a constant chance of dying each step
    *   - "eat" - gives the agent a chance to eat each prey agent nearby thus killing the prey. When this happens this agent produces offspring
    * @param {int} range - the distance in pixels that the vehicle "sees" other agents for calculating this interaction
    * @param {int} chance - the percent chance the interaction occurs
    * @param {List<string>} targets - lists the names of species that are included in calculating this interaction
    */
    addLatkaVolterraIx(interactionType,range,chance,targets){
        this.lotkaVolterraIxs.push(new LotkaVolterraInteraction(interactionType,range,chance,targets))
    }

    /**
     * Factory method for creating a new individual of this species.
     * @param {World} world - a reference to the World this individual exists in
     * @param {List<int>} pos - the position vactor for the new individual
     * @param {List<int>} dir - the orientaion vector for the new individual
     * @returns {Vehicle} the newly created individual
     */
    createInstance(world,pos,dir){
        return new Vehicle(world,this.name,pos,dir,this.max_speed,this.color,this.steeringIxs,this.lotkaVolterraIxs);
    }
}