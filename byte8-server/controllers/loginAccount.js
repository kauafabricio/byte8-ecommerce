import { User } from "../models/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// API POST: login do usuário

const loginAccount = async (req, res) => {
  const { loginEmail, loginPassword } = req.body;

  if (!loginEmail || !loginPassword) {
    return res.status(400).json({ "error": "Preencha todos os campos." });
  }

  try {
    // Verify if user exist
    const user = await User.findOne({ userEmail: loginEmail });
    // Verify if the pass is correct
    const isMatch = await bcrypt.compare(loginPassword, user.userPass);

    if (!user || !isMatch) {
      return res.status(400).json({ "error": "Email ou senha incorretos." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ "token": token });

  } catch (error) {
    res.status(500).json({ "error": "Erro ao autenticar usuário." });
  }
};

export default loginAccount;
