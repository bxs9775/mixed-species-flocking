import Interaction from "./Interaction.js";

export default class LotkaVolterraInteraction extends Interaction{
    constructor(interactionType, range, chance, targets){
        super(interactionType,range,targets);
        this.chance = chance;
    }
}