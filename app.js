const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  


require("./models/Agendamento");
const AgendamentoShema = mongoose.model('Agendamento');

const app = express();
const PORT = 8080;

app.use((req, res, next) =>{
  app.use(cors());
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST');
  next();
  console.log("Conectado Middleware");
});

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/barber', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conectado ao MongoDB!');
    
    app.listen(PORT, () => {
      console.log(`Servidor iniciado na porta ${PORT}`);
    });
  })
  .catch(error => console.error('Erro ao conectar ao MongoDB:', error));

  

/* REQUISIÇÃO QUE VAI NA MODAL */
app.post("/agendamentos", async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body); 
    const novoAgendamento = await AgendamentoShema.create(req.body);
    console.log('Agendamento criado:', novoAgendamento);
    return res.status(201).json({
      error: false,
      message: "Agendado com sucesso",
      data: novoAgendamento
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return res.status(400).json({
      error: true,
      message: "Erro ao agendar",
      detalhes: error.message // Adicione detalhes do erro à resposta
    });
  }
});


/* HORÁRIOS DISPONÍVEIS */

app.get("/horarios", async (req, res) => {
  try {
    const horariosAgendados = await AgendamentoShema.find({}, 'horario'); 
    const horariosDisponiveis = obterHorariosDisponiveis(horariosAgendados);

    return res.json(horariosDisponiveis);
  } catch (error) {
    console.error('Erro ao obter horários disponíveis:', error);
    return res.status(500).json({
      error: true,
      message: "Erro ao obter horários disponíveis"
    });
  }
});

const obterHorariosDisponiveis = (horariosAgendados) => {
  const todosHorarios = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];

  // Extrai os horários da lista de objetos Agendamento
  const horariosAgendadosString = horariosAgendados.map(agendamento => agendamento.horario);

  // Filtra os horários disponíveis
  const horariosDisponiveis = todosHorarios.filter(horario => !horariosAgendadosString.includes(horario));

  return horariosDisponiveis;
};

// CORTES 

/* REQUISIÇÃO QUE VAI PRO ADM */
app.get("/listar", (req, res) => {
  AgendamentoShema.find({}).then((novoAgendamento) => {
    return res.json(novoAgendamento)
  }).catch((erro) => {
    return res.status(400).json({
      error: true,
      message: "Arquivo encontrado!"
    })
  })
});

// REQUISIÇÃO LISTAGEM DE SERVIÇOS 



