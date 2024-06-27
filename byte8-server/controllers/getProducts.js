import { Product } from "../models/models.js"
import mongoose from "mongoose"

// API GET: acesso aos produtos do Ecommerce

export default async function getProducts (req, res) {
  const id = req.query.id  
  if (id) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      return res.status(404).json({"error": "O ID do produto é inválido."})
    }
    const product = await Product.findOne({_id: id});

    if (product) {
      return res.status(200).json({"product": product})
    } else {
      return res.status(404).json({"error": 'Produto não encontrado.'})
    }
  } else {
    const products = await Product.find({});
    products ? res.status(200).json(products) : res.status(500).json({"error": "Internal server error"})
  }
}
