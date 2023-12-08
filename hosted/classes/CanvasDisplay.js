import Display from "./Display.js";

/**
 * An extension of the Display class for rendering content in a HTML <canvas> element
 */
export default class CanvasDisplay extends Display{
    /**
     * Creates a new instance of the CanvasDisplay class
     * @param {HTMLCanvasElement} canvas - the canvas element to render content to
     * @constructor
     */
    constructor(canvas){
        super();
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }

    /**
     * Function for rendering a shape within the HTML <canvas> element
     * @param {List<List<int>>} shape - the shape to be rendered, given as an array of vectors
     * @param {string} color - the name of the color to be used to render this shape
     */
    render(shape,color="black"){
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.fillStyle = color;
		ctx.moveTo(...shape[0]);
        for(let i = 1; i < shape.length; i++){
            ctx.lineTo(...shape[i]);
            
        }
        ctx.fill();
    }
    /**
     * Function for clearing the HTML <canvas> element
     */
    clear(){
        let canvas = this.canvas;
        // clears a rectangle of space covering the whole canvas
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    
    /**
     * Function for writing text in the HTML <canvas> element
     * @param {List<int>} pos - the top left starting position for the text
     * @param {string} message - the text message to write
     */
    write(pos,message){
        let ctx = this.ctx;
        // sets the fill to black
        ctx.fillStyle = "black";
        ctx.fillText(message,...pos);
    }
}