import { User } from "../models/models.js";
import bcrypt from "bcrypt";
import validator from "validator"; 

// API POST: registrar um usuário no sistema

const registerAccount = async (req, res) => {
  const { userName, registerEmail, registerPassword, repeatPassword } = req.body;

  if (!userName || !registerEmail || !registerPassword || !repeatPassword) {
    return res.status(400).json({ "error": "Preencha todos os formulários para prosseguir com a operação." });
  }

  if (!validator.isEmail(registerEmail)) {
    return res.status(400).json({ "error": "Email inválido." });
  }

  if (registerPassword !== repeatPassword) {
    return res.status(400).json({ "error": "As senhas não correspondem." });
  }

  try {

    const existingUser = await User.findOne({ userEmail: registerEmail });

    if (existingUser) {
      return res.status(400).json({ "error": "Email já registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerPassword, salt);

    const userCupons = [{
      code: 'BYTE20',
      quantity: 1,
      discount: 20
    }];

    const newUser = new User({
      userName,
      userEmail: registerEmail,
      userPass: hashedPassword,
      userCupons
    });

    await newUser.save();

    res.status(201).json({ "message": "Usuário registrado com sucesso." });

  } catch (error) {
    res.status(500).json({ "error": "Erro ao registrar usuário." });
  }
};

export default registerAccount;
