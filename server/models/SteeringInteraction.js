import Interaction from "./Interaction.js";

/**
 * An extension of the Interaction class for representing an interaction for a given vehicle
 * that influences the steering forces applied to that vehicle.
 */
export default class SteeringInteraction extends Interaction{
    /**
     * Creates a new instance of the SteeringInteraction class.
     * @param {string} interactionType - Indicates the type of interaction this instance represents. The steering interaction types are:
     *   - "seek" - calculates a steering force towards a target agent
     *   - "flee" - calculates a steering force away from a target agent
     *   - "cohesion" - calculates a steering force towards the adverage position of a group of agents
     *   - "align" - calculates a steering force to align this vehicle with the adverage orientation of a group of agents
     * @param {int} range - the distance in pixels that the vehicle "sees" other agents for calculating this interaction
     * @param {int} weight - a scaler weight applied to the calculated steering force to determine how strong an effect it has on the vehicle
     * @param {List<string>} targets - lists the names of species that are included in calculating this interaction
     * @constructor
     */
     constructor(interactionType, range, weight, targets){
         super(interactionType,range,targets);
         this.weight = weight;
     }
 }