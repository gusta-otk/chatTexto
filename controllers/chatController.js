const Usuario = require("../models/user.js");

async function loginuser({ id, nome, sala, meuid }) {
  if (!id || !nome || !sala || !meuid) {
    throw new Error("Todos os parâmetros (id, nome, sala, meuid) são obrigatórios.");
  }

  const usuario = new Usuario({ id, nome, sala, meuid });
  await usuario.save(); // Salva o usuário no MongoDB
  return usuario;
}

/**
 * Remove um usuario da sala e do banco de dados.
 * @param {string} id
 * @returns {object|null} - Usuario removido ou null se nao encontrado.
 */
async function outUser(id) {
  const usuario = await Usuario.findOneAndDelete({ id });
  return usuario;
}

/**
 * Obtém os usuários de uma sala específica.
 * @param {string} sala - Nome da sala.
 * @returns {Array} 
 */

async function getUsuariosSala(sala) {
  return await Usuario.find({ sala });
}

/**
 * Obtém um usuário pelo ID do socket.
 * @param {string} id
 * @returns {object|null}
 */

async function getUsuario(id) {
  return await Usuario.findOne({ id });
}

module.exports = {
  loginuser,
  outUser,
  getUsuariosSala,
  getUsuario,
};
