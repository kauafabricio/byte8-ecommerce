import { User } from "../models/models.js";

// API DELETE: remover um endereço do banco de dados do usuário

export default async function deleteAddress(req, res) {
  const { addressid, userid } = req.headers;

  if (userid && addressid) {
    try {
      const user = await User.findById(userid);

      if (user) {
        const updatedUser = await User.findByIdAndUpdate(
          userid,
          { $pull: { userAddress: { _id: addressid } } },
          { new: true }
        );

        if (updatedUser) {
          res.status(200).json({ "userAddress": updatedUser.userAddress });
        } else {
          res.status(500).json({ "error": "Falha ao atualizar o usuário após remover o endereço." });
        }
      } else {
        res.status(404).json({ "error": "Usuário não encontrado!" });
      }
    } catch (error) {
      res.status(500).json({ "error": "Erro ao remover endereço" });
    }
  } else {
    res.status(400).json({ "error": "userid e addressid são obrigatórios!" });
  }
}
