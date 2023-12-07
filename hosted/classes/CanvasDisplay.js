import Display from "./Display.js";

export default class CanvasDisplay extends Display{
    constructor(canvas){
        super();
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }

    render(shape,color){
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.fillStyle = color;
		ctx.moveTo(...shape[0]);
        for(let i = 1; i < shape.length; i++){
            ctx.lineTo(...shape[i]);
            
        }
        ctx.fill();
    }

    clear(){
        let canvas = this.canvas;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    
    write(pos,txt){
        let ctx = this.ctx;
        ctx.fillStyle = "black";
        ctx.fillText(txt,...pos);
    }
}