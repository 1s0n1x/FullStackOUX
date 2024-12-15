const { error, info } = require(`./logger`);

const requestLogger = (req, res, next) => {
    info(`----------------------------------`);
    info(`Method: ${req.method}`);
    info(`Path: ${req.path}`);
    info(`Body: ${JSON.stringify(req.body)}`);
    info(`----------------------------------`);

    next();
}

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
    unknownEndpoint,
    errorHandler
}
