import Interaction from "./Interaction.js";
/**
 * An extension of the Interaction class for representing an interaction that relates to stocastic birth/death processes
 */
export default class LotkaVolterraInteraction extends Interaction{
    /**
    * Creates a new instance of the SteeringInteraction class.
    * @param {string} interactionType - Indicates the type of interaction this instance represents. The Lotka-Volterra interaction types are:
    *   - "birth" - gives the agent a chance to produce offspring if other compatible agents are nearby
    *   - "death" - gives the agent a constant chance of dying each step
    *   - "eat" - gives the agent a chance to eat each prey agent nearby thus killing the prey. When this happens this agent produces offspring
    * @param {int} range - the distance in pixels that the vehicle "sees" other agents for calculating this interaction
    * @param {int} chance - the percent chance the interaction occurs
    * @param {List<string>} targets - lists the names of species that are included in calculating this interaction
    * @constructor
    */
    constructor(interactionType, range, chance, targets){
        super(interactionType,range,targets);
        this.chance = chance;
    }
}