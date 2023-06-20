const { Schema, model } = require("mongoose")

const TareaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  proyecto: {
    type: Schema.Types.ObjectId,
    ref: "Proyectos",
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuarios",
  },
  realizada: {
    type: Boolean,
    default: false,
  },
})

const Tareas = model("Tareas", TareaSchema)

module.exports = Tareas
