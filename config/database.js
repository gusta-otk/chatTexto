const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI; //estava dando erro, pocivelmente pelo require da biblioteca no server

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.log(MONGO_URI)
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
