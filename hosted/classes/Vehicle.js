import Utils from "./Utils.js";

/** Describes the next available Id to be assigned */
let nextId = 1;

/**
 * Data class for automous agents on the client side. 
 * This version only needs the basic constructor, as most of the processing happens server side.
 */
export default class Vehicle{
    /**
     * Creates a new instance of the vehicle class
     * @param {World} world - a reference to the World this vehicle exists in
     * @param {string} species - identifies the species this vehicle is part of
     * @param {List<int>} pos - the position vactor of this vehicle
     * @param {List<int>} dir - the orientaion vector of this vehicle
     * @param {int} max_speed - the maximum magnitude for this vehicle inherited from its species
     * @param {string} color - the color used when drawing this vehicle inherited from its species
     * @param {List<SteeringInteraction>} steeringInteractions - the steering interactions for this vehicle inherited from its species
     * @param {List<LotkaVolterraInteraction>} lotkaVolterraIxs - the Lotka-Volterra interactions for this vehicle inherited from its species
     * @constructor
     */
    constructor(world,species,pos,dir,max_speed,color,steeringInteractions,lotkaVolterraIxs){
        // Set the id of this vehicle and then increment nextId for the next vehicle
        this.id = nextId;
        nextId++;

        // store a reference to the simulation world
        this.world = world;

        // store this vehicle's interactions
        this.steeringInteractions = steeringInteractions;
        this.lotkaVolterraInteractions = lotkaVolterraIxs;

        // store species and color
        this.species = species;
        this.color = color;
        
        // store force and vector physics properties
        this.pos = pos;
        this.velocity = dir;
        this.velocity = multiply(this.velocity,max_speed);
        this.mass = 1;
        this.dir = dir;
        this.max_speed = max_speed;

        // initialize dead and birthing flags to false
        this.dead = false;
        this.birthing = false;
    }

    /**
     * Creates a new vehicle that is a copy of this vehicle, but with updated position and orientation vectors
     * @param {List<int>} pos - the position vactor for the new individual
     * @param {List<int>} dir - the orientaion vector for the new individual
     * @returns {Vehicle} the new vehicle created
     */
    copy(pos,dir){
        return new Vehicle(this.world,this.species,pos,dir,this.max_speed,this.color,this.steeringInteractions,this.lotkaVolterraInteractions);
    }
}