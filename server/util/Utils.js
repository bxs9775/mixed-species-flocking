import {add,multiply,rotate,pi,norm,atan}  from "mathjs";

export default class Utils{
    static rotateShape(shape,dir){
        return shape.map((pt) => rotate(pt,dir));
    }

    static translate(shape,pos){
        return shape.map(pt => add(pt,pos));
    }

    static getAngle(vector){
        if(vector[0] == 0){
            if(vector[1] > 0){
                return 0.5*pi;
            } else {
                return 1.5*pi;
            }
        }
        let deg = atan(vector[1]/vector[0])
        return deg;
    }

    static limit(vector,limit){
        let mag = norm(vector);
        if(mag > limit){
            return multiply(vector,limit/mag)
        } else {
            return vector;
        }
    }

    static setMag(vector,mag){
        let mag2 = norm(vector);
        return multiply(vector,mag2/mag);
    }
}