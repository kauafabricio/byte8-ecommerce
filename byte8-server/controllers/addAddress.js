import { User } from "../models/models.js";

// API POST: adicionar novo endereço pelo usuário

export default async function addAddress(req, res) {
  try {
    const { userId, street, complement, neighborhood, city, state, cep, country } = req.body;

    if (userId && street && neighborhood && city && state && cep && country) {
      const user = await User.findOne({ _id: userId });

      if (user) {
        user.userAddress.push({
          streetAddress: street,
          complement,
          neighborhood,
          city,
          state,
          postalCode: cep,
          country,
        });

        await user.save();

        res.status(200).json({ "userAddress": user.userAddress });
      } else {
        res.status(404).json({ "message": "Usuário não encontrado!" });
      }
    } else {
      res.status(400).json({ "message": "Todos os campos obrigatórios devem ser preenchidos!" });
    }
  } catch (error) {
    res.status(500).json({ "message": "Erro ao adicionar endereço", error });
  }
}
