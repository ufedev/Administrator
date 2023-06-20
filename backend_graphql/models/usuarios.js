const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")
const UsuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
  },
  registro: {
    type: Date,
    default: Date.now(),
  },
})

UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //funciones  de mongoose
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const Usuarios = model("Usuarios", UsuarioSchema)

module.exports = Usuarios
