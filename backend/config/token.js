import jwt from "jsonwebtoken";
export const genToken = async (userID) => {
  try {
    return jwt.sign({ userID }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  } catch (error) {
    console.log(`Token generation error : ${error}`);
  }
};
