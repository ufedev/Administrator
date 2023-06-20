const { Schema, model } = require("mongoose")

const ProyectoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  creador: {
    type: Schema.Types.ObjectId,
    ref: "Usuarios",
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
})

ProyectoSchema.pre("save", function (next) {
  this.creado = Date.now()
  next()
})

const Proyectos = model("Proyectos", ProyectoSchema)

module.exports = Proyectos
