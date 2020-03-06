const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Models
const Director = require('../models/Director');

/* GET users listing. */
// // sadece yönetmenleri getirir
// router.get("/", (req, res) => {
//   const promise = Director.find({});
//   promise.then((data) => {
//     res.json(data);
//   }).catch((err) => {
//     res.json(err);
//   });
// });

// yönetmenleri filmleriyle beraber getirir
router.get("/", (req, res) => {
  const promise = Director.aggregate([
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true, // filmi olmayan yönetmenleri de getirmek için bu satır eklendi
      }
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          name: "$name",
          surname: "$surname",
          bio: "$bio",
        },
        movies: {
          $push: "$movies"
        }
      }
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        surname: "$_id.surname",
        bio: "$_id.bio",
        movies: "$movies"
      }

    }
  ]);
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// get one director info with movies
router.get("/:director_id", (req, res) => {
  const promise = Director.aggregate([
    {
      $match: {
        "_id": mongoose.Types.ObjectId(req.params.director_id)
      }
    },
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "director_id",
        as: "movies"
      }
    },
    {
      $unwind: {
        path: "$movies",
        preserveNullAndEmptyArrays: true, // filmi olmayan yönetmenleri de getirmek için bu satır eklendi
      }
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          name: "$name",
          surname: "$surname",
          bio: "$bio",
        },
        movies: {
          $push: "$movies"
        }
      }
    },
    {
      $project: {
        _id: "$_id._id",
        name: "$_id.name",
        surname: "$_id.surname",
        bio: "$_id.bio",
        movies: "$movies"
      }

    }
  ]);
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// // sadece tek bir yönetmeni getirir
// router.get("/:director_id", (req, res, next) => {
//   const promise = Director.findById(req.params.director_id);
//   promise.then((director) => {
//     if (director != null)
//       res.json(director);
//     next({ message: 'This movie wasnt found', code: 673 });
//   }).catch((err) => {
//     res.json(err);
//   });
// });

router.put("/:director_id", (req, res, next) => {
  const promise = Director.findByIdAndUpdate(
    req.params.director_id,
    req.body, {
      new: true
    }
  );
  promise.then((director) => {
    if (director != null)
      res.json(director);
    next({ message: 'This director wasnt found', code: 673 });
  }).catch((err) => {
    res.json(err);
  });
});

router.delete("/:director_id", (req, res, next) => {
  const promise = Director.findByIdAndRemove(req.params.director_id);
  promise.then((director) => {
    if (director != null)
      res.send("deleted");
    next({ message: 'This movie wasnt found', code: 673 });
  }).catch((err) => {
    res.json(err);
  });
}); 

router.post('/', (req, res, next) => {

  const director = new Director(req.body);

  const promise = director.save();
  promise.then((data) => {
    res.json({ status: 1 });
  }).catch((err) => {
    res.json(err);
  });
});

module.exports = router;
