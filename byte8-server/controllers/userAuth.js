import jwt from "jsonwebtoken"
import { User } from "../models/models.js";

// API GET: autorização do usuário

export default async function userAuth (req, res) {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    const token = authorizationHeader.substring(7); // Remove o "Bearer " do início do token //
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET
      );

      if (decoded) {
        const user = await User.findOne({_id: decoded.id})
        if (user) {
          // Se o token for válido //
          return res.status(200).json({"validToken": true, "userId": user._id, "userName": user.userName, "userBag": user.userBag, "userAddress": user.userAddress, "userOrders": user.userOrders});
        }
      } else {
        // Se o token for inválido //
        return res.json({ "error": true });
      }
    } catch (error) {
      return res.status(500).json({ "error": error.message });
    }
  }
}