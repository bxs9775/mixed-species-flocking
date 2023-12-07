import Utils from "./Utils.js";

let nextId = 1;
/**
 * Base class for automous agents
 */
export default class Vehicle{
    constructor(world,species,pos,dir,max_speed,color,stearingInteractions,lotkaVolterraIxs){
        this.id = nextId;
        nextId++;

        this.world = world;
        this.stearingInteractions = stearingInteractions;
        this.lotkaVolterraInteractions = lotkaVolterraIxs;

        this.species = species;
       
        this.mass = 1;

        this.color = color;

        this.pos = pos;
        this.velocity = dir;
        this.velocity = multiply(this.velocity,max_speed);

        this.dir = dir;
        this.max_speed = max_speed;
        this.timeOutOFBounds = 0;

        this.dead = false;
        this.birthing = false;
    }

    copy(pos,dir){
        return new Vehicle(this.world,this.species,pos,dir,this.max_speed,this.color,this.stearingInteractions,this.lotkaVolterraInteractions);
    }

    stayInBounds(){
        let width,height = this.world.bounds;
        let sibVector = [0,0];
        let edge = 20;
        let outOfBounds = false;
        if(this.pos[0] <= edge){
            sibVector = add(sibVector,[1,0]);
            outOfBounds = true;
        } else if(this.pos[0] > width-edge){
            sibVector = add(sibVector,[-1,0]);
            outOfBounds = true;
        }
        if(this.pos[1] <= edge){
            sibVector = add(sibVector,[0,1]);
            outOfBounds = true;
        } else if(this.pos[1] > height-edge){
            sibVector = add(sibVector,[0,-1]);
            outOfBounds = true;
        }
        //Fix for boundry hiding problem.
        if(outOfBounds){
            this.timeOutOFBounds++;
        }else{
            this.timeOutOFBounds=0;
        }
        if(this.timeOutOFBounds*5 > 0){
            sibVector = multiply(sibVector,this.timeOutOFBounds*5);
        }
        return sibVector;
    }

    calcSteeringForce(){
        let steeringForce = [0,0];
        let next_pos=[0,0],desired=[0,0];
        this.stearingInteractions.forEach((interaction) => {
            let force = [0,0];
            let targets = this.world.getTargets(this,interaction);
            if(targets.length == 0){
                return;
            }
            switch(interaction.interactionType){
                // prey seeking behavior
                case "seek":
                    targets.forEach((t) => {
                        desired = subtract(t.pos,this.pos);
                        desired = Utils.setMag(desired,this.max_speed);
                        desired = subtract(desired,this.velocity)
                        force = add(force,desired);
                    });
                    break;
                // predator fleeing behavior
                case "flee":
                    targets.forEach((t) => {
                        desired = subtract(t.pos,this.pos);
                        desired = Utils.setMag(desired,this.max_speed);
                        desired = subtract(desired,this.velocity)
                        desired = multiply(desired,-1);
                        force = add(force,desired);
                    });
                    break;
                // cohesion to local flock
                case "cohesion":
                    next_pos = targets.reduce((pos_sum,t) => {
                        return add(pos_sum,t.pos)
                    },[0,0]);
                    next_pos = multiply(next_pos,1/targets.length);
                    desired = subtract(next_pos,this.pos);
                    desired = Utils.limit(desired,this.max_speed);
                    force = subtract(desired,this.velocity);
                    break;
                // short range avoidence
                case "seperate":
                    next_pos = targets.reduce((pos_sum,t) => {
                        return add(pos_sum,t.pos)
                    },[0,0]);
                    next_pos = multiply(next_pos,1/targets.length);
                    desired = subtract(next_pos,this.pos);
                    desired = Utils.limit(desired,this.max_speed);
                    desired = multiply(desired,-1);
                    force = subtract(desired,this.velocity);
                    break;
                // aligning to adverage orientation
                case "alignment":
                    let sum_dir = targets.reduce((sum,t) => {
                        return add(sum,t.dir);
                    },[0,0]);
                    let sum_mag = norm(sum_dir); 
                    if(sum_mag > 0){
                        let factor = this.max_speed/sum_mag;
                        let desired = multiply(sum_dir,factor);
                        force = subtract(desired,this.velocity);
                    }
                    break;
            }
            force = multiply(interaction.weight,force);
            steeringForce = add(steeringForce,force);
        });
        //steeringForce = add(steeringForce,this.stayInBounds());
        return steeringForce;
    }

    calcLotkaVolterra(){
        this.lotkaVolterraInteractions.forEach((interaction) => {
            let targets = this.world.getTargets(this,interaction);
            if(interaction.interactionType != "death" && targets.length == 0){
                return;
            }
            switch(interaction.interactionType){
                case "eat":
                    targets.forEach((t) => {
                        if(random() <= interaction.chance && !t.dead){
                            t.dead = true;
                            this.birthing = true;
                        }
                    });
                    break;
                case "birth":
                    if(random() <= interaction.chance){
                        this.birthing = true;
                    }
                    break;
                case "death":
                    if(random() <= interaction.chance){
                        this.dead = true;
                    }
                    break;
            }
        });
    }

    update(){
        // check Lotka-Volterra
        this.calcLotkaVolterra();
        if(this.dead){
            let ind =  this.world.agents.indexOf(this);
            if(ind > -1){
                this.world.agents.splice(ind,1);
            }
        }
        if(this.birthing){
            let pos = [this.pos[0] + pickRandom([-1,1])*random(10,25),this.pos[1] + pickRandom([-1,1])*random(10,25)];
            let dir = rotate([1,0],random()*2*pi);
            this.world.agents.push(this.copy(pos,dir));
            this.birthing = false;
        }
        // Calculate the steering force
        let steeringForce = this.calcSteeringForce();
        
        // Calculate the acceleration
        let mass_factor = 1/this.mass
        let acceleration = multiply(steeringForce,mass_factor);
        // Calculate the velocity
        this.velocity = add(this.velocity,acceleration);
        this.velocity = Utils.limit(this.velocity,this.max_speed);
        
        // update the position
        this.pos = add(this.pos,this.velocity);
        
        // apply boundry conditions
        this.pos[0] = mod(this.pos[0],this.world.bounds[0]);
        this.pos[1] = mod(this.pos[1],this.world.bounds[1]);

        // update the direction
        let v_mag = norm(this.velocity)
        if(v_mag > 0){
            this.dir = Utils.setMag(this.velocity,1);
        }
    }
}