import {Torneo,Equipos,Partidos} from "../ClasesCompartidas/Torneo"

import {listaTorneos,listaUsuarios,listaEquipos} from "../ClasesCompartidas/achivosTemporales/listas"
export class Manager{
    constructor(){}
    crearTorneo(nombre,desc,fecha){listaTorneos.push(new Torneo(nombre,desc,fecha))}
    definirEquipos(nombre, desc, url){listaEquipos.push(new Equipos(nombre, desc, url))}
    definirPartidos(nombre,equipo1,equipo2,fecha,torneo)
    {
        let partido = new Partidos(nombre,equipo1,equipo2,fecha,torneo)
        for (let i in listaTorneos){
            if(listaTorneos[i].nombre== partido.torneo){
                listaTorneos[i].partidos.push(partido)   
            }
        }

    }
    invitarUsuarios(usuario,torneo){
        
        for (let i in listaUsuarios){
            if(listaUsuarios[i].email == usuario){
                for (let x in listaTorneos){
                    if(listaTorneos[x].nombre==torneo){
                        listaUsuarios[i].torneos.push(listaTorneos[x])
                        console.log(listaUsuarios);
                        
                    }
        }}
    }}
    cargarResultados(resultado,nombre){
        for(let i in listaTorneos)
            { 
                for (let x in listaTorneos[i].partidos){
                    if (listaTorneos[i].partidos[x].nombre==nombre){
                        listaTorneos[i].partidos[x].resultado=resultado;console.log(listaTorneos[i].partidos[x])}}}}}
