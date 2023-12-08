/**
 * Static class holding general utility functions used throughout the code
 */
export default class Utils{
    /**
     * Rotates a shape with the given angle
     * @param {List<List<int>>} shape - the shape to be rotated, given as an array of vectors
     * @param {int} angle - the angle the shape should be rotated by in radians
     * @returns {List<List<int>>} the rotated shape
     */
    static rotateShape(shape,angle){
        return shape.map((pt) => math.rotate(pt,angle));
    }

    /**
     * Translates a shape to the given position
     * @param {List<List<int>>} shape - the shape to be translated, given as an array of vectors
     * @param {List<int>} pos - the position vector the shape should be translated to
     * @returns {List<List<int>>} the translated shape
     */
    static translate(shape,pos){
        return shape.map(pt => math.add(pt,pos));
    }

    /**
     * Calculates the angle of a given vector
     * @param {List<int>} vector - the vector to find the angle of
     * @returns {int} the angle in radians
     */
    static getAngle(vector){
        // special case handling for when x is 0
        if(vector[0] == 0){
            if(vector[1] > 0){
                return 0.5*math.pi;
            } else {
                return 1.5*math.pi;
            }
        }
        // calculate the angle by taking the arctan of y/x
        let deg = math.atan(vector[1]/vector[0])
        return deg;
    }

    /**
     * Clamps/limits a vector to a given maximum magnitude
     * @param {List<int>} vector - the vector to be limited
     * @param {int} limit - the maximum maginitude
     * @returns {List<int>} the modified vector
     */
    static limit(vector,limit){
        // get the magnitude using 2-norm of the vector
        let mag = math.norm(vector);
        // check if the magnitude is below the limit
        if(mag > limit){
            // if the magnitude is above the limit, scale the vector down to the limit
            return math.multiply(vector,limit/mag)
        } else {
            // if the magnitude is below the limit return the vector as is
            return vector;
        }
    }

    /**
     * Sets the magnitude of a vector
     * @param {List<int>} vector - the vector to be modified
     * @param {int} mag - the desired magnitude 
     * @returns {List<int>} the modified vector
     */
    static setMag(vector,mag){
        // get the magnitude using 2-norm of the vector 
        let mag2 = math.norm(vector);
        // use the calculated magnitude and desired magnitude to scale the vector
        return math.multiply(vector,mag2/mag);
    }
    
    /**
     * Implementation of the sleep function in JI
     * Based on: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep/39914235#39914235
     * @param {int} ms - the time in millseconds to sleep for 
     */
    static sleep(ms){
        return new Promise((resolve) => setTimeout(resolve,ms));
    }
}