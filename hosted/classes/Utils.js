export default class Utils{
    static rotateShape(shape,dir){
        return shape.map((pt) => math.rotate(pt,dir));
    }

    static translate(shape,pos){
        return shape.map(pt => math.add(pt,pos));
    }

    static getAngle(vector){
        if(vector[0] == 0){
            if(vector[1] > 0){
                return 0.5*math.pi;
            } else {
                return 1.5*math.pi;
            }
        }
        let deg = math.atan(vector[1]/vector[0])
        return deg;
    }

    static limit(vector,limit){
        let mag = math.norm(vector);
        if(mag > limit){
            return math.multiply(vector,limit/mag)
        } else {
            return vector;
        }
    }

    static setMag(vector,mag){
        let mag2 = math.norm(vector);
        return math.multiply(vector,mag2/mag);
    }
    
    /**
     * Implementation of the sleep function in JI
     * Based on: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep/39914235#39914235
     * @param ms the time in millseconds to sleep for 
     */
    static sleep(ms){
        return new Promise((resolve) => setTimeout(resolve,ms));
    }
}