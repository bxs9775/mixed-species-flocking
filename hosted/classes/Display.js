import Utils from "./Utils.js";
/**
 * Default display class used on the client-side
 */
export default class Display{
    /**
     * Creates a new instance of the Display class. It is recomended that you use the constructor class for a child class instead.
     * @constructor
     */
    constructor(){
        let b = 6;
        let h = 10;
        this.shape = [[-h/2,-b/2],[h/2,0],[-h/2,b/2]];
    }
    
    /**
     * Function for rendering a shape within the display. This is overloaded in child classes to work with the specifics of a given display.
     * @param {List<List<int>>} shape - the shape to be rendered, given as an array of vectors
     * @param {string} color - the name of the color to be used to render this shape
     */
    render(shape,color="black"){}
    
    /**
     * Draws an automomous agent by applying transforms to the base shape, and rendering the shape to the display.
     * @param {Vehicle} agent - the autonomous agent to be displayed
     */
    draw(agent){
        let shape = this.shape;
        
        // rotate the base shape based on the agents orientation
        shape = Utils.rotateShape(shape,Utils.getAngle(agent.dir));
        // apply a translation matrix to the shape based on the agent's position
        shape = Utils.translate(shape,agent.pos);
        
        // render the shape using the display's overloaded render function
        this.render(shape,agent.color);
    }

    /**
     * Function for clearing the display. This is overloaded in child classes to work with the specifics of a given display.
     */
    clear(){}

    /**
     * Function for writing text within the display. This is overloaded in child classes to work with the specifics of a given display.
     * @param {List<int>} pos - the top left starting position for the text
     * @param {string} message - the text message to write
     */
    write(pos,message){}
}