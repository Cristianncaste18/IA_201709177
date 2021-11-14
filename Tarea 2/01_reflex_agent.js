function drawBrackground(canvas, ctx, room){
	ctx.drawImage(room.img,0,0,room.width,room.height);
	ctx.drawImage(room.img,canvas.width/2,0,room.width,room.height);
}

function render(canvas, ctx, elements){
	// Cleans de canva
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw assets
	drawBrackground(canvas,ctx,elements[0])

	// Load game variables
	let location = states[0]
	let state = states[0] == 'A'? states[1] : states[2]

	// Display the dirty room
	if( states[1] == 'DIRTY') ctx.drawImage(elements[2].img,elements[2].x,elements[2].y, elements[2].width, elements[2].height);
	if( states[2] == 'DIRTY') ctx.drawImage(elements[2].img,elements[2].x  + canvas.width/2,elements[2].y, elements[2].width, elements[2].height);

	// Draws the vacuum depending on the states actual location
	if(location == 'A'){
		ctx.drawImage(elements[1].img,elements[1].x,elements[1].y, elements[1].width, elements[1].height);
	} else {
		ctx.drawImage(elements[1].img,elements[1].x + canvas.width/2, elements[1].y,elements[1].width, elements[1].height);
	}

	let action_result = reflex_agent(location,state)
	const actual_state = getState(states)
    contador(actual_state)

	if (action_result == "CLEAN"){
		if (location == "A"){
			states[1] = "CLEAN"
		}else if(location == "B"){ 
		   	states[2] = "CLEAN"
		};
	}
	else if (action_result == "RIGHT") states[0] = "B";
	else if (action_result == "LEFT") states[0] = "A";

	if(actual_state == 8) ensuciar()
	if(end_game()) clearInterval(id_interval_render_g)	
}

// Starts the agent
window.onload = ()=>{
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d")

	const room = {
		x: 0,
		y: 0,
		width: canvas.width/2,
		height: canvas.height,
		img: document.getElementById('room')
	}
	
	const vacuum = {
		x: 40,
		y: 85,
		width: 50,
		height: 45,
		img: document.getElementById('vacuum')
	};

	const dirty = {
		x: 39,
		y: 90,
		width: 50,
		height: 45,
		img: document.getElementById('dirty')
	};
	
	const id_interval_render = setInterval(()=>render(canvas, ctx, [room, vacuum, dirty]), 2000);
	id_interval_render_g = id_interval_render

}

let id_interval_render_g = 0


/** Game logic **/

const contador_estados = [0,0,0,0,0,0,0,0]
	
/** states
 * First parameter is the vacuum location
 * Second parameter is the actual state of A room
 * Third paramenter is the actual state of B room
*/	
const states = ["A","DIRTY","DIRTY"];

function reflex_agent(location, state){
    if (state == "DIRTY"){
      return "CLEAN"
    }else if (location == "A"){
      return "RIGHT"
    }else if (location == "B"){
      return "LEFT"
    }
}

function ensuciar() {
	states[1] = Math.round(Math.random() * 1) == 0 ? "CLEAN" : "DIRTY";
	states[2] = Math.round(Math.random() * 1) == 0 ? "CLEAN" : "DIRTY";
	console.log("Working "+ states[1]+" "+states[2]);
}

function getState(states) {
	let habitacion = states[0] == "A" ? 0 : 4;
	let estadoA = states[1] == "CLEAN" ? true : false; 
	let estadoB = states[2] == "CLEAN" ? true : false
	if(!estadoA && !estadoB){
	  	return habitacion + 1
	}else if(!estadoA && estadoB){
	  	return habitacion + 2
	}else if(estadoA && !estadoB){
	  	return habitacion + 3
	}else if(estadoA && estadoB){
	  	return habitacion + 4
	}
}

function contador(num){
	switch (num) {
		case 1:
			contador_estados[0]++;
			document.getElementById("1").innerHTML = contador_estados[0];
			break;
		case 2:
			contador_estados[1]++;
			document.getElementById("2").innerHTML = contador_estados[1];
			break;
		case 3:
			contador_estados[2]++;
			document.getElementById("3").innerHTML = contador_estados[2];
			break;
		case 4:
			contador_estados[3]++;
			document.getElementById("4").innerHTML = contador_estados[3];
			break;
		case 5:
			contador_estados[4]++;
			document.getElementById("5").innerHTML = contador_estados[4];
			break;
		case 6:
			contador_estados[5]++;
			document.getElementById("6").innerHTML = contador_estados[5];
			break;
		case 7:
			contador_estados[6]++;
			document.getElementById("7").innerHTML = contador_estados[6];
			break;
		case 8:
			contador_estados[7]++;
			document.getElementById("8").innerHTML = contador_estados[7];
		break;
	}
}

function end_game(){
	let end = true
	for(i in contador_estados){
		if(i<2) end = false
	}
	return end
}