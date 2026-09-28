const axios = require('axios');


class EventFlow {

    constructor({apiKey, host}){
        this.apiKey = apiKey;
        this.host = host || 'http://localhost:8001';
    }

    async track(eventName, properties, userId){

        try {
             const res = await axios.post(`${this.host}/api/v1/events`, {eventName, properties, userId}, {headers: {"Content-Type": "application/json", "x-api-key": this.apiKey}})
        } catch(err){
            console.error(err)
        }
    }


}

module.exports = EventFlow;
