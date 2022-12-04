const routerUsers = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  createUser, login, getUser, updateUser,
} = require('../controllers/users');

routerUsers.post('/signup', celebrate({
  /*  #swagger.parameters['obj'] = {
               in: 'body',
               schema: {
                   $name: 'Jhon Doe',
                   $email: 'test@gmail.com',
                   $password: '12345a'
               }
       } */
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Email введен в некорректно');
    }),
    password: Joi.string().required(),
  }),
}), createUser);
routerUsers.post('/signin', celebrate({
  /*  #swagger.parameters['obj'] = {
              in: 'body',
              schema: {
                  $email: 'test@gmail.com',
                  $password: '12345a'
              }
      } */
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
routerUsers.use(auth);
routerUsers.get('/users/me', getUser);
routerUsers.patch('/users/me', celebrate({
  /*  #swagger.parameters['obj'] = {
              in: 'body',
              schema: {
                  $name: 'Jhon Doe',
                  $email: 'test@gmail.com',
              }
      } */
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = routerUsers;
