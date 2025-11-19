import {Usuario} from "../ClasesCompartidas/usuario"
import {Admin} from "../ClasesCompartidas/Adminn"
import { listaUsuarios } from "@/ClasesCompartidas/achivosTemporales/listas"
export default function Index() {
  let usuario=new Usuario("e","p","manager")
  let admin= new Admin()
  admin.crearUsuario(usuario.email,usuario.password,usuario.rol)
  console.log(listaUsuarios);
  
  return (<></>);
}
