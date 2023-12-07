import Utils from "./Utils.js";

export default class Display{
    constructor(){
        let b = 6;
        let h = 10;
        this.shape = [[-h/2,-b/2],[h/2,0],[-h/2,b/2]];
    }
    
    render(shape){

    }
    
    draw(agent){
        //console.log("Drawing...")
        let shape = this.shape;
        //console.log(shape);

        shape = Utils.rotateShape(shape,Utils.getAngle(agent.dir));
        shape = Utils.translate(shape,agent.pos);
        //console.log(shape);
        this.render(shape,agent.color);
    }

    clear(){}

    write(pos,txt){}
}