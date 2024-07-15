function customErrors(err, req, res, next) {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
  }
  function psqlErrors(err, req, res, next) {
    if (err.code === "23502" || err.code === "22P02") {
      res.status(400).send({ msg: "Bad request" });
    } else if (err.code === "23503") {
      res.status(404).send({ msg: "Not Found" });
    }
  }
  function invalidEndpoint(req, res, next) {
    res.status(404).send({ msg: "Invalid Endpoint" });
  }
  
  module.exports = { customErrors, psqlErrors, invalidEndpoint };