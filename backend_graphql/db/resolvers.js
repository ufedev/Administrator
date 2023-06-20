const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Usuarios = require("../models/usuarios")
const Proyectos = require("../models/proyectos")
const Tareas = require("../models/tareas")

const resolvers = {
  Query: {
    obtenerProyectos: async (_, { input }, context) => {
      const { usuario } = context
      try {
        const proyectos = await Proyectos.find({ creador: usuario.id })
        return proyectos
      } catch (e) {
        throw new Error("Sucedio algo inesperado")
      }
    },
    obtenerTareas: async (_, { proyecto }, context) => {
      const { usuario } = context

      if (usuario) {
        try {
          const tareas = await Tareas.find({ usuario: usuario.id, proyecto })

          return tareas
        } catch (err) {
          throw new Error("Ocurrio algo inesperado")
        }
      } else {
        throw new Error("Debe iniciar sesión")
      }
    },
    sesionActiva: async (_, {}, context) => {
      const { usuario } = context

      if (usuario) {
        return {
          status: 200,
        }
      }
      return {
        status: 404,
      }
    },
  },

  Mutation: {
    crearUsuario: async (_, { input }, context) => {
      // devuelve 4 valores el primero (_) es el root, el segundo {input} es un objeto que obtiene datos en este caso extraemos input o como lo llamemos, el tercero es el context que se comparte en todas las funciones del schema
      //console.log(input)
      try {
        const existeUsuario = await Usuarios.findOne({ email: input.email })
        if (existeUsuario) {
          return { msj: "El usuario ya existe", status: 409 }
        }

        const usuario = new Usuarios(input)
        if (await usuario.save()) {
          return { msj: "usuario creado", status: 200 }
        }
      } catch (err) {
        console.log(err)
        return "Hubo un error"
      }
    },
    autenticarUsuario: async (_, { input }, context) => {
      try {
        const existeUsuario = await Usuarios.findOne({ email: input.email })

        if (existeUsuario) {
          const compare = await bcrypt.compare(
            input.password,
            existeUsuario.password
          )

          if (!compare) {
            throw new Error("Email o contraseña incorrectos")
          }

          const token = await jwt.sign(
            {
              id: existeUsuario.id,
              email: existeUsuario.email,
            },
            "HolaMundoPrivateKey",
            {
              expiresIn: "1h",
            }
          )
          return {
            token,
          }
        } else {
          throw new Error("No Existe")
        }
      } catch (err) {
        console.log(err)

        throw new Error("Verifique Usuario y Contraseña")
      }
    },

    crearProyecto: async (_, { input }, context) => {
      const { usuario } = context

      if (usuario) {
        try {
          const p = {
            nombre: input.nombre,
            creador: usuario.id,
          }
          const proyecto = new Proyectos(p)

          const crearProyecto = await proyecto.save()
          return crearProyecto
        } catch (err) {
          console.log(err)
        }
      } else {
        throw new Error("Usuario no válido")
      }
    },

    modificarProyecto: async (_, { input }, context) => {
      const { usuario } = context

      if (usuario) {
        try {
          const { id, nombre } = input

          const proyecto = await Proyectos.findById(id)

          if (proyecto.creador.toString() === usuario.id.toString()) {
            proyecto.nombre = nombre
            await proyecto.save()
            return proyecto
          }

          throw new Error("")
        } catch (err) {
          console.log(err)
          throw new Error("Usuario no válido")
        }
      } else {
        throw new Error("Debe iniciar sesión")
      }
    },
    eliminarProyecto: async (_, { id }, context) => {
      const { usuario } = context

      if (usuario) {
        try {
          const proyecto = await Proyectos.findById(id)

          if (proyecto.creador.toString() === usuario.id) {
            await proyecto.deleteOne()
            return "Proyecto Eliminado"
          }

          throw new Error("")
        } catch (err) {
          console.log(err)
          throw new Error("Usuario no válido")
        }
      } else {
        throw new Error("Debe iniciar sesión")
      }
    },

    // Tareas!! CRUD

    crearTarea: async (_, { input }, context) => {
      const { usuario } = context
      if (usuario) {
        try {
          const { proyecto, nombre } = input
          const nuevaTarea = new Tareas({
            nombre,
            proyecto,
            usuario: usuario.id,
          })

          const tareaGuardada = await nuevaTarea.save()

          return tareaGuardada
        } catch (err) {
          throw new Error("Algo salio mal")
        }
      } else {
        throw new Error("Debe inciar sesión")
      }
    },
    modificarTarea: async (_, { input }, context) => {
      const { usuario } = context

      if (usuario) {
        const { id, nombre } = input
        const tarea = await Tareas.findById(id)

        if (tarea.usuario?.toString() === usuario.id.toString()) {
          tarea.nombre = nombre
          tarea.save()

          return tarea
        } else {
          throw new Error("Solo la puede modificar el usuario creador")
        }
      } else {
        throw new Error("Debe iniciar sesión")
      }
    },
    completarTarea: async (_, { id }, context) => {
      const { usuario } = context
      if (usuario) {
        const tarea = await Tareas.findById(id)

        if (tarea.usuario?.toString() === usuario.id.toString()) {
          tarea.realizada = true
          tarea.save()

          return tarea
        } else {
          throw new Error("Solo la puede modificar el usuario creador")
        }
      } else {
        throw new Error("Debe iniciar sesión")
      }
    },
    eliminarTarea: async (_, { id }, context) => {
      const { usuario } = context
      if (usuario) {
        const tarea = await Tareas.findById(id)
        if (tarea.usuario.toString() === usuario.id.toString()) {
          await tarea.deleteOne()

          return "Tarea Eliminada"
        } else {
          throw new Error("Solo la puede modificar el usuario creador")
        }
      } else {
        throw new Error("Debe iniciar sesión")
      }
    },
  },
}

module.exports = { resolvers }
