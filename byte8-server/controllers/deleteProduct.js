import { User } from "../models/models.js";

// API DELETE: remover um produto da sacola de desejos pelo usuário

const deleteProduct = async (req, res) => {
  const { name, userid } = req.body;

  if (name && userid) {
    try {
      const user = await User.findOne({ _id: userid });

      if (user) {
        user.userBag = user.userBag.filter(item => item.productName !== name);
        await user.save();

        return res.status(200).json({ "message": 'Produto removido com sucesso' });
      } else {
        return res.status(404).json({ "error": 'Usuário não encontrado' });
      }
    } catch (error) {
      return res.status(500).json({ "error": 'Erro ao deletar produto', error });
    }
  } else {
    return res.status(400).json({ "error": 'Dados inválidos' });
  }
}

export default deleteProduct;
