// defining resolver functions
import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config()


const resolvers = {
    Query: {
    topEvents: async (parent, {projectId}, context, info) => {
        const res = await axios.get(`${process.env.ANALYTICS_SERVICE_URL}/api/v1/analytics/top-events/?projectId=${projectId}`);

        return res.data.data.topEvents
    },
    dau: async (parent,{projectId},context,info) => {
         const res = await axios.get(`${process.env.ANALYTICS_SERVICE_URL}/api/v1/analytics/dau/?projectId=${projectId}`);

        return res.data.data.dailyActiveUsers
    },
    mau: async (parent,{projectId},context,info) => {
         const res = await axios.get(`${process.env.ANALYTICS_SERVICE_URL}/api/v1/analytics/mau/?projectId=${projectId}`);

        return res.data.data.monthlyActiveUsers
    },
    funnel: async (parent,{projectId, steps},context,info) => {
        const res = await axios.get(`${process.env.ANALYTICS_SERVICE_URL}/api/v1/analytics/funnel-analytics/?projectId=${projectId}&steps=${steps}`);

        return res.data.data.totalFunnelAnalytics
    },
    retention: async (parent,{projectId},context,info) => {
        const res = await axios.get(`${process.env.ANALYTICS_SERVICE_URL}/api/v1/analytics/retention/?projectId=${projectId}`);

        return [res.data.data.retentionAnalytics[0]]
    }
    }

}


export default resolvers
