const userService = require('../services/userService');


async function register(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const isPasswordValid = await userService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = userService.generateToken(user.id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function updateUserById(req, res) {
  const { id } = req.params;
  const userData = req.body;

  try {
    const updatedUser = await userService.updateUser(id, userData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteUserById(req, res) {
  const { id } = req.params;

  try {
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
  updateUserById,
  deleteUserById,
};