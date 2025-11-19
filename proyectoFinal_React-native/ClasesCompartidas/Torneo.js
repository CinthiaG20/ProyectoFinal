export class Torneo{
    constructor(nombre,desc,fecha){this.nombre=nombre;this.desc=desc;this.fecha=fecha;this.partidos=[]}
}
export class Partidos{
    constructor(nombre,equipo1,equipo2,fecha,torneo){this.nombre=nombre;this.equipos={equipo1:equipo1,equipo2:equipo2};this.fecha=fecha;this.torneo=torneo,this.resultado=""}
}
export class Equipos{
    constructor(nombre, desc, url){this.nombre=nombre;this.desc=desc;this.url=url}
}