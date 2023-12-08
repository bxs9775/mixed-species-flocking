/**
 * Base data class representing an interaction between agents in the simlation
 */
export default class Interaction{
    /**
     * Creates a new instance of the Interaction class. It is recomened you use the constructor for 
     * @param {string} interactionType - Indicates the type of interaction this instance represents (see child classes for details)
     * @param {int} range - the distance in pixels that the vehicle "sees" other agents for calculating this interaction
     * @param {List<string>} targets - lists the names of species that are included in calculating this interaction
     * @constructor
     */
    constructor(interactionType, range, targets){
        this.interactionType = interactionType;
        this.range = range;
        this.targets = targets;
    }
}