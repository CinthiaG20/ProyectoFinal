import { Manager } from "./Manager";
import { Usuario } from "./usuario";
import {Gambler} from "./Gamblers"
import {listaTorneos,listaUsuarios} from "./achivosTemporales/listas"
export class Admin{
    constructor(){}
    crearUsuario(email,password,rol)
    {
        if (rol.toLowerCase()=="admin"){listaUsuarios.push(new Usuario(email,password,new Admin()))}   
        else if(rol.toLowerCase() =="manager"){listaUsuarios.push( new Usuario(email,password,new Manager()))}
        else if (rol.toLowerCase()=="gambler"){listaUsuarios.push( new Usuario(email,password,new Gambler()))}
    }
    
    modificarUsuario(email,password,opcion,texto){
        for (let i in listaUsuarios){
        if(listaUsuarios[i].email==email && listaUsuarios[i].password==password){
            if (opcion=="password"){
                listaUsuarios[i].password=texto;
            }
            else if(opcion=="rol"){
                if(texto=="admin"){listaUsuarios[i].rol=new Admin()}
                if(texto=="manager"){listaUsuarios[i].rol=new Manager()}
                if(texto=="gambler"){listaUsuarios[i].rol=new Gambler()}
            }
        }
        }
    }
    borrarUsuario(email){
        for (let i in listaUsuarios){
        if(listaUsuarios[i].email==email){
            listaUsuarios.splice(i,1);
            console.log(listaUsuarios);
            
    }}}
}
