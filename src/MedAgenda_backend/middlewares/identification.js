const jwt = require("jsonwebtoken");

exports.identifier = (req, res, next) => {
  let token;
  if (req.headers.client && req.headers.client === "not-browser") {
    token = req.headers.authorization;
  } else {
    token = req.cookies["Authorization"];
  }

  if (!token) {
    return res
      .status(401)
      .json({success: false, message: "Unauthorized - Missing token!"});
  }

  try {
    const userToken = token.split(" ")[1];
    jwt.verify(userToken, process.env.TOKEN_SECRET, function (err, decode) {
      if (err) {
        return res.status(403).json({success: false, message: err.message});
      } else {
        req.user = decode;
        next(0);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
