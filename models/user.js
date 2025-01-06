const mongoose = require("mongoose");
// esquema do usuário
const UsuarioSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nome: { type: String, required: true },
  sala: { type: String, required: true },
  meuid: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
