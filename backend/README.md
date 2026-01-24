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

## Modulo Usuarios
- El sistema debe permitir la creación de usuarios con diferentes roles y permisos - PENDING
- El sistema debe permitir la autenticación de usuarios - PENDING
- El sistema debe permitir la gestión de perfiles de usuario - PENDING
- El sistema debe permitir la asignación de roles y permisos a los usuarios - PENDING

## Módulo de Servicios
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
- El sistema debe poder gestionar la suma de días y horas de los servicios turísticos que componen un paquete - DONE
- El sistema debe poder gestionar los tours de horas, días o varios días - DONE
- El sistema debe poder hacer filtros para servicios y paquetes: - DONE
  - Rango de precios - DONE
  - Duración del tour - PENDING
  - Tipo de servicio turístico - PENDING
- El sistema debe poder buscar por nombre de servicio turístico o paquete turístico - PENDING
- Los precios de los servicios turísticos deben ser dinámicos por mes - PENDING

#### TODO:
- Desplegar después de la entrega del módulo de servicios - PENDIENTE

## Modulo de Reservas
- El módulo de reservas debe permitir crear una reserva de forma individual
- Durante la creación de una reserva, un cliente puede seleccionar uno o varios servicios turísticos o paquetes turísticos
- Una reserva debe contener un cliente optando por n...* servicios turísticos o paquetes turísticos
- El sistema debe permitir seleccionar la fecha y hora de la actividad turística durante la creación de la reserva
- El sistema debe poder que a una reserva ya hecha se pueda agregar un pasajero más con actividades compartidas y otras extras y separadas.
- Antes de confirmar la reserva, el sistema debe verificar la disponibilidad del servicio turístico o paquete turístico en la fecha y hora seleccionadas
- El sistema en reservas debe permitir gestionar propuestas o cotizaciones antes de la confirmación de la reserva
- El sistema debe calcular el precio total de la reserva con base en los servicios turísticos o paquetes turísticos seleccionados
- El sistema debe permitir gestionar el estado de la reserva (pendiente, confirmada, cancelada, completada)
- Versionar las reservas para llevar un control de los cambios realizados en las mismas o para cada cliente o usuarios
- Modificar durante el versionado de una reserva los servicios turísticos o paquetes turísticos seleccionados
- Modificar durante el versionado de una reserva la fecha y hora de la actividad turística
- Modificar durante el versionado de una reserva el estado de la reserva
- Durante la creación de la reserva, se debe poder asignar diferentes fechas o hasta con dias de descanso sin actividad entre actividades, esto por cada reserva individual/personalizada
- Debe poderse agregar un costo extra por viajero en caso de viajes, vuelos y otras actividades que lo requieran

## Módulo de Operaciones
