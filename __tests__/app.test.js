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
        test('GET 200: responds with an array of all article objects with the respective comment count for each article', () => {
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
            })
        })
        test('GET 200: the array of article objects are sorted by date in a descending order', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
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
describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        test('GET 200: responds with an array of comments for the specified article_id sorted with most recent comments first', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toHaveLength(2)
                body.comments.forEach((comment) => {
                    expect(typeof comment.comment_id).toBe('number')
                    expect(typeof comment.votes).toBe('number')
                    expect(typeof comment.created_at).toBe('string')
                    expect(typeof comment.author).toBe('string')
                    expect(typeof comment.body).toBe('string')
                    expect(comment.article_id).toBe(3)
                })
            })
        })
        test('GET 200: the array of comments are sorted with most recent comments appearing first', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toBeSorted({descending: true})
            })
        })
        test('GET 404: responds with an error status and a relevant message when passed an article_id that does not exist', () => {
            return request(app)
            .get('/api/articles/10000/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Not Found')
            })
        })
        test('GET 400: responds with an error status and a relevant message when passed an invalid article_id', () => {
            return request(app)
            .get('/api/articles/invalid_id/comments')
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