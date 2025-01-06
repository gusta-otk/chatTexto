require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const connectDB = require("./config/database");
const chatController = require("./controllers/chatController"); 

// Conecta ao bd - mongo brabo demais
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const nomeSala = "gusta";

// Socket.IO
io.on("connection", (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  socket.on("entrarSala", async ({ usuarionome, meuid }) => {
    try {
      const usuario = await chatController.loginuser({
        id: socket.id,
        nome: usuarionome,
        sala: nomeSala,
        meuid,
      });

      socket.join(nomeSala);

      // ta saindo undefined
      socket.broadcast.to(nomeSala).emit("novaMensagem", {
        usuarioNome: usuario.nome,
        mensagem: "entrou na sala",
      });

      
      const usuarios = await chatController.getUsuariosSala(nomeSala);
      io.to(nomeSala).emit("salaUsuarios", { sala: nomeSala, usuarios });
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error.message);
    }
  });

  socket.on("mensagemChat", async (mensagem) => {
    try {
      const usuario = await chatController.getUsuario(socket.id);
      if (usuario) {
        io.to(nomeSala).emit("novaMensagem", {
          usuarioNome: usuario.nome,
          mensagem,
          horario: new Date().toLocaleString(),
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error.message);
    }
  });

  socket.on("sairSala", async () => {
    try {
      const usuario = await chatController.outUser(socket.id);
      if (usuario) {
        io.to(nomeSala).emit("novaMensagem", {
          usuarioNome: usuario.nome,
          mensagem: "saiu da sala",
        });

        //f5 lista de user na room
        console.log(`usuario kitol: ${socket.id}`)
        const usuarios = await chatController.getUsuariosSala(nomeSala);
        io.to(nomeSala).emit("salaUsuarios", { sala: nomeSala, usuarios });
        
        
      }
    } catch (error) {
      console.error("Erro ao remover usuário:", error.message);
    }
  });
});

server.listen(PORT, () => console.log(`Servidor online na porta http://localhost:${PORT}`));
