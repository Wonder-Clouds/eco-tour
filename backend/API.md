# Eco Tour - API Documentación
## Itinerary

### Get Itinerary
Estos endpoints nos permite listar los _itinerary_ ya sea todos o solo uno pasando el id
  - Get Itinerary: http://localhost:8000/api/itinerary/
  - Get Itinerary by Id: http://localhost:8000/api/itinerary/d7082bc8-c3a2-4e15-b315-73638b7fb9af

### Post Itinerary
Este endpoint nos permite crear un _itinerary_ pasando en el cuerpo el id del _service_
  - Post Itinerary: http://localhost:8000/api/itinerary/9dbc92c2-94aa-40ed-9f16-77f4a091d633/
      - Body:
          ```json
            {
              "title": "Salida a comer HeladoO",
              "description": "Salimos a comer helado",
              "service": "f10d84ef-a560-4d77-8509-bb0795c1c8b5"
            }
          ```

### Patch Itinerary
Este endpoint nos permite actualizar un _itinerary_ pasando solo lo que se desea actualizar o todo el cuerpo.
  - Patch: http://localhost:8000/api/itinerary/787245ce-db27-4bef-a834-7ad1a2294d70/
    - Body:
        ```json
          {
            "title": "Salida a comer Parrilla"
          }
        ```

### Delete Itinerary
Este endopoint nos permite eliminar un _itinerary_ pasando el id
  - Delete: http://localhost:8000/api/itinerary/9dbc92c2-94aa-40ed-9f16-77f4a091d633/
  
### Action
#### Add Itinerary
Este endpoint nos permite pasar por la url el id del servicio al cual se quiere relacionar durante la creacion de un _itinerary_
  - add-itinerary: `POST` http://localhost:8000/api/itinerary/f10d84ef-a560-4d77-8509-bb0795c1c8b5/add-itinerary/
  - Body: 
    ```json
      {
        "title": "Salida al Parque,
        "description": "Salimos a comer helado"  
      }
    ```
    
## Media

### Get Media
Estos endpoints nos permite poder listar los _media_ ya sea todo los _media_ o solo uno pasando id
  - Get Media: http://localhost:8000/api/media/
  - Get Media by Id: http://localhost:8000/api/media/311d6136-ffe2-4e17-b09a-535cc1880732/

### Delete Media
Este endpoint nos permite eliminar un media pasando el id
  - Delete Media: http://localhost:8000/api/media/f7d12568-ac0a-4087-adb4-5ff6cf277c3b/

### Patch Media
Este endpoint nos permite actualizar un _media_ pasando el id por el url
  - Patch: http://localhost:8000/api/media/311d6136-ffe2-4e17-b09a-535cc1880732/
  - Body: 
  ```json
    {
      "title": "Imagen del tour a Cocalmayo",
      "description": "Es una imagen de Cocalmayo"
    }
  ```

## Data
### Get Data
Estos endpoints nos permite poder listar los _data_ ya sea todo los _data_ o solo uno pasando id
  - Get Data: http://localhost:8000/api/data/
  - Get Data by Id: http://localhost:8000/api/data/632fb9c9-1e72-41a2-85a5-1918186c4f79

### Post Data
Este endpoint nos permite crear un _data_ pasando en el cuerpo el id del _service_
  - Post: http://localhost:8000/api/data/
  - Body: 
  ```json
  {
    "title": "Data 5",
    "description": "Esta es la data 5",
    "service": "f10d84ef-a560-4d77-8509-bb0795c1c8b5"
  }
  ```

### Patch Data
Este endpoint nos permite actualizar un _data_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/data/e13b7892-cf4c-4b24-9646-25f58a84c210/
- Body:
  ```json
	{
		"title": "Data 5",
	  "description": "Esta es la data 5"
	}
  ```

### Delete Data
Este endoint nos permite eliminar un _data_ pasando el id
- Delete: http://localhost:8000/api/data/82dd975d-e723-43f9-aeed-0379f811bfe5/

### Action
#### Add Data
Este endpoint nos permite pasar por la url el id de la _data_ que se quiere relacionar  durante la creacion de  una _data_.
- add-data: `POST` http://127.0.0.1:8000/api/data/f10d84ef-a560-4d77-8509-bb0795c1c8b5/add-data/
- Body:
  ```json
	{
      "title": "Data 5",
      "description": "Esta es la data 5"
	}
  ```

## Service
### Get Service
Estos endpoints nos permite listar los _service_ ya sea todos o solo uno pasando el id
- Get Service: http://localhost:8000/api/service/
- Get Service by Id: http://localhost:8000/api/service/3fc5e9c8-a976-43f5-8c89-ff49d27716ec/

### Post Service
Este endpoint nos permite crear un _service_, en este nos es necesario pasar los valores de los _media, _data_ y _itinerary_
- Post Service: http://localhost:8000/api/service/
- Body:
```json
{
    "title": "Tour 4",
    "duration_value": 2,
    "duration_unit": "days",
    "summary": "Tour 3",
    "includes": "include all",
    "excludes": "excludes all too",
    "type": "group",
    "price": 20.4
}
```

### Patch Service
Este endpoint nos permite actualizar un _service_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/
- Body: 
  ```json
	{
	    "price": 6400 
	}
  ```

### Delete Service
Este endpoint nos permite eliminar un _service_ pasando el id
- Delete: http://localhost:8000/api/service/2d616c5b-13e5-49d6-8568-d20749cc94e3/

### Action
#### Bulk Add Data
Este endpoint nos permite pasar varios _data_ en una sola petición post, todos relacionados al _service_ pasado por la url.
- bulk-add-data: `POST` http://localhost:8000/api/service/7157260c-24d4-4a56-83ed-f9c79862371d/bulk-add-data/
- Body: 
    ```json
       {
        "items": [
              {
                "title": "Información sobre fauna",
                "description": "<p>Datos sobre la fauna local</p>"
              },
              {
                "title": "Información sobre flora",
                "description": "<p>Datos sobre la flora local</p>"
              }
            ]
      }
    ```

#### Bulk Add Itinerary
Este endpoint nos permite pasa varios _itinerary_ en una sola petición post, todos relacionados al _service_ pasado por la url.
- bulk-add-itinerary: `POST` http://localhost:8000/api/service/3fc5e9c8-a976-43f5-8c89-ff49d27716ec/bulk-add-itineraries/
- Body: 
  ```json
    {
      "items": [
        {
          "title": "Día 1 - Llegada",
          "description": "<p>Descripción en HTML del primer día</p>"
        },
        {
          "title": "Día 2 - Exploración",
          "description": "<p>Descripción en HTML del segundo día</p>"
        },
        {
          "title": "Día 3 - Regreso",
          "description": "<p>Descripción en HTML del tercer día</p>"
        }
      ]
    }
    ```

#### Upload Image
Este endpoint nos permite subir una imagen y relacionarla al _service_ pasado por la url, todo lo que se sube aqui esta en categoria _image.
- upload-image: `POST` http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/upload-image/
- Body: Form-Data
    - title: Imagen del tour
    - description: Esta es una imagen del tour
    - file: (Seleccionar archivo de imagen)
  
#### Upload Document
Este endpoint nos permite subir un documento y relacionarlo al _service_ pasado por la url, todo lo que se sube aqui esta en categoria _document_.
- upload-document: `POST` http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/upload-document/
- Body: Form-Data
    - title: Documento del tour
    - description: Este es un documento del tour
    - file: (Seleccionar archivo de documento)

#### Upload Post
Este endpoint nos permite ingresar el link a un articulo, video o cualquier otro recurso externo y relacionarlo al _service_ pasado por la url, todo lo que se sube aqui esta en categoria _post_.
- upload-post: `POST` http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/create-post/
- Body:
  ```json
    {
      "title": "Artículo sobre el tour",
      "description": "Este es un artículo relacionado con el tour",
      "url": "https://example.com/articulo-sobre-el-tour"
    }
  ```

#### Upload Cover
Este endpoint nos permite subir una imagen de portada y relacionarla al _service_ pasado por la url, este tendra el campo _is_cover_ en true.
- upload-cover: `POST` http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/upload-cover/
- Body: Form-Data
    - title: Portada del tour
    - description: Esta es la portada del tour
    - file: (Seleccionar archivo de imagen)

#### Set Cover
Este endpoint nos permite seleccionar una imagen ya subida y ponerla como portada del _service_ pasado por la url, este tendra el campo _is_cover_ en true y todos los demás en false, valida que el id del _media_ este relacionado a este _service_.
- set-cover: `PATCH` http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/set-cover/9c99173c-a927-4fff-9603-9cbb2e97fcfe/
- Body: Vacío

#### All In One Service
Este endpoint nos permite crear un _service_ junto con sus _media_, _data_ e _itinerary_ en una sola petición.
- all-in-one-service: `POST` http://localhost:8000/api/service/all-in-one-service/
- Body: Form-Data
    - title: Tour Completo
    - duration_value: 3
    - duration_unit: days
    - summary: Este es un tour completo con todo incluido
    - includes: Todo incluido
    - excludes: Nada excluido
    - type: private
    - price: 150.0
    - media: (Seleccionar varios archivos de imagen/documento)
    - cover: (Seleccionar archivo de imagen para portada)
    - data: 
      ```json
        [
          {
            "title": "Información sobre el tour",
            "description": "<p>Detalles y datos importantes</p>"
          },
          {
            "title": "Recomendaciones",
            "description": "<p>Qué llevar y cómo prepararse</p>"
          }
        ]
      ```
    - itinerary:
      ```json
        [
          {
            "title": "Día 1 - Introducción",
            "description": "<p>Descripción del primer día</p>"
          },
          {
            "title": "Día 2 - Actividades",
            "description": "<p>Descripción del segundo día</p>"
          }
        ]
      ```

## Package
### Get Package
Estos endpoints nos permite listar los _package_ ya sea todos o solo uno pasando el id
- Get Package: http://localhost:8000/api/package/
- Get Package by Id: http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0

### Post Package
Este endpoint nos permite crear un _package_, en este nos es necesario pasar los valores de los _services_
- Post Package: http://localhost:8000/api/package/
- Body:
```json
{
  "title": "MachiPicchu VIP",
  "description": "Es el plan VIP de Machu Picchu con varias actividades",
  "services": [
    {
      "service_id": "f10d84ef-a560-4d77-8509-bb0795c1c8b5",
      "order": 0
    },
    {
      "service_id": "87f6fc21-9f41-42a0-a7b1-12cf4a8e1ad4",
      "order": 0 
    },
    {
      "service_id": "61f34e3e-00f9-4dd1-bbb2-9bb87bdfe43f",
      "order": 0 
    },
    {
      "service_id": "7157260c-24d4-4a56-83ed-f9c79862371d",
      "order": 0 
    },
    {
      "service_id": "3fc5e9c8-a976-43f5-8c89-ff49d27716ec",
      "order": 0 
    },
    {
      "service_id": "1e4cdb93-fa56-46b8-9803-a3eb848e92af",
      "order": 0 
    }
  ]
}
```

### Patch Package
Este endpoint nos permite actualizar un _package_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0/
  - Body: 
```json
  {
    "services": [
      {
        "service_id": "f10d84ef-a560-4d77-8509-bb0795c1c8b5",
        "order": 1
      },
      {
        "service_id": "87f6fc21-9f41-42a0-a7b1-12cf4a8e1ad4",
        "order": 2 
      },
      {
        "service_id": "61f34e3e-00f9-4dd1-bbb2-9bb87bdfe43f",
        "order": 3
      },
      {
        "service_id": "7157260c-24d4-4a56-83ed-f9c79862371d",
        "order": 4 
      },
      {
        "service_id": "3fc5e9c8-a976-43f5-8c89-ff49d27716ec",
        "order": 5 
      },
      {
        "service_id": "1e4cdb93-fa56-46b8-9803-a3eb848e92af",
        "order": 6 
      }
    ]
  }
```

### Delete Package
Este endpoint nos permite eliminar un _package_ pasando el id
- Delete: http://localhost:8000/api/package/45cd2f9c-57db-4ee3-b5fa-8a801aaac438/

### Action
#### Add Service
Este endpoint nos permite pasar por la url el id del _service_ que se quiere relacionar durante la creacion de un _package_
- add-service: `POST` http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0/add-service/
- Body: 
```json
  {
    "service_id": "f10d84ef-a560-4d77-8509-bb0795c1c8b5",
    "order": 1
  }
```

#### Remove Service
Este endpoint nos permite eliminar la relación de un _service_ dentro de un _package_ pasando ambos ids por la url
- remove-service: `DELETE` http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0/remove-service/61f34e3e-00f9-4dd1-bbb2-9bb87bdfe43f/

#### Update Service Order
Este endpoint nos permite actualizar el orden de un _service_ dentro de un _package_ pasando el id del _package_por la url
- update-service-order: `PATCH` http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0/update-order/
- Body: 
```json
{
  "services": [
    {
      "service_id": "f10d84ef-a560-4d77-8509-bb0795c1c8b5",
      "order": 1
    },
    {
      "service_id": "87f6fc21-9f41-42a0-a7b1-12cf4a8e1ad4",
      "order": 10 
    },
    {
      "service_id": "61f34e3e-00f9-4dd1-bbb2-9bb87bdfe43f",
      "order": 5
    },
    {
      "service_id": "7157260c-24d4-4a56-83ed-f9c79862371d",
      "order": 4 
    },
    {
      "service_id": "3fc5e9c8-a976-43f5-8c89-ff49d27716ec",
      "order": 12
    },
    {
      "service_id": "1e4cdb93-fa56-46b8-9803-a3eb848e92af",
      "order": 6 
    }
  ]
} 
```

#### Detail Duration
Este endpoint nos permite obtener la duración total del _package_ pasando el id por la url
- duration: `GET` http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0/duration/
