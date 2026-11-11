const request = require('supertest');

const app = require('../app');

describe('Health Check Endpoint', () => {
    test('GET /api/v1/events/health return HTTP 200', async () => {
        const response = await request(app).get('/api/v1/events/health');
        expect(response.body).toEqual({
            status: 'success',
            message: 'api health endpoint'
        })
        expect(response.status).toBe(200);
    } )})