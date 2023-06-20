const typeDefs = `#graphql

    # Types
    type Token{
        token:String
    }

    type Proyecto{
        nombre:String
        id:ID
    }

    type Mensaje{
        msj:String
        status:Int
    }
    type Tarea{
        id:ID
        nombre:String
    }
    type TareaFull{
        id:ID
        nombre:String
        realizada:Boolean
    }
    type Status{
        status:Int
    }
    # Type Query GET
    type Query{
        obtenerProyectos:[Proyecto]
        obtenerTareas(proyecto:ID):[TareaFull]
        sesionActiva:Status
    }

    # Inputs
    input UsuarioInput{
        nombre: String!
        email:String!
        password:String!
    }

    input UsuarioAuth{
        email:String!
        password:String!
    }
    
    input ProyectoInput{
        nombre: String!
        
    }
    
    input ProyectoUpdateInput{
        id:ID,
        nombre: String
    }

    input TareaInput{
        proyecto:String
        nombre:String
    }
    input TareaInputUpdate{
        id:ID,
        nombre:String
    }
    
    # Type mutation POST
    type Mutation{
        crearUsuario(input:UsuarioInput):Mensaje
        autenticarUsuario(input:UsuarioAuth):Token
        crearProyecto(input:ProyectoInput):Proyecto
        modificarProyecto(input:ProyectoUpdateInput):Proyecto
        eliminarProyecto(id:ID):String
        crearTarea(input:TareaInput):Tarea
        modificarTarea(input:TareaInputUpdate):Tarea
        completarTarea(id:ID):Tarea
        eliminarTarea(id:ID):String
    }
`

module.exports = { typeDefs }
