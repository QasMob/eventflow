const Event = require('../models/Event')
const mongoose = require('mongoose')

const client = require('../utils/redis')


exports.retention = async (req, res, next) => {
    try {

    let {projectId} = req.query;

    projectId = new mongoose.Types.ObjectId(projectId);


    const redisKey = `retention:${projectId}`

    const retentionAnalyticsCached = JSON.parse(await client.get(redisKey))

     if (retentionAnalyticsCached){
            return res.status(200).json({
                status: 'success',
                results: retentionAnalyticsCached.length,
                data: {
                    retentionAnalyticsCached
                }
            })
    }




    const retentionAnalytics = await Event.aggregate([
        {
            $match: {
                projectId: projectId
            }
        },
        {
            $group: {
                _id: '$userId',
                // min on timestamp to retrieve earliest event for each user -> first seen date
                firstSeen: {
                    $min: '$timestamp'
                }
            }
        },
        {
            $lookup: {
                // collection to join
                from: 'events',
                // field from the current document (userId)
                localField: '_id',
                // field in events collection
                foreignField: 'userId',
                // name of array it creates
                as: 'allEvents'
            }
        },
        {
            $project: {
                firstSeen: 1,
                day1: {
                    $gt: [
                        {
                            // count how many events passed the filter
                            $size: {
                                $filter: {
                                    // loop over all events for the user
                                    input: '$allEvents',
                                    // each element in allEvent is as event, referenced using $$event
                                    as: 'event',
                                    // keep only event where condition is true
                                    cond: {
                                        $and: [
                                            {$gte:  ['$$event.timestamp', { $dateAdd: {startDate: '$firstSeen', unit: 'day', amount: 1}}]},
                                            {$lt: ['$$event.timestamp', {$dateAdd: {startDate: '$firstSeen', unit: 'day', amount: 2}}]}
                                        ]
                                    }
                                }
                            }
                        },
                        0
                    ]
                },
                day7: {
                    $gt: [
                        {
                            // count how many events passed the filter
                            $size: {
                                $filter: {
                                    // loop over all events for the user
                                    input: '$allEvents',
                                    // each element in allEvent is as event, referenced using $$event
                                    as: 'event',
                                    // keep only event where condition is true
                                    cond: {
                                        $and: [
                                            {$gte:  ['$$event.timestamp', { $dateAdd: {startDate: '$firstSeen', unit: 'day', amount: 7}}]},
                                            {$lt: ['$$event.timestamp', {$dateAdd: {startDate: '$firstSeen', unit: 'day', amount: 8}}]}
                                        ]
                                    }
                                }
                            }
                        },
                        0
                    ]
                },
                day30: {
                    $gt: [
                        {
                            // count how many events passed the filter
                            $size: {
                                $filter: {
                                    // loop over all events for the user
                                    input: '$allEvents',
                                    // each element in allEvent is as event, referenced using $$event
                                    as: 'event',
                                    // keep only event where condition is true
                                    cond: {
                                        $and: [
                                            {$gte:  ['$$event.timestamp', { $dateAdd: {startDate: '$firstSeen', unit: 'day', amount: 30}}]},
                                            {$lt: ['$$event.timestamp', {$dateAdd: {startDate: '$firstSeen', unit: 'day', amount: 31}}]}
                                        ]
                                    }
                                }
                            }
                        },
                        0
                    ]
                }

            }
        },
        {
            $group: {
                _id: null,
                totalUsers: {$sum: 1},
                // cond is a ternary, if day1 is true, add 1, else add 0
                day1Returned: {$sum: {$cond: [ '$day1', 1, 0]}},
                day7Returned: { $sum: { $cond: ['$day7', 1, 0] } },
                 day30Returned: { $sum: { $cond: ['$day30', 1, 0] } }

            }
        }
    // {
    //   "_id": "user1",
    //   "firstSeen": "2026-06-01T...",
    //   "allEvents": [ ...all their events... ]
    // }

    ])


    await client.set(redisKey, JSON.stringify(retentionAnalytics), 'EX', 3600)


    res.status(200).json({
        status: 'success',
        results: retentionAnalytics.length,
        data: {
            retentionAnalytics
        }
    })



    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}


exports.funnelAnalytics = async (req, res, next) => {

    try {

        let {projectId} = req.query

        projectId = new mongoose.Types.ObjectId(projectId)


        const redisKey = `funnel:${projectId}:${req.query.steps}`

        const totelFunnelAnalyticsCached = JSON.parse(await client.get(redisKey))

        if (totelFunnelAnalyticsCached){
            return res.status(200).json({
                status: 'success',
                results: totelFunnelAnalyticsCached.length,
                data: {
                    totelFunnelAnalyticsCached
                }
            })
        }


        // [event names]  -> steps=Visited Homepage,Registered,Uploaded Resume -> string, need to conver to array
        const steps = req.query.steps.split(',')

        const totalFunnelAnalytics = []


        for (const step of steps){
         const funneledAnalytics = await Event.aggregate([
            {
                $match: {
                    projectId: projectId,
                    eventName: step
                }
            },
            {
                $group: {
                    _id: '$userId'
                }
            },
            {
                $count: 'users'
            }
        ])

        totalFunnelAnalytics.push({step, users: funneledAnalytics[0]?.users || 0})
       }


       await client.set(redisKey, JSON.stringify(totalFunnelAnalytics), 'EX', 3600)

       res.status(200).json({
        status: 'success',
        results: totalFunnelAnalytics.length,
        data: {
            totalFunnelAnalytics
        }
       })



    } catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }


}


exports.monthlyActiveUsers = async (req, res, next) => {
      try {

    const {projectId} = req.query;

    const projectIdFound = new mongoose.Types.ObjectId(projectId);

    const cachedKey = `mau:${projectId}`;

    let monthlyActiveUsers;

    monthlyActiveUsers = JSON.parse(await client.get(cachedKey));

    if (monthlyActiveUsers){
        return res.status(200).json({
            status: 'success',
            results: monthlyActiveUsers.length,
            data: {
                monthlyActiveUsers
            }
        })
    }


     monthlyActiveUsers = await Event.aggregate([
        {
            $match: {
                projectId: projectIdFound
            }
        },
        {
            $group: {
                _id: {
                    month: {
                        $dateToString: {
                            format: '%Y-%m',
                            date: '$timestamp'
                        }
                    },
                    userId: '$userId'
                }
            }
        },
        {
            $group: {
                _id: '$_id.month'
                ,
                 count: {
                            $sum: 1
                        }
            }
        },

        {
            $sort: {
                _id: 1
            }
        }


    ])

    await client.set(cachedKey, JSON.stringify(monthlyActiveUsers), 'EX', 3600);



    res.status(200).json({
        status: 'success',
        results: monthlyActiveUsers.length,
        data: {
            monthlyActiveUsers
        }
    })




     } catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
     }
}


exports.dailyActiveUsers = async (req, res, next) => {
    try {

    const {projectId} = req.query;

    const projectIdFound = new mongoose.Types.ObjectId(projectId);

    const cachedKey = `dau:${projectId}`;

    let dailyActiveUsers;

    dailyActiveUsers = JSON.parse(await client.get(cachedKey));

    if (dailyActiveUsers){
        return res.status(200).json({
            status: 'success',
            results: dailyActiveUsers.length,
            data: {
                dailyActiveUsers
            }
        })
    }


     dailyActiveUsers = await Event.aggregate([
        {
            $match: {
                projectId: projectIdFound
            }
        },
        {
            $group: {
                _id: {
                    day: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$timestamp'
                        }
                    },
                    userId: '$userId'
                }
            }
        },
        {
            $group: {
                _id: '$_id.day'
                ,
                count: {
                            $sum: 1
                        }
            }
        },

        {
            $sort: {
                _id: 1
            }
        }


    ])

    await client.set(cachedKey, JSON.stringify(dailyActiveUsers), 'EX', 3600);



    res.status(200).json({
        status: 'success',
        results: dailyActiveUsers.length,
        data: {
            dailyActiveUsers
        }
    })




     } catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
     }
}

exports.topEvents = async (req, res, next) => {

   try {
    const {projectId} = req.query

    // projectId is key
    const data = JSON.parse(await client.get(projectId))

    if (data){
       return res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
            topEvents: data
        }
    })
    }


    const projectIdFound = new mongoose.Types.ObjectId(projectId)


    const topEvents = await Event.aggregate([
        {
           $match: {
            projectId: projectIdFound
           }
        },
        {
        $group: {
            // _id specify grouping key
            // what am i grouping by
            // $eventName tells mongodb look up value stored in this field
            // use the value of the eventName field as the grouping key
            _id: '$eventName',
           count: {
            $sum: 1
           }
        }
        },
        {
        $sort: {
                count: -1
        }
        },
        {
            $project: {
                eventName: '$_id',
                count: 1,
                _id: 0
            }
        }
    ])


    // aggregation pipeline
    // each object stage in pipeline
    // every stage starts with a $ -> stages are operators
    // examples:
    // $match
    // $sort
    // $group
    // $project
    // $stageName: {
    // configuration
    // }
    // each stage usually answers one question
    // good pipelines read like this:
    // which documents
    // how should they be orderd
    // what fields do I want

    // stages can reshape documents as they pass through
    // aggregation returns an array

    // $match -> filtering documents -> which documents do i want to keep

    // $project -> choose or reshape the fields -> large document -> $project -> smaller/custom document
    // its like creating final response shape for your frontend

    // $group -> combine documents togethers
    // think: can I summarize these documents
    // many documents -> $group -> summary statistics
    // common uses: count, sum,  average, min/max, statistics
    // accumulators: $sum, $avg, $max -> what to calcualte for each group
    // $sum: 1 -> counting document that pass through stage
    // $sum: '$field' -> sum based on a document field that pass through stage


    // $lookup -> I need data from another collection / Join another collection
    // events + users -> combined result similar to sql joins


    // sort -> ordering documents
    // in what order do I want the documentsd

    await client.set(projectId, JSON.stringify(topEvents), 'EX', 3600)

    res.status(200).json({
        status: 'success',
        results: topEvents.length,
        data: {
            topEvents
        }
    })


   } catch(err){
    res.status(400).json({
        status: 'fail',
        message: err.message
    })
   }



}
