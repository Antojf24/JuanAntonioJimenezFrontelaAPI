const contenido = document.querySelector('.contenido');
const select = document.getElementById('select');
const botones = document.getElementsByClassName('opcion');
const buscador = document.getElementById("buscador");
const opciones = ["Small", "Large", "Bird wyvern", "Brute wyvern", "Elder dragon", "Fanged beast", "Fanged wyvern", "Fish", "Flying wyvern", "Herbivore", "Neopteron", "Piscine wyvern", "Relict", "Wingdrake", "All", "Favorites"];
let arrayMonstruos = [];
const enviarNota = document.querySelector('.enviarNota');
const escritor = document.querySelector('.escritor');
const contenidoNotas = document.querySelector('.contenidoNotas');

//Evento que recoge lo que escribes en el buscador
buscador.addEventListener("blur", (f) =>{
    let busqueda = f.target.value;
    busquedaPorBuscador(busqueda);
});

/**
 * Método que recorre el array de monstruos comparando la busqueda, si coincide lo muestra.
 * @param {texto recogido en el evento} busqueda 
 */
function busquedaPorBuscador(busqueda){
    limpiar();
    const url = new URL(`https://mhw-db.com/monsters?q={"name":"${busqueda}"}`);
    fetch(url)
        .then(response => response.json())
        .then(monstruos => {
            for( i = 0; i < monstruos.length; i++){
                crearMonster(monstruos[i]);
            }
        });
}

/**
 * Método que hace una llamada a la api pero que solo recoge los datos filtrados según el boton utilizado.
 * @param {Tipo o especie, segun el criterio por el que se tiene que buscar} categoria 
 * @param {Especie o tipo de monstruos que se quieren filtrar} valor 
 */
function busquedaPorFiltro(categoria,valor){
    limpiar();
    const url = new URL(`https://mhw-db.com/monsters?q={"${categoria}":"${valor}"}`);
    fetch(url)
        .then(response => response.json())
        .then(monstruos => {
            for( i = 0; i < monstruos.length; i++){
                crearMonster(monstruos[i]);
            }
        });
}

//Método que hace una llamada a la api para recoger todos los monstruos.
const getMonsters = async () => {
    limpiar();
    const url = `https://mhw-db.com/monsters/`;
    const data = await fetch(url);
    const monster = await data.json();
    console.log(monster);
    for (let i = 0; i < 60; i++){
        if(monster[i]?.name != undefined){
            arrayMonstruos.push(monster[i]);
            crearMonster(monster[i]);
        }
    }
}

/**
 * Método que crea la carta con los datos del monstruo y lo muestra.
 * @param {JSON del monstruo para crear la carta con los datos del mismo} monster 
 */
function crearMonster(monster){
    const carta = document.createElement('div');
    carta.classList.add('carta');

    const titulo = document.createElement('div');
    titulo.classList.add('titulo-carta');
    titulo.innerHTML = `<h2 id="nombre">${monster.name}</h2> <p>${monster.species}</p>`;
    carta.appendChild(titulo);

    const cuerpo = document.createElement('div');
    cuerpo.classList.add('cuerpo-carta');
    cuerpo.innerHTML = `<p>${monster.description}</p>`;
    carta.appendChild(cuerpo);

    const fav = document.createElement('button');
    fav.classList.add("fav");
    fav.setAttribute("onclick", `favorito(${monster.id})`);
    fav.innerHTML = "Favorito";
    carta.appendChild(fav);

    contenido.appendChild(carta);
}

//Método que limpia el div donde se muestran las cartas de los monstruos.
function limpiar(){
    let contenedor = document.getElementsByClassName('contenido')[0];
    contenedor.innerHTML = "";
}

//Método que crea el selector de filtros.
function crearSelector(){
    const selector = document.querySelector('.selector');

    const selector1 = document.createElement('div');
    selector1.classList.add("selectores");
    selector1.innerHTML = '<p class="tituloSelector">Tipo: </p>';
    const selector2 = document.createElement('div');
    selector2.classList.add("selectores");
    selector2.innerHTML = '<p class="tituloSelector">Especie: </p>';
    const selector3 = document.createElement('div');
    selector3.classList.add("selectores");
    selector3.innerHTML = '<p class="tituloSelector">Otros: </p>';

    for(let i = 0; i <= 1; i++){
        const boton = document.createElement('button');
        boton.classList.add("opcion");
        boton.setAttribute("value", `${i}`);
        boton.innerHTML = `${opciones[i]}`;

        selector1.appendChild(boton);
    }

    for(let i = 2; i <= 13; i++){
        const boton = document.createElement('button');
        boton.classList.add("opcion");
        boton.setAttribute("value", `${i}`);
        boton.innerHTML = `${opciones[i]}`;

        selector2.appendChild(boton);
    }

    for(let i = 14; i <= 15; i++){
        const boton = document.createElement('button');
        boton.classList.add("opcion");
        boton.setAttribute("value", `${i}`);
        boton.innerHTML = `${opciones[i]}`;

        selector3.appendChild(boton);
    }

    selector.appendChild(selector1);
    selector.appendChild(selector2);
    selector.appendChild(selector3);
}

//Método que añade las funciones a los botones para filtrar.
function funciones(){
    for(let i = 0; i < botones.length; i++){
        botones[i].addEventListener("click", (e) =>{
            let valor = e.target.value;
            if(valor == 0 ||valor == 1){
                busquedaPorFiltro("type",e.target.innerHTML);
            }else if(valor == 14){
                getMonsters();
            }else if(valor == 15){
                getFavoritos();
            }else{
                busquedaPorFiltro("species",e.target.innerHTML);
            }
        });
    }
}

/**
 * Método que añade o elimina del localstorage el monstruo añadido a favoritos
 * @param {Id del monstruo} id 
 */
function favorito(id){
    //Saco el monstruo correspondiente al id del array auxiliar;
    let auxMonster;
    for(let element of arrayMonstruos){
        if(element.id == id){
            auxMonster = element;
        }
    }
	if(JSON.stringify(auxMonster) != localStorage.getItem(id)){
        localStorage.setItem(auxMonster.id, JSON.stringify(auxMonster));
    }else{
        localStorage.removeItem(id);
    }
}

//Método que muestra todos los monstruos favoritos añadidos al localstorage.
function getFavoritos(){
    limpiar();
	for(let i = 0; i < 58; i++){
		if(localStorage.getItem(`${i}`)!=null){
		    console.log(localStorage.getItem(`${i}`));
			let jsonMonstruo = localStorage.getItem(`${i}`);
			let monstruo = JSON.parse(jsonMonstruo);
			crearMonster(monstruo); 
		}
	}
}

//Evento que detecta cuando he escrito una nota.
enviarNota.addEventListener("click", () => {
    let valor = escritor.value;
    if(valor.length != 0){
        guardarNota(valor);
        valor == " ";
    }
});

/**
 * Método que guarda la nota en el localStorage y la escribe.
 * @param {nota recogida del evento} nota 
 */
function guardarNota(nota){
    if(localStorage.getItem("notas") != null){
        let listaNotasGuardadas = localStorage.getItem("notas");
        let nuevaCadena = listaNotasGuardadas.concat(nota).concat("||");
        localStorage.setItem("notas", nuevaCadena);
    }else{
        let cadena = String(nota).concat("||");
        localStorage.setItem("notas", cadena);
    }
    getNotas(nota);
}

/**
 * Método que crea el comentario para que sea visible.
 * @param {nota recogida del evento} nota 
 */
function escribirNota(nota){
    const comentario = document.createElement('div');
    comentario.classList.add("comentario");
    comentario.innerHTML = `<p class="nota">${nota}</p>`;

    const eliminar = document.createElement('button');
    eliminar.classList.add("eliminarNota");
    eliminar.innerHTML = "Eliminar";
    eliminar.setAttribute("onclick", `borrarNota("${nota}")`);

    comentario.appendChild(eliminar);
    contenidoNotas.appendChild(comentario);
}

//Método que vuelve a mostrar las notas si se borra alguna.
function getNotas(){
    limpiarNotas();
    if(localStorage.getItem("notas") != null){
        let listaNotasGuardadas = localStorage.getItem("notas");
        let notas = listaNotasGuardadas.split("||");
        notas.pop();
        let nota;
        for(let i = 0; i < notas.length; i++){
            nota = notas[i];
            escribirNota(nota);
        }
    }
}

/**
 * Método que borra la nota correspondiente.
 * @param {nota recogida del evento} nota 
 */
function borrarNota(nota){
    let listaNotasGuardadas = localStorage.getItem("notas");
    let notas = listaNotasGuardadas.split("||");
    notas.pop();
    localStorage.removeItem("notas");
    limpiarNotas();
    for(let notaAux of notas){
        if(notaAux != nota){
            guardarNota(notaAux);
        }
    }
}

//Método que limpia todas las notas.
function limpiarNotas(){
    let contenedor = document.querySelector('.contenidoNotas');
    contenedor.innerHTML = ""; 
}

crearSelector();
funciones();
getMonsters();
getNotas();