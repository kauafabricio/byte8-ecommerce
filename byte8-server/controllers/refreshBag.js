import { User } from "../models/models.js";

// API PUT: atualizar a quantidade do produto da sacola de desejos pelo usuário 

export default async function refreshBag(req, res) {
  const { userId, productId, quantity } = req.body;

  try {
    const user = await User.findOne({ _id: userId });

    if (user) {
      const productIndex =  user.userBag.findIndex((product) => product.productId === productId);

      if (productIndex !== -1) {
        user.userBag[productIndex].productQuantity = quantity;

        await user.save();
        
        res.status(200).json({ "message": 'Sacola atualizada com sucesso.'})
      } else {
        res.status(404).json({ "error": "Produto não encontrado no carrinho do usuário." });
      }
    } else {
      res.status(404).json({ "error": "Usuário não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ "error": "Erro interno do servidor." });
  }
}