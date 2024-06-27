import { User } from "../models/models.js"

// API GET: acesso a sacola de desejos pelo usuário

const getBag = async (req, res) => {
  const userId = req.query.userId

  try {
    const user = await User.findOne({_id: userId})

    if (user) {
      return res.status(200).json({"bag": user.userBag})
    } else {
      return res.status(404).json({"error": "Usuário não encontrado."})
    }
  } catch (err) {
    return res.status(500).json({"error": "Internal server error."})
  }

}

export default getBag;