const heuristica = [[120,-20,20,5,5,20,-20,120],[-20,-40,-5,-5,-5,-5,-40,-20],[20,-5,15,3,3,15,-5,20],[5,-5,3,3,3,3,-5,5],[5,-5,3,3,3,3,-5,5],[20,-5,15,3,3,15,-5,20],[-20,-40,-5,-5,-5,-5,-40,-20],[120,-20,20,5,5,20,-20,120]];
const EMPTY = 2

// 1 BLANCAS
// 0 NEGRAS

const minimax = async (MAX, estado) => {
    const MINI = MAX == 1 ? 0 : 1
    console.log('max:',MAX,',mini:',MINI)
    // console.log('estado:',estado)
    const data = await restoreMatrix(MAX,estado)
    console.log('srcPoints:',data.srcPoint)
    const moves = await getMoves(MAX,MINI,data.matrix,data.srcPoint)
    return await getBestMove(moves)
};

const restoreMatrix = async (MAX,estado) => {
    const srcPoint =  []
    const matrix = [[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2]];
    for( i=0; i<8; i++){
        for(j=0;j<8;j++){
            let value = parseInt(estado[i*8+j])
            matrix[i][j]= value
            if(value == MAX) srcPoint.push({x:i,y:j})
        }
    }
    // Puntos originales, comprueban que la matrix haya sido restaurada correctamente
    // console.log(matrix[3][3],matrix[3][4])
    // console.log(matrix[4][3],matrix[4][4])
    return {
        matrix,
        srcPoint
    }
}

/*
 busqueda de movimientos en x+
 1. Ver si la posicion x + 1, y es adversario
 2. Si es adversario volver a iterar
 3. Se sale porque ya no encuentra adversarios entonces, comprobar si la posicion siguiente:
    > Es un espacio vacio -> agregar la posicon
    > Es una ficha del mismo color -> descartar la posicion
    > Es undefiend es decir se sale del tablero -> descarta la posicion
*/
const getMoves = async (MAX, MINI, matrix, srcPoint) => {
    const moves = []
    let esValido = false
    let heu = 0
    srcPoint.forEach(point => {
        esValido = false

        // coordenadas del punto
        let x = point.x
        let y = point.y

        // variables auxiliares para iterar
        let x_aux = x
        let y_aux = y

        // buqueda de movimiento en x+
        while(true){
            // Seguimos iterando mientras sean fichas del adversario
            if(matrix[x_aux + 1][y] != MINI) break
            // Para que un movimiento sea valido debe existir al menos una casilla de MINI(0), entre MAX (1) y la posicion vacia
            // Para que el espacio vacio sea movimiento valido primero tuvo que pasar por un MINI (0)
            // 102
            // En este caso el espacio vacio no es movimineto valido porque no hay ningun MINI(0) entre el espacio vacio y el MAX(1)
            // 122
            esValido = true
            // apoyandonos de la matriz de heuristica sumamos el valor, si excedemos el limite de la matriz enviamos un 0 por default
            heu += heuristica[x_aux + 1][y] != undefined ? heuristica[x_aux + 1][y] : 0
            x_aux++
        }
        // buscamos la posicion siguiente
        x_aux ++
        // verificar si es un movimiento valido
        if(esValido && matrix[x_aux][y] == EMPTY){
            heu += heuristica[x_aux][y] != undefined ? heuristica[x_aux][y] : 0
            moves.push({x:x_aux,y,heuristica:heu})
        }

        
        // restablecer el valores de variables
        esValido = false
        heu = 0
        x_aux = x
        // busqueda de movimientos en x-
        while(true){
            if(matrix[x_aux - 1][y] != MINI) break
            esValido = true
            heu += heuristica[x_aux - 1][y] != undefined ? heuristica[x_aux - 1][y] : 0
            heu += 200
            x_aux--
        }
        // buscamos la posicion siguiente
        x_aux --
        // verificar si es un movimiento valido
        if(esValido && matrix[x_aux][y] == EMPTY){
            heu += heuristica[x_aux][y] != undefined ? heuristica[x_aux][y] : 0
            moves.push({x:x_aux,y,heuristica:heu})
        }


        // restablecer el valores de variables
        esValido = false
        heu = 0
        // busqueda de movimientos en y+
        while(true){
            if(matrix[x][y_aux + 1] != MINI) break
            esValido = true
            heu += heuristica[x][y_aux + 1] != undefined ? heuristica[x][y_aux + 1] : 0
            y_aux++
        }
        // buscamos la posicion siguiente
        y_aux ++
        // verificar si es un movimiento valido
        if(esValido && matrix[x][y_aux] == EMPTY){
            heu += heuristica[x][y_aux] != undefined ? heuristica[x][y_aux] : 0
            moves.push({x,y:y_aux,heuristica:heu})
        }


        // restablecer el valores de variables
        esValido = false
        heu = 0
        y_aux = y
        // busqueda de movimientos en y-
        while(true){
            if(matrix[x][y_aux - 1] != MINI) break
            esValido = true
            heu += heuristica[x][y_aux - 1] != undefined ? heuristica[x][y_aux - 1] : 0
            y_aux--
        }
        // buscamos la posicion siguiente
        y_aux --
        // verificar si es un movimiento valido
        if(esValido && matrix[x][y_aux] == EMPTY){
            heu += heuristica[x][y_aux] != undefined ? heuristica[x][y_aux] : 0
            moves.push({x,y:y_aux,heuristica:heu})
        }


        // restablecer el valores de variables
        esValido = false
        heu = 0
        y_aux = y
        x_aux = x
        // busqueda de movimientos en x+,y+
        while(true){
            if(matrix[x_aux + 1][y_aux + 1] != MINI) break
            esValido = true
            heu += heuristica[x_aux + 1][y_aux + 1] != undefined ? heuristica[x_aux + 1][y_aux + 1] : 0
            x_aux++
            y_aux++
        }
        // buscamos la posicion siguiente
        x_aux++
        y_aux++
        // verificar si es un movimiento valido
        if(esValido && matrix[x_aux][y_aux] == EMPTY){
            heu += heuristica[x_aux][y_aux] != undefined ? heuristica[x_aux][y_aux] : 0
            moves.push({x:x_aux,y:y_aux,heuristica:heu})
        }


        // restablecer el valores de variables
        esValido = false
        heu = 0
        y_aux = y
        x_aux = x
        // busqueda de movimientos en x-,y-
        while(true){
            if(matrix[x_aux - 1][y_aux - 1] != MINI) break
            esValido = true
            heu += heuristica[x_aux - 1][y_aux - 1] != undefined ? heuristica[x_aux - 1][y_aux - 1] : 0
            x_aux--
            y_aux--
        }
        // buscamos la posicion siguiente
        x_aux--
        y_aux--
        // verificar si es un movimiento valido
        if(esValido && matrix[x_aux][y_aux] == EMPTY){
            heu += heuristica[x_aux][y_aux] != undefined ? heuristica[x_aux][y_aux] : 0
            moves.push({x:x_aux,y:y_aux,heuristica:heu})
        }


        // restablecer el valores de variables
        esValido = false
        heu = 0
        y_aux = y
        x_aux = x
        // busqueda de movimientos en x-,y+
        while(true){
            if(matrix[x_aux - 1][y_aux + 1] != MINI) break
            esValido = true
            heu += heuristica[x_aux - 1][y_aux + 1] != undefined ? heuristica[x_aux - 1][y_aux + 1] : 0
            x_aux--
            y_aux++
        }
        // buscamos la posicion siguiente
        x_aux--
        y_aux++
        // verificar si es un movimiento valido
        if(esValido && matrix[x_aux][y_aux] == EMPTY){
            heu += heuristica[x_aux][y_aux] != undefined ? heuristica[x_aux][y_aux] : 0
            moves.push({x:x_aux,y:y_aux,heuristica:heu})
        }


        // restablecer el valores de variables
        esValido = false
        heu = 0
        y_aux = y
        x_aux = x
        // busqueda de movimientos en x+,y-
        while(true){
            if(matrix[x_aux + 1][y_aux - 1] != MINI) break
            esValido = true
            heu += heuristica[x_aux + 1][y_aux - 1] != undefined ? heuristica[x_aux + 1][y_aux - 1] : 0
            x_aux++
            y_aux--
        }
        // buscamos la posicion siguiente
        x_aux++
        y_aux--
        // verificar si es un movimiento valido
        if(esValido && matrix[x_aux][y_aux] == EMPTY){
            heu += heuristica[x_aux][y_aux] != undefined ? heuristica[x_aux][y_aux] : 0
            moves.push({x:x_aux,y:y_aux,heuristica:heu})
        }
    });
    return  moves
}

const getBestMove = (moves) => {
    moves.sort((a, b) => {
        // a es mayor que b según criterio de ordenamiento
        if (a.heuristica > b.heuristica) {
            return -1;
        }
        // a es menor que b según criterio de ordenamiento
        if (a.heuristica < b.heuristica) {
          return 1;
        }
        // a debe ser igual b
        return 0;
    })
    move = moves[0]
    return move.x +''+move.y
}

module.exports = minimax
