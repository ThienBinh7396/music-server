const model = require("../models");
const Helper = require("../helpers/helper");
const Status = require("../helpers/status");

const { Users } = model;

const sequelize = require("sequelize");
const Op = sequelize.Op;

const colors = [
  "#7EDE28",
  "#66CD00",
  "#CDD704",
  "#FF3D0D",
  "#BE2625",
  "#34C2A1",
  "#0FDDAF",
  "#0198E1",
  "#2619EF",
  "#AD0AFD",
  "#F57C00",
  "#E91E63",
  "#FFC107",
  "#005555",
];

console.log(colors[parseInt(Math.random() * colors.length)]);

class UsersController {
  count(req, res) {
    Users.findAll({
      attributes: [[sequelize.fn("count", sequelize.col("*")), "count"]],
    })
      .then((rs) => {
        res.send(Status.getStatus("success", "Successful", rs));
      })
      .catch((err) => {
        res
          .status(200)
          .send(
            Status.getStatus(
              "error",
              err.errors
                ? err.errors.map((it) => it.message)
                : "Something went wrong"
            )
          );
      });
  }

  async getInformationAsync({ id, email }) {
    console.log("iD: ", id, email);

    return new Promise((res) => {
      Users.findOne({
        where: {
          id,
          email,
        },
      })
        .then((user) => {
          res(user);
        })
        .catch((err) => {
          res(null);
        });
    });
  }

  async checkInfor(req, res) {
    let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ["u"]);

    if (!provideAttribute) return;

    let u;
    try {
      u = JSON.parse(Helper.decryptBase64(provideAttribute.u));

      console.log('U: ', u)

      let user = await this.getInformationAsync(u);
      if (user) {
        Object.keys(u).forEach((key) => {
          if (user[key]) {
            u[key] = user[key];
          }
        });

        let storage_u = Helper.encryptBase64(JSON.stringify(u));

        res.send(Status.getStatus("success", "Successful", { u, storage_u }));
      } else {
        res.send(Status.getStatus("error", "Information is invalid"));
      }
    } catch (error) {
      console.log(error);
      res.send(Status.getStatus("error", "Information is invalid"));
    }
  }

  createUser(req, res) {
    let { email, name, password } = req.body;

    return Users.create({
      color: colors[parseInt(Math.random() * colors.length)],
      name: name,
      email: email,
      password: Helper.hashPassword(password),
    })
      .then((rs) => {
        if (rs) {
          let { id, email, name, thumbnail } = rs;

          console.log(id, email, name, thumbnail);
          res.status(200).send(
            Status.getStatus("success", "Successful", {
              id,
              email,
              name,
              thumbnail,
            })
          );
        } else {
          res
            .status(200)
            .send(
              Status.getStatus(
                "warnign",
                "Email is already exists. Something went wrong"
              )
            );
        }
      })
      .catch((err) => {
        res
          .status(200)
          .send(
            Status.getStatus(
              "error",
              err.errors
                ? err.errors.map((it) => it.message)
                : "Something went wrong"
            )
          );
      });
  }

  checkLogin(req, res) {
    const { email, password } = req.body;

    return Users.findOne({
      where: {
        email: email,
        password: Helper.hashPassword(password),
      },
      attributes: [
        "id",
        "email",
        "type",
        "thumbnail",
        "name",
        "color",
        "description",
      ],
    })
      .then((rs) => {
        if (rs) {
          let { id, email, thumbnail, name, color, description } = rs;
          var token = Helper.generateTokenById(
            id,
            "client",
            email,
            thumbnail,
            name
          );
          var u = Helper.encryptBase64(
            JSON.stringify({
              id,
              type: "client",
              email,
              thumbnail,
              name,
              color,
              description,
            })
          );
          res
            .status(200)
            .send(Status.getStatus("success", "Successful", { token, u }));
        } else {
          res
            .status(200)
            .send(Status.getStatus("warning", "Invalid email or password"));
        }
      })
      .catch((err) => {
        res
          .status(200)
          .send(
            Status.getStatus(
              "error",
              err.errors
                ? err.errors.map((it) => it.message)
                : "Something went wrong"
            )
          );
      });
  }

  updateUser(req, res) {
    const { id, name, thumbnail, description, color, banner } = req.body;

    if (!id || id != req.user.id) {
      res.status(200).send(Status.getStatus("error", "Invalid id"));
    } else {
      return Users.findOne({
        where: {
          id: id,
        },
      }).then((user) => {
        user
          .update({
            name: name || user.name,
            thumbnail: thumbnail || user.thumbnail,
            banner: banner || user.banner,
            description: description || user.description,
            color: color || user.color,
          })
          .then((updatedUser) => {
            res
              .status(200)
              .send(
                Status.getStatus(
                  "success",
                  "Update Information Successful!",
                  user
                )
              );
          })
          .catch((err) => {
            res
              .status(200)
              .send(
                Status.getStatus(
                  "error",
                  err.errors
                    ? err.errors.map((it) => it.message)
                    : "Something went wrong"
                )
              );
          });
      });
    }
  }

  findAll(req, res) {
    return Users.findAll({
      attributes: [
        "id",
        "email",
        "type",
        "name",
        "thumbnail",
        "createdAt",
        "updatedAt",
      ],
    })
      .then((rs) => {
        res.send(Status.getStatus("success", "Successful", rs));
      })
      .catch((err) => {
        res.send(
          Status.getStatus(
            "error",
            err.errors
              ? err.errors.map((it) => it.message)
              : "Something went wrong"
          )
        );
      });
  }

  getSuggest(req, res) {
    let provideAttributes = Helper.checkPostProvidedAttribute(req, res, [
      "ignore",
    ]);

    if (!provideAttributes) return;

    return Users.findAll({
      where: {
        id: {
          [Op.notIn]: provideAttributes.ignore,
        },
      },
      limit: 5,
      order: sequelize.literal("random()"),
      attributes: ["id", "name", "email", "thumbnail", "latestOnline"],
    })
      .then((rs) => {
        res.send(Status.getStatus("success", "Successful", rs));
      })
      .catch((err) => {
        res.send(
          Status.getStatus(
            "error",
            err.errors
              ? err.errors.map((it) => it.message)
              : "Something went wrong"
          )
        );
      });
  }
  search(req, res) {
    let provideAttributes = Helper.checkPostProvidedAttribute(req, res, [
      "q",
      "ignore",
    ]);

    if (!provideAttributes) return;

    return Users.findAll({
      where: {
        id: {
          [Op.notIn]: provideAttributes.ignore,
        },
        name: {
          [Op.like]: `%${provideAttributes.q}%`,
        },
      },
      attributes: ["id", "name", "email", "thumbnail", "latestOnline"],
    })
      .then((rs) => {
        res.send(Status.getStatus("success", "Successful", rs));
      })
      .catch((err) => {
        res.send(
          Status.getStatus(
            "error",
            err.errors
              ? err.errors.map((it) => it.message)
              : "Something went wrong"
          )
        );
      });
  }
}

module.exports = new UsersController();
