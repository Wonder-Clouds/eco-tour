# ECO TOUR
Eco tour es un sistema diseñado para poder gestionar lo siguiente:
- Servicios turísticos
- Reservas de servicios turísticos
- Precios de servicios turísticos
- Un CRM Básico
- Usuarios del sistema
- Roles y permisos
- Reportes
- Un Todo List para la gestión de tareas
- Grupos de usuarios para la gestión en las cotizaciones

## Diagrama de Clases
Para el desarrollo del sistema se ha diseñado el siguiente diagrama de clases:
![Eco Tour.jpg](images/Eco%20Tour.jpg)

## Modulo de Servicios
- El sistema debe poder crear un servicio turístico - DONE
- El sistema debe poder agrupar diferentes servicios para la creación de un paquete - DONE
- El sistema debe poder asignar precio a un servicio turístico - DONE
- El sistema debe poder gestionar diferentes itinerarios para cada servicio turístico - DONE
- El sistema debe poder gestionar diferentes medios (imágenes, videos) para cada servicio turístico - DONE
- El sistema debe poder gestionar diferentes datos adicionales para cada servicio turístico - DONE
- Hay 3 tipos de servicios turísticos: - DONE
  - `private` -> total de personas entre el precio del tour de tipo privado 
  - `group` -> precio por persona en tours de tipo grupal
  - `arbitrary` -> total de personas al mismo tour entre su precio arbitrario
- El sistema debe poder sumar de forma dinámica los precios de los servicios turísticos que componen un paquete - DONE
- El sistema debe poder gestionar la suma de dias y horas de los servicios turísticos que componen un paquete - DONE
- El sistema debe poder gestionar los tours de horas, días o varios días - DONE

## Modulo de Reservas
