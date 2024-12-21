require('express-async-errors')

const express = require(`express`);
const mongoose = require(`mongoose`);
const cors = require("cors");

const { info, error } = require(`./utils/logger`);
const { MONGODB_URI, ENVIRONMENT } = require(`./utils/config`);
const { errorHandler, requestLogger, unknownEndpoint } = require(`./utils/middleware`);

const blogsRouter = require(`./controllers/blogs`);
info(`Connecting to MongoDB`)

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)
  .then(() => info(`Connected to MongoDB in ${ENVIRONMENT} mode`))
  .catch(err => error(err))


const server = express();
server.use(cors());
server.use(express.json());
server.use(requestLogger)

server.use(`/api/blogs`, blogsRouter)
server.use(unknownEndpoint);
server.use(errorHandler);

module.exports = server;