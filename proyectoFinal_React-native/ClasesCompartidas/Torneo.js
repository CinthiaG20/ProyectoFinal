export class Torneo{
    constructor(nombre,desc,fecha){this.nombre=nombre;this.desc=desc;this.fecha=fecha;this.partidos=[]}
}
export class Partidos{
    constructor(nombre,equipo,fecha,torneo){this.nombre=nombre;this.equipo=equipo;this.fecha=fecha;this.torneo=torneo}
}
export class Equipos{
    constructor(nombre, desc, url){this.nombre=nombre;this.desc=desc;this.url=url}
}