import { User } from "../models/models.js";

// API POST: processar o uso de cupom no checkout do pedido pelo usuário

export default async function cupomApi(req, res) {
  const { cupom, userId } = req.body;

  try {
    const user = await User.findOne({ _id: userId });

    if (user) {
      if (cupom === 'BYTE20') {
        if (user.userOrders.length > 0) {
          res.status(404).json({ "error": "Este cupom só pode ser utilizado na primeira compra." });
        } else {
          const firstCupom = user.userCupons.find((unit) => unit.code === cupom)
          res.status(200).json({ "userCupom": firstCupom});
        }
      } else {
        const cupomIsValid = user.userCupons.find((unit) => unit.code === cupom);

        if (cupomIsValid) {
          const isQuantityValid = cupomIsValid.quantity >= 1;
          const isExpireValid = new Date(cupomIsValid.expire) > new Date();

          if (isQuantityValid && isExpireValid) {
            const cupomObj = JSON.parse(cupomIsValid)
            res.status(200).json({ "userCupom": cupomObj});
          } else {
            res.status(404).json({ "error": "Cupom inválido." });
          }
        } else {
          res.status(404).json({ "error": "Cupom não encontrado." });
        }
      }
    } else {
      res.status(404).json({ "error": "Usuário não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ "error": "Ocorreu um erro no servidor." });
  }
}
