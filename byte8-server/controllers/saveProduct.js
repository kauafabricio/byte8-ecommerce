import { User } from "../models/models.js";

// API POST: adicionar produto na sacola de desejos pelo usuário

export default async function saveProduct(req, res) {
  const { userId, prodId, prodName, prodImg, prodPrice, prodQuantity } = req.body;

  const productQuantity = Number(prodQuantity);
  if (userId && prodId && prodName && prodImg && prodPrice) {
    const product = {
      "productId": prodId,
      "productName": prodName,
      "productImg": prodImg,
      "productPrice": prodPrice,
      productQuantity
    };

    try {
      const user = await User.findById(userId).lean();
      const productExists = user.userBag.some(item => item.productId === prodId);

      if (productExists) {
        res.status(400).json({ "error": "O produto já está na sacola de desejos." });
      } else {
        await User.findByIdAndUpdate(
          userId,
          { $push: { userBag: product } },
          { new: true, useFindAndModify: false }
        );
        res.status(200).json({ "message": `${prodName} foi adicionado na sacola de desejos.` });
      }
    } catch (err) {
      res.status(500).json({ "error": "Não foi possível adicionar o produto na sacola de desejos." });
    }
  } else {
    res.status(400).json({ "error": "Dados incompletos para adicionar o produto na sacola de desejos." });
  }
}
