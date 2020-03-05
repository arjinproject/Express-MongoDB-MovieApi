const express = require('express');
const router = express.Router();

//Models
const Movie = require('../models/Movie');

/* GET users listing. */
router.get("/", (req, res) => {
  const promise = Movie.find({});
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// top 10 list
router.get("/top3", (req, res) => {
  const promise = Movie.find({})
    .limit(3)
    .sort({ imdb_score: -1 });
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

router.get("/:movie_id", (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);
  promise.then((movie) => {
    if (movie != null)
      res.json(movie);
    next({ message: 'This movie wasnt found', code: 673 });
  }).catch((err) => {
    res.json(err);
  });
});

router.put("/:movie_id", (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body, {
      new: true
    }
  );
  promise.then((movie) => {
    if (movie != null)
      res.json(movie);
    next({ message: 'This movie wasnt found', code: 673 });
  }).catch((err) => {
    res.json(err);
  });
});

router.delete("/:movie_id", (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);
  promise.then((movie) => {
    if (movie != null)
      res.send("deleted");
    next({ message: 'This movie wasnt found', code: 673 });
  }).catch((err) => {
    res.json(err);
  });
});

router.post('/', (req, res, next) => {
  // const { title, imdb_score, category, country, year } = req.body;
  // const movie = new Movie({
  //   title: title,
  //   imdb_score: imdb_score,
  //   category: category,
  //   country: country,
  //   year: year,
  // });

  // yukarıdaki yorum bloğunu kısaca şu şekilde yazabiiriz
  const movie = new Movie(req.body);

  // movie.save((err, data) => {
  //   if (err)
  //     res.json(err);
  //   res.json(data);
  // });

  // Promise yapısı ile yukarıdaki yapıyı yeniden yazalım
  const promise = movie.save();
  promise.then((data) => {
    res.json({ status: 1 });
  }).catch((err) => {
    res.json(err);
  });
});

module.exports = router;
