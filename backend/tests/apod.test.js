import nock from 'nock';
import request from 'supertest';
import { server, app } from '../server.js';
import { jest } from '@jest/globals';

describe(' API', () => {

    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterAll((done) => {
        server.close(done);
    });



    beforeEach(() => {
        // Mocking NASA APOD API
        nock('https://api.nasa.gov')
            .get('/planetary/apod')
            .query({ api_key: process.env.NASA_API_KEY })
            .reply(200, {
                title: 'Mars craters',
                url: 'https://example.com/image.jpg',
                explanation: 'A craters of Mars images',
            });
    });



    afterEach(() => {
        // Cleaning up all nock mocks
        nock.cleanAll();
    });

    it('should return 200 and image  of the day', async () => {
        const response = await request(app).get('/api/apod');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('url');
        expect(response.body).toHaveProperty('explanation');
    });


});



