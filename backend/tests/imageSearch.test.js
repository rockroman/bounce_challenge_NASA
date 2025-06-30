import nock from 'nock';
import request from 'supertest';
import { server, app } from '../server.js';
import { jest } from '@jest/globals';

describe('Image Search API', () => {

    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterAll((done) => {
        server.close(done);
    });

    beforeEach(() => {
        // Mock OpenAI API
        nock('https://api.openai.com')
            .post('/v1/chat/completions')
            .reply(200, {
                choices: [
                    {
                        message: {
                            content: JSON.stringify({
                                keywords: ['Mars', 'Rover'],
                                mediaType: 'image',
                                yearStart: '2020',
                                yearEnd: '2021'
                            })
                        }
                    }
                ]
            });

        // Mock NASA API
        nock('https://images-api.nasa.gov')
            .get('/search')
            .query(true)
            .reply(200, {
                collection: {
                    items: [
                        {
                            data: [{ title: 'Mars Rover', description: 'A rover on Mars', nasa_id: '12345' }],
                            links: [{ href: 'https://example.com/image.jpg', rel: 'preview' }]
                        }
                    ],
                    metadata: { total_hits: 1 }
                }
            });
    });


    afterEach(() => {
        // Cleaning up all  mocks
        nock.cleanAll();
    });

    it('should return 200 and results for a valid query', async () => {
        const response = await request(app)
            .post('/api/image-search')
            .send({ query: 'Mars Rover' });

        expect(response.status).toBe(200);
        expect(response.body.results).toBeDefined();
        expect(response.body.results.length).toBeGreaterThan(0);
    });

    it('should return 400 if no query is provided', async () => {
        const response = await request(app)
            .post('/api/image-search')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No search query in request body');
    });

});

