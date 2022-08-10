const User = require("../Models/user");
const bcrypt = require("bcrypt");
const emailRegxp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.createRoom = (req, res) => {
  let { id, roomPassword, email } = req.body;
  let errors = [];
  if (!roomPassword) {
    errors.push("roomPassword Required");
  }
  if (!email) {
    errors.push("Email Required");
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  User.findOne({ id: id })
    .then((user) => {
      if (user) {
        return res.status(500).json("Someone is Already Using RoomId");
      } else {
        const user = new User({
          id: id,
          roomPassword: roomPassword,
          email: email,
        });
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(roomPassword, salt, function (err, hash) {
            if (err) throw err;
            user.roomPassword = hash;
            user
              .save()
              .then((response) => {
                res.status(200).json({
                  success: true,
                  result: response,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  errors: [{ error: err }],
                });
              });
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        errors: [{ error: "Something went wrong" }],
      });
    });
};

exports.joinRoom = (req, res) => {
  let { id, roomPassword, email } = req.body;
  let errors = [];
  if (!id) {
    errors.push("Room Id Required");
  }
  if (!roomPassword) {
    errors.push("roomPassword Required");
  }
  if (!email) {
    errors.push("Joinee MailId Required");
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  User.find({ id: id, email: { $in: email } })
    .then((user) => {
      if (!user) {
        res.status(404).json("No Such Room Found");
      } else {
        bcrypt
          .compare(roomPassword, user[0].roomPassword)
          .then((match) => {
            if (!match) {
              return res
                .status(404)
                .json({ errors: [{ roomPassword: "Incorrect Password" }] });
            }
            User.findByIdAndUpdate(user[0]._id)
              .then((user) => {
                res.status(200).json({
                  data: user
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            res.status(502).json({ errors: err });
            console.log(err);
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        errors: [{ error: "Something went wrong" }],
      });
    });
};
