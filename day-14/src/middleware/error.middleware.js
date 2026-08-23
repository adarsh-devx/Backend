import { config } from "dotenv";

config();

const handleError = (err, req, res, next) => {
  const response = {
    message: err.message,
  };

  if (process.env.NODE_ENVIROMENT === "DEVELOPMENT") {
    response.stack = err.stack;
  }

  res.status(err.status).json(response);
};

export default handleError;
