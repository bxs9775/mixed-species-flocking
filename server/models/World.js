import {pi,rotate,distance} from "mathjs";

/**
 * Class representing the world of the simulation
 */
export default class World{
    /**
     * Creates a new instance of the World class
     * @param {List<int>} bounds - the bounds of the simulation world expressed as a vector [width,height]
     * @param {List<Species>} species - a list of the species involved in the simulation
     * @param {Map<string,int>} init_pops - a dictionary of the initial populations for each species
     * @constructor
     */
    constructor(bounds,species,init_pops){
        // initialize the bounds of the simulation
        this.bounds = bounds;

        // initialize the list of species
        this.species = species;

        // initialize the initial populations and current count
        this.init_pops = init_pops;
        this.counts = {...init_pops};
        
        // initialize the history object for this run
        this.run_history = [];

        // set the current time step (t) to t=0
        this.t = 0;

        // create a list to track agents in the simulation, then call the populate method to fill it
        this.agents = [];
        this.populate();
    }

    /**
     * Populates the simulation world with agents based on the initial populations configured in the constructor.
     */
    populate(){
        // Go through each entry of the initial populations map
        Object.entries(this.init_pops).forEach((entry) => {
            // find the associated species in the species list
            let spec = this.species[entry[0]]

            // produce n agents of the species where n is the specified initial population
            for(let i = 0; i < entry[1]; i++){
                // generate random position and orientation vectors
                let new_pos = [Math.floor(Math.random()*this.bounds[0]),Math.floor(Math.random()*this.bounds[1])];
                let dir = rotate([1,0],Math.random()*2*pi);

                // generate a new instance using the specie's createInstance factory and add it to the agents list
                this.agents.push(spec.createInstance(this,new_pos,dir));
            }
        });
        // add the initial populations to the run history
        this.run_history.push({t:this.t,...this.counts});
    }

    /**
     * Finds the targets for a given interaction as calculated from a specified vehicle
     * @param {Vehicle} vehicle - the vehicle whose interaction we're calculating
     * @param {Interaction} ix - the interaction we are getting targets for
     * @returns {List<Vehicle>} a list of target agents for this interaction
     */
    getTargets(vehicle,ix){
        // filters all agents to the ones that are targets of this interaction       
        return this.agents.filter((agent) => {
            // checks if this agent is not the specified vehicle
            let is_not_self = (agent.id != vehicle.id);
            // checks if ix is an alignment interaction
            let is_alignment = (ix.interactionType == "alignment")
            // checks if this agent's species is among the targeted species for this interaction
            let is_target_type = (ix.targets.includes(agent.species));
            // checks if this agent is within range of the specified vehicle
            let is_in_range = (distance(vehicle.pos,agent.pos) <= ix.range);

            // filters the list of agents down to those that aren't the given vehicle
            //(except for alignment interactions where the vehicle includes itself),
            // are among the species targeted in this interaction, and are within range
            // of the specified vehicle
            return (is_not_self || is_alignment) && is_target_type && is_in_range;
        });
    }
    
    /**
     * Updates the world for the next time step
     */
    update(){
        // Advances the time step t
        this.t++;

        // performs all force interaction calculations
        this.agents.forEach((a) => a.calcForces());
        // updates all vehicles after all the calculations have been completed
        this.agents.forEach((a) => a.update());

        // add a record to run history for the current time step with the counts of agents
        this.run_history.push({t:this.t,...this.counts});
    }

    /**
     * Retrieves the current state of world, which is used for updating the display on the client side.
     * @returns {Object} the current state of the system
     */
    getState(){
        return {
            t: this.t,
            agents: this.agents.map((a) => {
            return { pos: a.pos, dir: a.dir, color: a.color }})
        }
    }
    
    /**
     * Gets the history records for this run
     * @returns {List<Map<string,int>>} the history for this run, formatted as a list of entries
     * with the timestep and counts for each species.
     */
    getHistory(){
        return this.run_history;
    }

    /**
     * Runs one timestep of the simulation
     * @returns {Object} the current simulation state.
     */
    runStep(){
        // update the simulation
        this.update();

        // return its state
        return this.getState();
    }
}