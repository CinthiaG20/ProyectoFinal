# Proyecto de curso DWYM 2025 sem. 2

Este repositorio contiene el código de referencia para el proyecto final del curso de Desarrollo Web y Mobile, edición 2do semestre de 2025.

El planteo del proyecto se encuentra en [`./docs/DWYM-Proyecto-2025sem2.pdf`](./docs/DWYM-Proyecto-2025sem2.pdf). En la carpeta `./docs/designs/mobile` se encuentran los diseños para el rol de usuario [_gambler_](./docs/designs/mobile/GamblerMobileDesign.png). En la carpeta `./docs/designs/web` se encuentran los diseños para los roles de usuario [_manager_](./docs/designs/web/ManagerWebDesign.png) y [_admin_](./docs/designs/web/AdminWebDesign.png). El rol de _gambler_ en _web_ debe basarse en el de _mobile_.

## Inicio

Forkear el repo e invitar al resto del equipo como colaboradores. Instalar las dependencias con `npm i`.

## Paquete `/packages/api`

La implementación del backend para la aplicación utiliza [SQLite](https://www.sqlite.org/) como base de datos. Éste es un motor de bases de datos relacionados embebible. Ergo no se necesita instalar, configurar ni ejecutar un motor de base de datos por separado.

La documentación de la API se encuentra en un anexo del [planteo del curso](./docs/DWYM-Proyecto-2025sem2.pdf).

Para ejecutarlo, hacer una copia del archivo [`./packages/api/.env.example`](./packages/api/.env.example) como `.env`. Se ejecuta el servidor con `npm start`. Si no hay una base de datos creada, se creará un archivo `.db` en `./packages/api/data`.

## Paquete `/package/web`

La implementación del frontend web usa [Vite](https://vite.dev/). Para iniciar el servidor de debugging se hace `npm start`. Por defecto se activa un plugin de Vite llamado `testApi` que levanta un servidor privado de debugging, disponible en la misma URL de base que la web. Si se copia el archivo `.env.example` se pueden redefinir la URL de base de la API y la _key_ que se utiliza.

## Actualización del _fork_

Si se modifica el código en el repo original, se puede actualizar el fork con los siguientes comandos:

+ Respaldar el estado actual del repo forkeado.

+ Conectar su fork con el repo original: `git remote add upstream https://github.com/ucu-fit-dwym/dwym-project-2025sem2.git`

+ Verificar que upstream haya sido agregado: `git remote -v`

+ Traer los cambios de main upstream a su repo local: `git fetch upstream main`

+ Ccambiar a su rama local main: `git checkout main`

+ Hacer merge de los cambios: `git merge upstream/main`

_Fin_