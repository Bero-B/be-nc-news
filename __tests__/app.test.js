const app = require('../app');
const request = require("supertest");
const db = require('../db/connection');
const seed  = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpoints = require('../endpoints.json')

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe('/api', () => {
    describe('GET', () => {
        test('GET 200: responds with a json containing all the available endpoints that can be used by the user', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                expect(body.endpoints).toEqual(endpoints)
            })
        })
    })
})
describe('/api/topics', () => {
    describe('GET', () => {
        test('GET 200: responds with an array of all topic objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(body.topics).toHaveLength(3)
                body.topics.forEach((topic) => {
                    expect(typeof topic.description).toBe('string')
                    expect(typeof topic.slug).toBe('string')
                })
            })
        })
    })
})
describe('/api/articles/:article_id', () => {
    describe('GET', () => {
        test('GET 200: responds with an article object with the specified id', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
                expect(body.article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                })
            })
        })
        test('GET 404: responds with an error code and a relevant message when passing an article id that does not exist', () => {
            return request(app)
            .get('/api/articles/9000')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Not Found')
            })
        })
        test('GET 400: responds with an error code and a relevant message when passing an invalid article id', () => {
            return request(app)
            .get('/api/articles/not-a-number')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request')
            })
        })
    })
})
describe("invalid endpoint", () => {
    test("responds with a 404 status code and a relevant error message when given an endpoint that does not exist", () => {
      return request(app)
        .get("/api/not-an-endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Endpoint");
        });
    });
  });