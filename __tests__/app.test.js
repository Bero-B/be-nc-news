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