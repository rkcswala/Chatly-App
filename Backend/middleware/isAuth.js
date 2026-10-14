
import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token =
      req.cookies?.token ||
      (authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token || typeof token !== "string") {
      return res.status(401).json({
        success: false,
        message: "Token is not found",
      });
    }

    const verifytoken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = verifytoken.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default isAuth;
