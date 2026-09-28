const Event = require('../models/Event')
const rabbitmq = require('../utils/rabbitmq')


exports.getEvents = async (req, res , next) => {
   try {

    const projectId = req.project._id
    let {eventName, userId, startDate, endDate, sort} = req.query

    const filterObj = {
        projectId
    }

   if ( eventName) {
    filterObj.eventName = eventName
   }


   if( userId) {
    filterObj.userId = userId
   }

   if (startDate && endDate){
    filterObj.timestamp = {$gte:  new Date(startDate), $lte: new Date(endDate)}
   }




    // can have user specify page/limit or default ?page=1&limit=10
    //

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;


    // (1 - 1) = 0 * 10 = 0;
    // (2 - 1) = 1 * 10 = 10;


    const skip = (page - 1) * limit;

    const events = await Event.find(filterObj).sort(sort || '-timestamp').skip(skip).limit(limit)




    res.status(200).json({
        status: 'success',
        page: page,
        results: events.length,
        data: {
           events
        }
    })
    } catch(err){
        res.status(400).json({
            status: 'fail',
            message: 'bad request'
        })
    }
}

exports.ingestEvent = async (req, res, next) => {

    try {
    const {userId, eventName, properties} = req.body

    const projectIdFound = req.project._id

    const eventCreated = await Event.create({projectId: projectIdFound, userId, eventName, properties})

    rabbitmq.publishEvent(eventCreated)




    res.status(201).json({
        status: 'success',
        data: {
            event: {
                eventCreated
            }
        }
    })
    } catch(err){
        res.status(400).json({
            status: 'fail',
            message: 'bad request'
        })
    }

}
