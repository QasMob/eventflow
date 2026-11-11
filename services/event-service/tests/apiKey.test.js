
const request = require('supertest')
const Project = require('../models/Project')
const Event = require('../models/Event')
const app = require('../app')

jest.mock('../models/Project')
jest.mock('../models/Event')

describe('API Key Authentication', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })


    test('Rejects an invalid API key with HTTP 401', async () => {
        Project.findOne.mockResolvedValue(null)

        const response = await request(app)
            .get('/api/v1/events')
            .set('x-api-key', 'invalid_api_key')

        expect(Project.findOne).toHaveBeenCalledWith({
            apiKey: 'invalid_api_key'
        })

        expect(response.status).toBe(401)
        expect(response.body.status).toBe('fail')
    })


    test('Accepts a valid API Key', async () => {
        const mockProject = {
            _id: 'mock_project_id',
            name: 'Mock Project',
            apiKey: 'valid_api_key'
        }

        Project.findOne.mockResolvedValue(mockProject);
        
        Event.find.mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([])
        })

        const response = await request(app).get('/api/v1/events').set('x-api-key', 'valid_api_key');

        expect(Project.findOne).toHaveBeenCalledWith({apiKey: 'valid_api_key'});

        expect(Event.find).toHaveBeenCalledWith({ projectId: mockProject._id });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');

    })
})
