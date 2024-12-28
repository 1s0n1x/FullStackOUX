const jwt = require('jsonwebtoken');
const { error, info } = require(`./logger`);

const requestLogger = (req, res, next) => {
    info(`----------------------------------`);
    info(`Method: ${req.method}`);
    info(`Path: ${req.path}`);
    info(`Body: ${JSON.stringify(req.body)}`);
    info(`----------------------------------`);

    next();
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('Authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        req.token = authorization.substring(7); // Remueve "bearer " y guarda el token
    } else {
        req.token = null; // Si no hay token, define req.token como null
    }
    next();
}

const userExtractor = (req, res, next) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    } else {
        req.user = decodedToken.id;
    }
    next();
};

const unknownEndpoint = (req, res) => {
    res.status(404).json({
        message: "Unknown Endpoint. Check your request."
    })
}

const errorHandler = (err, req, res, next) => {
    switch (err.name) {
        case 'CastError':
            res.status(400).json({ 
                message: 'An error occurred. The request ID is malformed, please check and try again.' 
            });
            break;
        case 'ValidationError':
            res.status(400).json({ 
                message: Object.keys(err.errors).map((v) => { return err.errors[v].message }) 
            });
          break;
        case 'MongoServerError':
            if(err.message.includes('E11000 duplicate key error')) return response.status(400).json({ 
                message: 'expected `username` to be unique' 
            });
            break;
        case 'TokenExpiredError':
            return res.status(401).json({
                message: 'token expired'
            })
            break;
        case 'JsonWebTokenError':
            if(err.message === "jwt must be provided") return res.status(401).json({
                message: 'Unauthorized'
            })
            break;
        default:
            res.status(500).json({ 
                message: 'The server was unable to correctly process this request.' 
            });
            break;
    }

   error(err)
}

module.exports ={
    requestLogger,
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler
}
