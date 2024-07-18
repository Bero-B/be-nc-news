const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("GET", () => {
    test("GET 200: responds with a json containing all the available endpoints that can be used by the user", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(endpoints);
        });
    });
  });
});
describe("/api/topics", () => {
  describe("GET", () => {
    test("GET 200: responds with an array of all topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
  });
});
describe("/api/articles", () => {
  describe("GET", () => {
    describe("GET with no queries", () => {
      test("GET 200: responds with an array of all article objects with the respective comment count for each article", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toHaveLength(13);
            body.articles.forEach((article) => {
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.author).toBe("string");
              expect(typeof article.title).toBe("string");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
              expect(typeof article.comment_count).toBe("number");
            });
          });
      });
      test("GET 200: the array of article objects are sorted by date in a descending order by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
    });
    describe("GET with queries", () => {
      test("?sort_by= responds with an array of articles containing comments and their respective comment count which are sorted by any valid column (article_id, title, topic, author, created_at, comment_count, votes, article_img_url) in a descending order by default", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toHaveLength(13);
            expect(body.articles).toBeSortedBy("comment_count", {
              descending: true,
            });
          });
      });
      test("GET 400: responds with an error status and a relevant message when passed an invalid sort_by query of the same data type", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid_query")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid query");
          });
      });
      test("GET 400: responds with an error status and a relevant message when passed an invalid sort_by query of a different data type", () => {
        return request(app)
          .get("/api/articles?sort_by=3")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid query");
          });
      });
      test("?order=  responds with an array of articles containing comments and their respective comment count sorted by created_at by default and are ordered based on the order query (asc or desc - default being desc)", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toHaveLength(13);
            expect(body.articles).toBeSortedBy("created_at", {
              ascending: true,
            });
          });
      });
      test("GET 400: responds with an error status and a relevant message when passed an invalid order query of the same data type", () => {
        return request(app)
          .get("/api/articles?order=invalid_query")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid query");
          });
      });
      test("GET 400: responds with an error status and a relevant message when passed an invalid order query of a different data type", () => {
        return request(app)
          .get("/api/articles?order=3")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid query");
          });
      });
      test("?sort_by= & order= responds with an array of article objects sorted by any valid column and ordered by the given query (asc or desc)", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toHaveLength(13);
            expect(body.articles).toBeSortedBy("article_id", {
              ascending: true,
            });
          });
      });
      test("GET 400: responds with an error status and a relevant message when one or both of the queries are invalid", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid&order=2")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid query");
          });
      });
      test("?topic= responds with an array of article objects filtered by the topic specified", () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(12)
            body.articles.forEach((article)=> {
                expect(article.topic).toBe('mitch')
            })
        })
      })
      test('?topic= responds with an empty array if the specified topic exists but there are no articles relating to that topic', () => {
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toEqual([])
        })
      })
      test('GET 400: responds with an error status and a relevant message when the specified topic is invalid', () => {
        return request(app)
        .get("/api/articles?topic=4")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid query")
        })
      })
      test('GET 404: responds with an error status and a relevant message when the specified topic does not exist', () => {
        return request(app)
        .get("/api/articles?topic=somethingelse")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not Found")
        })
      })
    });
  });
});
describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("GET 200: responds with an article object with the specified id with a comment_count key representing total count of comments for that article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count:11
          });
        });
    });
    test("GET 200: responds with an article object with the specified id with a comment_count key being 0 if the article does not have any comments", () => {
        return request(app)
          .get("/api/articles/4")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toMatchObject({
              article_id: 4,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count:0
            });
          });
      });
    test("GET 404: responds with an error code and a relevant message when passing an article id that does not exist", () => {
      return request(app)
        .get("/api/articles/9000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("GET 400: responds with an error code and a relevant message when passing an invalid article id", () => {
      return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("PATCH", () => {
    test("PATCH 200: increments the votes of the speficied article if the value in inc_votes is positive and responds with the udpated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 3 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 103,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH 200: decrements the votes of the speficied article if the value in inc_votes is negative and responds with the udpated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -20 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 80,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH 200: responds with the unchanged article, if passed a request body with no fields", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH 200: responds with the updated article based on the inc_votes field and ignores any extra fields inside the request body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: -20,
          body: "something else",
        })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 80,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH 400: responds with an error status and a relevant message when attempting to update an article with a request body with invalid fields", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "word" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("PATCH 404: responds with an error status and a relevant message when attempting to update an article that does not exist", () => {
      return request(app)
        .patch("/api/articles/100")
        .send({ inc_votes: 20 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("PATCH 400: responds with an error status and a relevant message when attempting to update an invalid article", () => {
      return request(app)
        .patch("/api/articles/not-a-number")
        .send({ inc_votes: 3 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});
describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("GET 200: responds with an array of comments for the specified article_id", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(2);
          body.comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(comment.article_id).toBe(3);
          });
        });
    });
    test("GET 200: the array of comments are sorted with most recent comments appearing first", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeSorted({ descending: true });
        });
    });
    test("GET 200: responds with an empty array when the specified article exists but it does not contain any comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("GET 404: responds with an error status and a relevant message when passed an article_id that does not exist", () => {
      return request(app)
        .get("/api/articles/10000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("GET 400: responds with an error status and a relevant message when passed an invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalid_id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("POST", () => {
    test("POST 201: inserts a new comment to the comments table relating to the specified article and responds with the newly posted comment", () => {
      const comment = {
        username: "butter_bridge",
        body: "A hungry bear doesn't dance",
      };
      return request(app)
        .post("/api/articles/7/comments")
        .send(comment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toBe("A hungry bear doesn't dance");
        });
    });
    test("POST 400: responds with an error status and a relevant message when attempting to post a comment with missing fields", () => {
      const comment = {
        username: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/7/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("POST 400: responds with an error status and a relevant message when passing an invalid article_id", () => {
      const comment = {
        username: "butter_bridge",
        body: "A hungry bear doesn't dance",
      };
      return request(app)
        .post("/api/articles/not-a-number/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("POST 400: responds with an error status and a relevant message when attempting to post a comment with extra fields", () => {
      const comment = {
        username: "butter_bridge",
        body: "A hungry bear doesn't dance",
        beth: "is totally cooool",
      };
      return request(app)
        .post("/api/articles/7/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("POST 404: responds with an error status and a relevant message when attempting to post a comment by a user that does not exist in the users table", () => {
      const comment = {
        username: "I DONT EXIST",
        body: "A hungry bear doesn't dance",
      };
      return request(app)
        .post("/api/articles/100/comments")
        .send(comment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("POST 404: responds with an error status and a relevant message when attempting to post a comment to an article that does not exist", () => {
      const comment = {
        username: "butter_bridge",
        body: "A hungry bear doesn't dance",
      };
      return request(app)
        .post("/api/articles/100/comments")
        .send(comment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});
describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("DELETE 204: deletes a specified comment and responds with no content", () => {
      return request(app).delete("/api/comments/18").expect(204);
    });
    test("DELETE 400: responds with an error status and a relevant message when given an invalid comment id", () => {
      return request(app)
        .delete("/api/comments/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("DELETE 404: responds with an error status and a relevant message when attempting to delete a comment that does not exist", () => {
      return request(app)
        .delete("/api/comments/50")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});
describe("/api/users", () => {
  describe("GET", () => {
    test("GET 200: responds with an array of all user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
  });
});
describe('/api/users/:username', () => {
  describe('GET', () => {
    test('GET 200: responds with a user object based on the specified username', () => {
      return request(app)
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({body}) => {
        expect(body.user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        })
      })
    })
    test('GET 404: responds with an error status and a relevant message when the given username does not exist', () => {
      return request(app)
      .get('/api/users/user123')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Not Found')
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
