const mongoose = require('mongoose');

const horariosDisponiveis = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];


const AgendamentoSchema = new mongoose.Schema({
  cliente: {
    type: String,
    required: true,
  },
  servico: {
    type: String,
    require: true,
  },
  data: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return horariosDisponiveis.includes(value);
      },
      message: (props) => `${props.value} não é um horário disponível.`,
    },
  },
},
{
  timestamps: true,
});

AgendamentoSchema.pre('save', async function (next) {
  const horarioAgendado = this.data;

  const horariosDisponiveisCopy = horariosDisponiveis.slice();

  if (horariosDisponiveisCopy.includes(horarioAgendado)) {

    const index = horariosDisponiveisCopy.indexOf(horarioAgendado);
    horariosDisponiveisCopy.splice(index, 1);

    horariosDisponiveis.length = 0;
    Array.prototype.push.apply(horariosDisponiveis, horariosDisponiveisCopy);

    next();
  } else {
    return next(new Error(`${horarioAgendado} não é um horário disponível.`));
  }
});

mongoose.model('Agendamento', AgendamentoSchema);
