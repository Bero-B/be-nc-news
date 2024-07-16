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
    describe('PATCH', () => {
        test('PATCH 200: increments the votes of the speficied article if the value in inc_votes is positive and responds with the udpated article', () => {
            return request(app)
            .patch("/api/articles/1")
            .send({inc_votes: 3})
            .expect(200)
            .then(({body}) => {
                expect(body.article).toMatchObject({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 103,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                })
            })
        })
        test('PATCH 200: decrements the votes of the speficied article if the value in inc_votes is negative and responds with the udpated article', () => {
            return request(app)
            .patch("/api/articles/1")
            .send({inc_votes: -20})
            .expect(200)
            .then(({body}) => {
                expect(body.article).toMatchObject({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 80,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                })
            })
        })
        test('PATCH 400: responds with an error status and a relevant message when attempting to update an article with a request body that does not contain the correct fields', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request")
            })
        })
        test('PATCH 400: responds with an error status and a relevant message when attempting to update an article with a request body with invalid fields', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: "word"})
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request")
            })
        })
        test('PATCH 404: responds with an error status and a relevant message when attempting to update an article that does not exist', () => {
            return request(app)
            .patch('/api/articles/100')
            .send({inc_votes: 20})
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Not Found")
            })
        })
    })
})
describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        test('GET 200: responds with an array of comments for the specified article_id', () => {
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
        test('GET 200: responds with an empty array when the specified article exists but it does not contain any comments', () => {
            return request(app)
            .get('/api/articles/4/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toEqual([])
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
    describe('POST', () => {
        test('POST 201: inserts a new comment to the comments table relating to the specified article and responds with the newly posted comment', () => {
            const comment =  {
                username: "butter_bridge",
                body: "A hungry bear doesn't dance"
            }
            return request(app)
            .post('/api/articles/7/comments')
            .send(comment)
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toBe("A hungry bear doesn't dance")
            })
        })
        test('POST 400: responds with an error status and a relevant message when attempting to post a comment with missing fields', () => {
            const comment =  {
                username: "butter_bridge",
            }
            return request(app)
            .post('/api/articles/7/comments')
            .send(comment)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request")
            })
        })
        test("POST 400: responds with an error status and a relevant message when passing an invalid article_id", () => {
            const comment =  {
                username: "butter_bridge",
                body: "A hungry bear doesn't dance"
            }
            return request(app)
            .post('/api/articles/not-a-number/comments')
            .send(comment)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request")
            })
        })
        test("POST 400: responds with an error status and a relevant message when attempting to post a comment with extra fields", () => {
            const comment =  {
                username: "butter_bridge",
                body: "A hungry bear doesn't dance",
                beth: "is totally cooool"
            }
            return request(app)
            .post('/api/articles/7/comments')
            .send(comment)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request")
            })
        })
        test('POST 404: responds with an error status and a relevant message when attempting to post a comment by a user that does not exist in the users table', () => {
            const comment =  {
                username: "I DONT EXIST",
                body: "A hungry bear doesn't dance"
            }
            return request(app)
            .post('/api/articles/100/comments')
            .send(comment)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Not Found")
            }) 
        })
        test("POST 404: responds with an error status and a relevant message when attempting to post a comment to an article that does not exist", () => {
            const comment =  {
                username: "butter_bridge",
                body: "A hungry bear doesn't dance"
            }
            return request(app)
            .post('/api/articles/100/comments')
            .send(comment)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Not Found")
            })
        })
    })
})
describe('/api/comments/:comment_id', () => {
    describe('DELETE', () => {
        test('DELETE 204: deletes a specified comment and responds with no content', () => {
            return request(app)
            .delete('/api/comments/18')
            .expect(204)
        })
        test('DELETE 400: responds with an error status and a relevant message when given an invalid comment id', () => {
            return request(app)
            .delete('/api/comments/not-a-number')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request")
            })
        })
        test('DELETE 404: responds with an error status and a relevant message when attempting to delete a comment that does not exist', () => {
            return request(app)
            .delete('/api/comments/50')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Not Found")
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