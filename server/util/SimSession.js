/**
 * Singleton class for storing session information between API calls
 */
class SimSession{
    /**
     * Creates a new instance of the SimSession class
     * @constructor
     */
    constructor(){
        this.world = null;
    }
}

// create a singleton instance of SimSession and export it
let session = new SimSession();
export default session;