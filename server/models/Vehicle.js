import {add, subtract, multiply, mod, norm, random, pickRandom, rotate, pi } from "mathjs";
import Utils from "../util/Utils.js";

/** Describes the next available Id to be assigned */
let nextId = 1;

/**
 * Base class for automous agents
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

    /**
     * Iterates through all the vehicle's steering interactions to generate its steering force
     * @returns {List<int>} the gesalt steering force for this vehicle
     */
    calcSteeringForce(){
        // create a steeringForce vector to store the combined force of all the steering forces
        let steeringForce = [0,0];
        // initialize vectors to be reused thoughout the calculations
        let next_pos=[0,0],desired=[0,0];

        // process each interaction in this vehicle's steeringInteractions list
        this.steeringInteractions.forEach((interaction) => {
            // initialize a 0 force vector for this force
            let force = [0,0];
            // get the targets for this interaction
            let targets = this.world.getTargets(this,interaction);
            // if there are no elgible targets skip the rest of the processing for this interaction
            if(targets.length == 0){
                return;
            }

            switch(interaction.interactionType){
                // prey seeking behavior
                case "seek":
                    targets.forEach((t) => {
                        // create a desired velocity vector by taking the difference of this vehicle's position and its target
                        desired = subtract(t.pos,this.pos);
                        // scale the vector up/down to the maximum speed
                        desired = Utils.setMag(desired,this.max_speed);
                        // calculate the desired steering force by subtracting this vehicles velocity from the desired velocity
                        // producing an acceleration
                        desired = subtract(desired,this.velocity)

                        // add the desired force to the aggregated seeking force
                        force = add(force,desired);
                    });
                    break;
                // predator fleeing behavior
                case "flee":
                    // calculate a flee force for each target individually
                    targets.forEach((t) => {
                        // create a desired velocity vector by taking the difference of this vehicle's position and its target
                        desired = subtract(t.pos,this.pos);
                        // scale the vector up/down to the maximum speed
                        desired = Utils.setMag(desired,this.max_speed);

                        // calculate the desired steering force by subtracting this vehicles velocity from the desired velocity
                        // producing an acceleration
                        // then multiply the force by -1 to reverse its direction
                        desired = subtract(desired,this.velocity)
                        desired = multiply(desired,-1);
                        
                        // add the desired force to the aggregated flee force
                        force = add(force,desired);
                    });
                    break;
                // cohesion to local flock
                case "cohesion":
                   // calculate the adverage position of local flocking agents
                   next_pos = targets.reduce((pos_sum,t) => {
                    return add(pos_sum,t.pos)
                },[0,0]);
                next_pos = multiply(next_pos,1/targets.length);
                
                // create a desired velocity vector by taking the difference of this vehicle's position
                // and the adverage position
                desired = subtract(next_pos,this.pos);
                
                // limit the vector by the maximum speed
                desired = Utils.limit(desired,this.max_speed);
                
                // calculate the desired steering force by subtracting this vehicles velocity from the desired velocity
                // producing an acceleration
                force = subtract(desired,this.velocity);
                break;
                // short range avoidence
                case "seperate":
                    // calculate the adverage position of local flocking agents
                    next_pos = targets.reduce((pos_sum,t) => {
                        return add(pos_sum,t.pos)
                    },[0,0]);
                    next_pos = multiply(next_pos,1/targets.length);

                    // create a desired velocity vector by taking the difference of this vehicle's position
                    // and the adverage position
                    desired = subtract(next_pos,this.pos);

                    // limit the vector to the maximum speed
                    desired = Utils.limit(desired,this.max_speed);

                    // then multiply the velocity by -1 to reverse its direction
                    desired = multiply(desired,-1);
                    
                    // calculate the desired steering force by subtracting this vehicles velocity from the desired velocity
                    // producing an acceleration
                    force = subtract(desired,this.velocity);
                    break;
                // aligning to adverage orientation
                case "alignment":
                    // calculate the adverage orientation of local flockers
                    let sum_dir = targets.reduce((sum,t) => {
                        return add(sum,t.dir);
                    },[0,0]);

                    // get the magnitude using 2-norm of the adverage orientation
                    let sum_mag = norm(sum_dir); 
                    // ensure the vector is not 0 to avoid a divide by 0 error
                    if(sum_mag > 0){
                        // scale the adverage orientation to the maximum speed
                        let factor = this.max_speed/sum_mag;
                        let desired = multiply(sum_dir,factor);

                        // calculate the desired steering force by subtracting this vehicles velocity from the desired velocity
                        // producing an acceleration
                        force = subtract(desired,this.velocity);
                    }
                    break;
            }
            // scale the steering force by its weight, then add it to the aggregate steering force
            force = multiply(interaction.weight,force);
            steeringForce = add(steeringForce,force);
        });
        // return the aggregate steering force
        return steeringForce;
    }

    /**
     * Iterates though the vehicle's Lotka-Volterra inteactions to update its dead and birthing flags
     */
    calcLotkaVolterra(){
        // process each interaction in this vehicle's lotkaVolterraInteractions list
        this.lotkaVolterraInteractions.forEach((interaction) => {
            // get the targets for this interaction
            let targets = this.world.getTargets(this,interaction);

            // if there are no elgible targets skip the rest of the processing for this interaction
            // death interactions don't depend on having other vehicles in range so we skip this for them
            if(interaction.interactionType != "death" && targets.length == 0){
                return;
            }

            switch(interaction.interactionType){
                // predators eating prey behavior
                case "eat":
                    // calculate the outcome of the eat interaction for each target individually
                    targets.forEach((t) => {
                        // generate a random number from 0-1 and see if it is less than or equal to the eating chance
                        if(random() <= interaction.chance && !t.dead){
                            // if so mark the prey as dead, and this vehicle as birthing
                            t.dead = true;
                            this.birthing = true;
                        }
                    });
                    break;
                // birthing behavior
                case "birth":
                    // generate a random number from 0-1 and see if it is less than or equal to the birth chance
                    if(random() <= interaction.chance){
                        // if so set this vehicle as birthing
                        this.birthing = true;
                    }
                    break;
                // dying behavior
                case "death":
                    // generate a random number from 0-1 and see if it is less than or equal to the death chance
                    if(random() <= interaction.chance){
                        // if so mark this vehicle as dead
                        this.dead = true;
                    }
                    break;
            }
        });
    }

    /**
     * calculates the steering and Lotka-Volterra interactions
     */
    calcForces(){
        // check Lotka-Volterra
        this.calcLotkaVolterra();

        // calculate the steering force
        this.steeringForce = this.calcSteeringForce();
    }

    /**
     * Updates the vehicle after all the interactions have been calculated
     */
    update(){
        // check if the dead flag is true
        if(this.dead){
            // if so remove this vehicle from the world
            let ind =  this.world.agents.indexOf(this);
            if(ind > -1){
                this.world.agents.splice(ind,1);
            }
            // decrease the count for this vehicle's species by 1
            this.world.counts[this.species]--;
        }
        // check if the birthing flag is true
        // dead and birthing could be flagged on the same time step, in which case the vehicle manages to produce offspring right before it parishes
        if(this.birthing){
            // generate a new random position near the birthing vehicle
            let pos = [this.pos[0] + pickRandom([-1,1])*random(10,25),this.pos[1] + pickRandom([-1,1])*random(10,25)];
            // generate a new random direction
            let dir = rotate([1,0],random()*2*pi);

            // create offspring by copying the parent vehicle with the newly generated position and orientation
            this.world.agents.push(this.copy(pos,dir));
            
            // set birthing back to false so the vehicle doesn't keep producing offspring
            this.birthing = false;

            // increase the count for this vehicle's species by 1
            this.world.counts[this.species]++;
        }
        if(this.steeringForce == null){
            return;
        }
        // Calculate the acceleration. F=ma -> a=F/a
        let mass_factor = 1/this.mass
        let acceleration = multiply(this.steeringForce,mass_factor);
        
        // Calculate the velocity
        this.velocity = add(this.velocity,acceleration);
        // limit velocity to the maximum speed if it is over
        this.velocity = Utils.limit(this.velocity,this.max_speed);
        
        // update the position
        this.pos = add(this.pos,this.velocity);
        
        // apply periodic boundry conditions
        this.pos[0] = mod(this.pos[0],this.world.bounds[0]);
        this.pos[1] = mod(this.pos[1],this.world.bounds[1]);

        // update the vehicles orientation based on its velocity, unless its velocity is 0
        let v_mag = norm(this.velocity)
        if(v_mag > 0){
            this.dir = Utils.setMag(this.velocity,1);
        }
    }
}