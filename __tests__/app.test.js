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
describe('/api/articles', () => {
    describe('GET', () => {
        test('GET 200: responds with an array of all article objects sorted by date in a descending order', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(5)
                body.articles.forEach((article) => {
                    expect(typeof article.article_id).toBe('number')
                    expect(typeof article.author).toBe('string')
                    expect(typeof article.title).toBe('string')
                    expect(typeof article.topic).toBe('string')
                    expect(typeof article.created_at).toBe('string')
                    expect(typeof article.votes).toBe('number')
                    expect(typeof article.article_img_url).toBe('string')
                    expect(typeof article.comment_count).toBe('number')
                })
                expect(body.articles).toBeSortedBy("created_at", {descending: true})
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
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes:  100,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
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