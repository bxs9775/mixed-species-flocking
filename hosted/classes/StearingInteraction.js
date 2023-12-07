import Interaction from "./Interaction.js";

export default class StearingInteraction extends Interaction{
    constructor(interactionType, range, weight, targets){
        super(interactionType,range,targets);
        this.weight = weight;
    }
}