const heuristica = [[120,-20,20,5,5,20,-20,120],[-20,-40,-5,-5,-5,-5,-40,-20],[20,-5,15,3,3,15,-5,20],[5,-5,3,3,3,3,-5,5],[5,-5,3,3,3,3,-5,5],[20,-5,15,3,3,15,-5,20],[-20,-40,-5,-5,-5,-5,-40,-20],[120,-20,20,5,5,20,-20,120]];
const EMPTY = 2

// 1 BLANCAS
// 0 NEGRAS

const minimax = async (MAX, estado) => {
    const MINI = MAX == 1 ? 0 : 1
    // console.log('max:',MAX,',mini:',MINI)
    // console.log('estado:',estado)
    const data = await restoreMatrix(MAX,estado)
    // console.log('srcPoints:',data.srcPoint)
    const moves = await predictMove(MAX,MINI,data.matrix,data.srcPoint)
    // console.log('Predicted:',moves)
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
const predictMove = async (MAX, MINI, matrix, srcPoint) => {
    let moves = []
    await srcPoint.forEach((point) => {
        let result = getMoves(point.x,point.y,1,0,matrix,MAX,MINI)
        moves = moves.concat(result)

        result = getMoves(point.x,point.y,-1,0,matrix,MAX,MINI)
        moves = moves.concat(result)

        result = getMoves(point.x,point.y,0,1,matrix,MAX,MINI)
        moves = moves.concat(result)

        result = getMoves(point.x,point.y,0,-1,matrix,MAX,MINI)
        moves = moves.concat(result)

        result = getMoves(point.x,point.y,1,1,matrix,MAX,MINI)
        moves = moves.concat(result)

        result = getMoves(point.x,point.y,-1,-1,matrix,MAX,MINI)
        moves = moves.concat(result)
        
        result = getMoves(point.x,point.y,1,-1,matrix,MAX,MINI)
        moves = moves.concat(result)

        result = getMoves(point.x,point.y,-1,1,matrix,MAX,MINI)
        moves = moves.concat(result)
    })
    return  moves
}

const getMoves = (x, y, x_offset, y_offset, matrix, MAX, MINI) => {
    let heu = 0
    const moves = []
    let esValido = false
    // buqueda de movimiento en x+
    while(true){
        // Seguimos iterando mientras sean fichas del adversario
        if( (x + x_offset < 0) || (x + x_offset > 7)) break
        if(matrix[x + x_offset][y + y_offset] != MINI) break
        // Para que un movimiento sea valido debe existir al menos una casilla de MINI(0), entre MAX (1) y la posicion vacia
        // Para que el espacio vacio sea movimiento valido primero tuvo que pasar por un MINI (0)
        // 102
        // En este caso el espacio vacio no es movimineto valido porque no hay ningun MINI(0) entre el espacio vacio y el MAX(1)
        // 122
        esValido = true
        // apoyandonos de la matriz de heuristica sumamos el valor, si excedemos el limite de la matriz enviamos un 0 por default
        heu += heuristica[x + x_offset][y + y_offset] != undefined ? heuristica[x + x_offset][y + y_offset] : 0
        x += x_offset
        y += y_offset
    }
    // buscamos la posicion siguiente
    x += x_offset
    y += y_offset

    // verificar si es un movimiento valido
    if( (x + x_offset < 0) || (x + x_offset > 7)) return []
    if(esValido && matrix[x][y] == EMPTY){
        heu += heuristica[x][y] != undefined ? heuristica[x][y] : 0
        moves.push({x,y,heuristica:heu})
    }
    return moves
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
    console.log('Movimientos-------------------------')
    console.log(moves)
    move = moves[0]
    return move.x +''+move.y
}

module.exports = minimax
