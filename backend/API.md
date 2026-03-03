# Eco Tour - API Documentación

## Autenticación
La API utiliza autenticación basada en tokens. Para obtener un token, envía una solicitud POST al siguiente endpoint con las credenciales de usuario:
### Get Token
Para este endpoint se debe enviar las credenciales de un usuario ya creado en el sistema para obtener el token de autenticación.
- token: `POST` http://localhost:8000/api/token/
- Body: 
  ```json
  {
    "username": "tu_usuario",
    "password": "tu_contraseña"
  }
  ```
- Respuesta:
  ```json
  {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3MDkwODE5NSwiaWF0IjoxNzcwMzAzMzk1LCJqdGkiOiI5YTBlYWY4MjJmMmE0ODNmYWYwN2YwNmNhYWMwOGMxNSIsInVzZXJfaWQiOiIxIn0.BAun8aqbQCLY-M6vNrdbN9zd3r6xmzgap2VxY89QcrU",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcwMzA2OTk1LCJpYXQiOjE3NzAzMDMzOTUsImp0aSI6IjFmN2MwYmNmODExMDQxMzI4OTg0Y2QyNjQ2ZDdiODMwIiwidXNlcl9pZCI6IjEifQ.-64DvAK7J47y_gqqu5NmrzcoShogfnWVCzOOpKlbxt8"
  }
  ```

### Refresh Token
Para este endpoint se debe enviar el token de refresco obtenido en el paso anterior para obtener un nuevo token de acceso.
- refresh: `POST` http://localhost:8000/api/token//refresh/
- Body:
  ```json
  {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3MDE1NTY0NywiaWF0IjoxNzY5NTUwODQ3LCJqdGkiOiJkZmMzMDJkYmVkNTA0OGI2YThkZDMxZWQxOTYxOTJjMCIsInVzZXJfaWQiOiIxIn0.2Rt54pNB8HojbXQf9j8ZjBZFVsvrf2THaGgBplIvEu0"
  }
  ```
- Respuesta:
  ```json
  {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcwMzA3MjM0LCJpYXQiOjE3NzAzMDM2MzQsImp0aSI6IjRjNWE4OTQ0ZDhhZjQ5YjU5ZWUxZDdlYzY4M2E1ZGJhIiwidXNlcl9pZCI6IjEifQ.5iagooC_u5Mgb_N28L5BUW3CwDQOFnZq1ibAC_nHRdQ"
  }
  ```

### Verify Token
Para este endpoint se debe enviar el token de acceso para verificar su validez.
- verify: `POST` http://localhost:8000/api/token//verify/
- Body:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY5NTU0NDQ3LCJpYXQiOjE3Njk1NTA4NDcsImp0aSI6IjYzY2YyZGI3LWY0ZTItNDI3Yi1iZjhiLTU3ZGI3Y2E3Y2E0NyIsInVzZXJfaWQiOiIxIn0.o8kVbX1jz4Z8KX1F1Z5xX9ZkY1j3QF1Z5xX9ZkY1j3QF1Z5xX9ZkY1j3QF1Z5xX9ZkY1j3QF1Z5xX9ZkY"
  }
  ```
- Respuesta: Código de estado `200 OK`

>A partir de ahora todos los endpoints requieren el token de acceso en el encabezado de autorización:
> Authorization: Bearer <tu_token_de_acceso>
> Reemplaza <tu_token_de_acceso> con el token obtenido en el paso de autenticación.

## Itinerary

### Get Itinerary
Estos endpoints nos permite listar los _itinerary_ ya sea todos o solo uno pasando el id
  - Get Itinerary: http://localhost:8000/api/itinerary/
  - Get Itinerary by Id: http://localhost:8000/api/itinerary/d7082bc8-c3a2-4e15-b315-73638b7fb9af
- Respuesta:
  ```json
  {
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": "6415afe9-4b4e-4d4e-acea-96a715d734fe",
        "title": "Dia 1: Viaje a Aguas Calientes",
        "description": "<p>Traslado&nbsp;desde&nbsp;Cusco&nbsp;hacia&nbsp;la&nbsp;estación&nbsp;de&nbsp;tren&nbsp;y&nbsp;viaje&nbsp;panorámico&nbsp;hasta&nbsp;Aguas&nbsp;Calientes.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;descanso&nbsp;y&nbsp;aclimatación.</p>",
        "service": "b881501f-7335-42f8-a8a5-5e36e6aa6af1",
        "created_at": "2026-01-30T02:13:30.758655Z",
        "updated_at": "2026-01-30T02:36:59.768525Z"
      },
      ...
    ]
  }
  ```

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
  - Respuesta:
    ```json
    {
    "id": "f9215f7e-ec66-4d8f-a16a-eb755367b892",
    "title": "Salida a comer HeladoO",
    "description": "Salimos a comer helado",
    "service": "757d6e95-1bd0-401a-aa6a-2d18721a4706",
    "created_at": "2026-02-05T15:05:33.691389Z",
    "updated_at": "2026-02-05T15:05:33.691404Z"
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
  - Respuesta: 
    ```json
      {
        "id": "f9215f7e-ec66-4d8f-a16a-eb755367b892",
        "title": "Salida a comer Parrilla",
        "description": "Salimos a comer helado",
        "service": "757d6e95-1bd0-401a-aa6a-2d18721a4706",
        "created_at": "2026-02-05T15:05:33.691389Z",
        "updated_at": "2026-02-05T15:05:33.691404Z"
      }
    ```

### Delete Itinerary
Este endopoint nos permite eliminar un _itinerary_ pasando el id
  - Delete: http://localhost:8000/api/itinerary/9dbc92c2-94aa-40ed-9f16-77f4a091d633/
  - Respuesta: Código de estado `204 No Content`
  
### Action
#### Add Itinerary
Este endpoint nos permite pasar por la url el id del servicio al cual se quiere relacionar durante la creación de un _itinerary_
  - add-itinerary: `POST` http://localhost:8000/api/itinerary/f10d84ef-a560-4d77-8509-bb0795c1c8b5/add-itinerary/
  - Body: 
    ```json
      {
        "title": "Salida al Parque",
        "description": "Salimos a comer helado"  
      }
    ```
  - Respuesta: 
    ```json
    {
      "id": "7c81823e-d45f-480d-9374-0222b3e13814",
      "title": "Salida a comer Helado 2",
      "description": "Salimos a comer helado",
      "service": "757d6e95-1bd0-401a-aa6a-2d18721a4706",
      "created_at": "2026-02-05T15:10:06.302587Z",
      "updated_at": "2026-02-05T15:10:06.302599Z"
    }
    ```
## Media

### Get Media
Estos endpoints nos permite poder listar los _media_ ya sea todo los _media_ o solo uno pasando id
  - Get Media: http://localhost:8000/api/media/
  - Get Media by Id: http://localhost:8000/api/media/311d6136-ffe2-4e17-b09a-535cc1880732/
  - Respuesta:
    ```json
      {
        "count": 13,
        "next": "http://localhost:8000/api/media/?limit=10&offset=10",
        "previous": null,
        "results": [
          {
            "id": "8a7b253e-6e10-4026-b9b9-8dac356cffbf",
            "type_media": "image",
            "file": "http://localhost:8000/media_files/media/2026/02/01/Espacioimpro_negativo.png",
            "url": null,
            "is_cover": false,
            "created_at": "2026-02-01T05:05:44.190192Z",
            "updated_at": "2026-02-01T15:13:53.766115Z",
            "title": "Foto de Perfil",
            "description": "Esta es la foto del colegio"
          },
          ...
        ]
      }
    ```


### Delete Media
Este endpoint nos permite eliminar un media pasando el id
  - Delete Media: http://localhost:8000/api/media/f7d12568-ac0a-4087-adb4-5ff6cf277c3b/
  - Respuesta:
  - Código de estado `204 No Content`

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
  - Respuesta: 
    ```json
    {
      "id": "8a7b253e-6e10-4026-b9b9-8dac356cffbf",
      "type_media": "image",
      "file": "http://localhost:8000/media_files/media/2026/02/01/Espacioimpro_negativo.png",
      "url": null,
      "is_cover": false,
      "created_at": "2026-02-01T05:05:44.190192Z",
      "updated_at": "2026-02-05T17:41:55.432874Z",
      "title": "Imagen del tour a Cocalmayo",
      "description": "Es una imagen de Cocalmayo"
    }
    ```


## Data
### Get Data
Estos endpoints nos permite poder listar los _data_ ya sea todo los _data_ o solo uno pasando id
  - Get Data: http://localhost:8000/api/data/
  - Get Data by Id: http://localhost:8000/api/data/632fb9c9-1e72-41a2-85a5-1918186c4f79
    - Respuesta:
    ```json
      {
      "count": 5,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "2d866d0c-45a0-44ad-a75c-8f049f67c80b",
          "title": "Historia de Machu Picchu",
          "description": "<ul><li>Machu&nbsp;Picchu&nbsp;fue&nbsp;construida&nbsp;en&nbsp;el&nbsp;siglo&nbsp;XV&nbsp;durante&nbsp;el&nbsp;gobierno&nbsp;del&nbsp;Inca&nbsp;Pachacútec.&nbsp;Es&nbsp;considerada&nbsp;una&nbsp;obra&nbsp;maestra&nbsp;de&nbsp;la&nbsp;arquitectura&nbsp;e&nbsp;ingeniería&nbsp;inca,&nbsp;adaptada&nbsp;perfectamente&nbsp;a&nbsp;la&nbsp;geografía&nbsp;montañosa.</li></ul>",
          "service": "b881501f-7335-42f8-a8a5-5e36e6aa6af1",
          "created_at": "2026-01-30T02:13:30.760516Z",
          "updated_at": "2026-01-30T02:37:06.786470Z"
        }, 
      ...
       ] 
      }
    ```

### Post Data
Este endpoint nos permite crear una _data_ pasando en el cuerpo el id del _service_
  - Post: http://localhost:8000/api/data/
  - Body: 
    ```json
    {
      "title": "Data 5",
      "description": "Esta es la data 5",
      "service": "f10d84ef-a560-4d77-8509-bb0795c1c8b5"
    }
    ```
  - Respuesta:
    ```json
    {
      "id": "e13b7892-cf4c-4b24-9646-25f58a84c210",
      "title": "Data 5",
      "description": "Esta es la data 5",
      "service": "f10d84ef-a560-4d77-8509-bb0795c1c8b5",
      "created_at": "2026-02-05T16:20:45.123456Z",
      "updated_at": "2026-02-05T16:20:45.123456Z"
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
- Respuesta:
  ```json
  {
    "id": "e13b7892-cf4c-4b24-9646-25f58a84c210",
    "title": "Data 5",
    "description": "Esta es la data 5",
    "service": "f10d84ef-a560-4d77-8509-bb0795c1c8b5",
    "created_at": "2026-02-05T16:20:45.123456Z",
    "updated_at": "2026-02-05T16:30:00.654321Z"
  }
  ```

### Delete Data
Este endoint nos permite eliminar un _data_ pasando el id
- Delete: http://localhost:8000/api/data/82dd975d-e723-43f9-aeed-0379f811bfe5/
- Respuesta: Código de estado `204 No Content`

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
- Respuesta:
    ```json
    {
        "id": "e13b7892-cf4c-4b24-9646-25f58a84c210",
        "title": "Data 5",
        "description": "Esta es la data 5",
        "service": "f10d84ef-a560-4d77-8509-bb0795c1c8b5",
        "created_at": "2026-02-05T16:20:45.123456Z",
        "updated_at": "2026-02-05T16:20:45.123456Z"
    }
    ```

## Price Rule
Este endpoint nos permite manejar de forma más eficiente las reglas de precios para los tours de tipo grupal y privado, teniendo en el caso de tours privados la posibilidad de tener valores para `multiply` y `divide`, asi teniendo un mejor control de costos al momento de crear las cotizaciones. Para los tours grupales en este caso solo tendrían un PriceRule con el concepto de `multiply`.
### Get PriceRule
Estos endpoints nos permite listar los _price_rule_ ya sea todos o solo uno pasando el id
- Get PriceRule: http://localhost:8000/api/price-rule/
- Get PriceRule by Id: http://localhost:8000/api/price-rule/1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6/
- Respuesta: 
  ```json
  {
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": "0225c4e2-5b5b-403c-a9e9-711db0ab0b15",
        "service": "31032927-4533-4f0e-8e3f-f836eaeb2ddd",
        "concept": "Comida",
        "amount": "50.00",
        "calculation_type": "multiply",
        "created_at": "2026-02-05T20:57:43.953155Z",
        "updated_at": "2026-02-05T20:57:43.953167Z"
      },
      ...
    ]
  }
  ```
### Post PriceRule
Este endpoint nos permite crear un _price_rule_ pasando en el cuerpo el id del _service_
- Post PriceRule: http://localhost:8000/api/price-rule/
- Body:
  ```json
  {
    "service": "31032927-4533-4f0e-8e3f-f836eaeb2ddd",
    "concept": "Comida",
    "calculation_type": "multiply",
    "amount": 50
  }
  ```
- Respuesta:
  ```json
  {
    "id":"0225c4e2-5b5b-403c-a9e9-711db0ab0b15",
    "service":"31032927-4533-4f0e-8e3f-f836eaeb2ddd",
    "concept":"Comida",
    "amount":"50.00",
    "calculation_type":"multiply",
    "created_at":"2026-02-05T20:57:43.953155Z",
    "updated_at":"2026-02-05T20:57:43.953167Z"
  } 
  ```

### Patch PriceRule
Este endpoint nos permite actualizar un _price_rule_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/price-rule/0225c4e2-5b5b-403c-a9e9-711db0ab0b15/
- Body:
    ```json
    {
      "concept": "Carpas"
    }
    ```
- Respuesta: 
  ```json
  {
    "id": "0225c4e2-5b5b-403c-a9e9-711db0ab0b15",
    "concept": "Carpas",
    "amount": "50.00",
    "calculation_type": "multiply",
    "created_at": "2026-02-05T20:57:43.953155Z",
    "updated_at": "2026-02-05T21:07:52.829691Z"
  }
  ```

### Delete PriceRule
Este endpoint nos permite eliminar un _price_rule_ pasando el id
- Delete: http://localhost:8000/api/price-rule/0225c4e2-5b5b-403c-a9e9-711db0ab0b15/
- Respuesta: Código de estado `204 No Content`

### Action
#### Add PriceRule
Este endpoint nos permite pasar por la url el id del servicio al cual se quiere relacionar durante la creación de un _price_rule_
- add-price-rule: `POST` http://localhost:8000/api/price-rule/31032927-4533-4f0e-8e3f-f836eaeb2ddd/add-price-rule/
- Body:
  ```json
  {
    "concept": "Tour",
    "calculation_type": "multiply",
    "amount": 500
  }
  ```
- Respuesta: 
  ```json
  {
    "concept": "Tour",
    "amount": "300.00",
    "calculation_type": "multiply",
    "service": "31032927-4533-4f0e-8e3f-f836eaeb2ddd",
    "created_at": "2026-02-06T15:49:34.136138Z",
    "updated_at": "2026-02-06T15:49:34.136152Z"
  }
  ```

## Pricing Tier
Este endpoint nos permite manejar de forma más eficiente las reglas de precios para los tours de tipo arbitrario, en este caso este endpoint nos permite crear precios con base en rangos de personas.
### Get PricingTier
Estos endpoints nos permite listar los _pricing_tier_ ya sea todos o solo uno pasando el id
- Get PricingTier: http://localhost:8000/api/pricing-tier/
- Get PricingTier by Id: http://localhost:8000/api/pricing-tier/1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6/
- Respuesta: 
  ```json
  {
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": "b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6",
        "service": "31032927-4533-4f0e-8e3f-f836eaeb2ddd",
        "min_people": 1,
        "max_people": 5,
        "total_price": "500.00",
        "created_at": "2026-02-05T21:30:12.345678Z",
        "updated_at": "2026-02-05T21:30:12.345678Z"
      },
      ...
    ]
  }
  ```

### Post PricingTier
Este endpoint nos permite crear un _pricing_tier_ pasando en el cuerpo el id del _service_
- Post PricingTier: http://localhost:8000/api/pricing-tier/
- Body:
  ```json
  {
    "service": "31032927-4533-4f0e-8e3f-f836eaeb2ddd",
    "min_people": 1,
    "max_people": 5,
    "total_price": 500
  }
  ```
- Respuesta:
    ```json
    {
        "id":"b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6",
        "service":"31032927-4533-4f0e-8e3f-f836eaeb2ddd",
        "min_people":1,
        "max_people":5,
        "total_price":"500.00",
        "created_at":"2026-02-05T21:30:12.345678Z",
        "updated_at":"2026-02-05T21:30:12.345678Z"
    } 
    ```

### Patch PricingTier
Este endpoint nos permite actualizar un _pricing_tier_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/pricing-tier/b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6/
- Body:
  ```json
    {
      "total_price": 600
    }
  ```

### Delete PricingTier
Este endpoint nos permite eliminar un _pricing_tier_ pasando el id
- Delete: http://localhost:8000/api/pricing-tier/b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6/
- Respuesta: Código de estado `204 No Content`

### Action
#### Add PricingTier
Este endpoint nos permite pasar por la url el id del servicio al cual se quiere relacionar durante la creación de un _pricing_tier_
- add-pricing-tier: `POST` http://localhost:8000/api/pricing-tier/31032927-4533-4f0e-8e3f-f836eaeb2ddd/add-pricing-tier/
- Body:
  ```json
  {
    "min_people": 6,
    "max_people": 10,
    "total_price": 900
  }
  ```
- Respuesta: 
  ```json
  {
    "service": "31032927-4533-4f0e-8e3f-f836eaeb2ddd",
    "min_people": 6,
    "max_people": 10,
    "total_price": "900.00",
    "created_at": "2026-02-06T16:00:00.123456Z",
    "updated_at": "2026-02-06T16:00:00.123456Z"
  }
  ```

## Tag
Este módulo nos permite manejar las etiquetas para los servicios, con el fin de poder categorizar y filtrar los servicios de una mejor manera.
### Get Tag
Estos endpoints nos permite listar los _tag_ ya sea todos o solo uno pasando el id
- Get Tag: http://localhost:8000/api/tag/
- Get Tag by Id: http://127.0.0.1:8000/api/tag/fb997f80-ec11-42e7-b248-c868501aadf2
- Respuesta:
  ```json
  {
    "count": 3,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": "fb997f80-ec11-42e7-b248-c868501aadf2",
        "name": "Aventura",
        "created_at": "2026-02-05T21:45:00.123456Z",
        "updated_at": "2026-02-05T21:45:00.123456Z"
      },
      ...
    ]
  }
  ```

### Post Tag
Este endpoint nos permite crear un _tag_
- Post Tag: http://localhost:8000/api/tag/
- Body:
  ```json
  {
    "name": "Cultural"
  }
  ```
- Respuesta:
  ```json
  {
    "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    "name": "Cultural",
    "created_at": "2026-02-05T21:50:00.123456Z",
    "updated_at": "2026-02-05T21:50:00.123456Z"
  }
  ```

### Patch Tag
Este endpoint nos permite actualizar un _tag_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/tag/a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6/
- Body:
  ```json
  {
      "name": "Cultural y Gastronómico"
  } 
  ```
- Respuesta: 
  ```json
  {
    "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    "name": "Cultural y Gastronómico",
    "created_at": "2026-02-05T21:50:00.123456Z",
    "updated_at": "2026-02-05T22:00:00.654321Z"
  }
  ```

### Delete Tag
Este endpoint nos permite eliminar un _tag_ pasando el id.
- Delete: http://localhost:8000/api/tag/a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6/
- Respuesta: Código de estado `204 No Content`

## Service
### Get Service
Estos endpoints nos permite listar los _service_ ya sea todos o solo uno pasando el id
- Get Service: http://localhost:8000/api/service/
- Get Service by Id: http://localhost:8000/api/service/3fc5e9c8-a976-43f5-8c89-ff49d27716ec/
  ```json
  {
  "count": 8,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "31032927-4533-4f0e-8e3f-f836eaeb2ddd",
      "title": "Tour 1",
      "duration_value": 1,
      "duration_unit": "weeks",
      "duration_in_hours": 168,
      "summary": "Tour 3",
      "includes": "include all",
      "excludes": "excludes all too",
      "type": "group",
      "itinerary": [],
      "data": [],
      "departure_time": "23:59:00",
      "price_rules": [],
      "pricing_tiers": [],
      "media": [],
      "created_at": "2026-02-05T19:49:04.522958Z",
      "updated_at": "2026-02-05T19:49:04.522966Z"
    },
    ... 
  ]
  ```

### Filters
- Filtros para _service_
- Filtros: http://localhost:8000/api/service/?search=Ica&reference_price_min=100&reference_price_max=200&type=private&duration_min=1080&duration_max=1081&tags=CaMinata
- Query Params:
  - search: Permite buscar por título o resumen del servicio
  - reference_price_min: Permite filtrar por precio de referencia mínimo
  - reference_price_max: Permite filtrar por precio de referencia máximo
  - type: Permite filtrar por tipo de servicio (group o private)
  - duration_min: Permite filtrar por duración mínima en horas
  - duration_max: Permite filtrar por duración máxima en horas
  - tags: Permite filtrar por nombre de etiqueta (se pueden pasar varias etiquetas separadas por comas)

### Post Service
Este endpoint nos permite crear un _service_, en este nos es necesario pasar los valores de los _media, _data_ y _itinerary_
- Post Service: http://localhost:8000/api/service/
- Body:
  ```json
  {
      "title": "Tour Prueba",
      "duration_value": 1,
      "duration_unit": "weeks",
      "summary": "Tour 3",
      "includes": "include all",
      "excludes": "excludes all too",
      "type": "group",
      "departure_time": "08:00",
      "reference_price": 500.00
  }
  ```
- Respuesta:
  ```json
  {
    "id": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
    "title": "Tour Prueba",
    "duration_value": 1,
    "duration_unit": "weeks",
    "duration_in_hours": 168,
    "summary": "Tour 3",
    "includes": "include all",
    "excludes": "excludes all too",
    "type": "group",
    "itinerary": [],
    "data": [],
    "departure_time": "08:00:00",
    "price_rules": [],
    "pricing_tiers": [],
    "reference_price": "500.00",
    "tags": [],
    "media": [],
    "created_at": "2026-02-09T02:54:14.238764Z",
    "updated_at": "2026-02-09T02:54:14.238789Z"
  }
  ```

### Patch Service
Este endpoint nos permite actualizar un _service_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/
- Body: 
    ```json
      {
        "departure_time": "08:00:00"
      }
    ```
- Respuesta:
  ```json
      {
        "id": "31032927-4533-4f0e-8e3f-f836eaeb2ddd",
        "title": "Tour 1",
        "duration_value": 1,
        "duration_unit": "weeks",
        "duration_in_hours": 168,
        "summary": "Tour 3",
        "includes": "include all",
        "excludes": "excludes all too",
        "type": "group",
        "itinerary": [],
        "data": [],
        "departure_time": "08:00:00",
        "reference_price": "500.00",
        "price_rules": [],
        "pricing_tiers": [],
        "tags": [],
        "media": [],
        "created_at": "2026-02-05T19:49:04.522958Z",
        "updated_at": "2026-02-05T19:49:04.522966Z"
      }
  ```

### Delete Service
Este endpoint nos permite eliminar un _service_ pasando el id
- Delete: http://localhost:8000/api/service/2d616c5b-13e5-49d6-8568-d20749cc94e3/
- Respuesta: Código de estado `204 No Content`


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
- Respuesta:
  ```json
  {
  "message": "Successfully created 2 data items",
  "created": [
    {
      "id": "b033a75d-2c70-4c17-8f07-a402c74a73b7",
      "title": "Información sobre fauna",
      "description": "<p>Datos sobre la fauna local</p>",
      "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
      "created_at": "2026-02-09T02:58:33.976764Z",
      "updated_at": "2026-02-09T02:58:33.976778Z"
    },
    {
      "id": "5f6d7c17-43b8-4ae0-b297-a7ab67356083",
      "title": "Información sobre flora",
      "description": "<p>Datos sobre la flora local</p>",
      "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
      "created_at": "2026-02-09T02:58:33.983371Z",
      "updated_at": "2026-02-09T02:58:33.983377Z"
    }
  ],
  "failed": 0,
  "errors": null
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
- Respuesta:
  ```json
  {
    "message": "Successfully created 3 itineraries",
    "created": [
      {
        "id": "53d78212-3065-4504-bf68-4606bdab086a",
        "title": "Día 1 - Llegada",
        "description": "<p>Descripción en HTML del primer día</p>",
        "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
        "created_at": "2026-02-09T04:09:03.201577Z",
        "updated_at": "2026-02-09T04:09:03.201595Z"
      },
      {
        "id": "980cf8d0-22b7-40b3-8f74-7a67458dea22",
        "title": "Día 2 - Exploración",
        "description": "<p>Descripción en HTML del segundo día</p>",
        "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
        "created_at": "2026-02-09T04:09:03.206086Z",
        "updated_at": "2026-02-09T04:09:03.206090Z"
      },
      {
        "id": "3c242de8-3cbb-49cf-bac7-82132fa59304",
        "title": "Día 3 - Regreso",
        "description": "<p>Descripción en HTML del tercer día</p>",
        "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
        "created_at": "2026-02-09T04:09:03.207191Z",
        "updated_at": "2026-02-09T04:09:03.207195Z"
      }
    ],
    "failed": 0,
    "errors": null
  }
  ```

#### Bulk Add PriceRule
Este endpoint nos permite pasar varias _price_rule_ en una sola petición post, todos relacionados al _service_ pasado por la url.
- bulk-add-price-rule: `POST` http://localhost:8000/api/service/51b0c356-79d2-4b1f-9951-650fb438aa3d/bulk-add-price-rules/
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
- Respuesta:
  ```json
  {
    "message": "Successfully created 3 price rules",
    "created": [
      {
        "id": "8ebbf04a-42d8-42c8-bed2-c3ad467a9fdd",
        "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
        "concept": "Autos",
        "amount": "600.00",
        "calculation_type": "divide",
        "created_at": "2026-02-09T03:54:48.852309Z",
        "updated_at": "2026-02-09T03:54:48.852321Z"
      },
      {
        "id": "a3cf4893-de02-4718-89ca-33164e94c2ca",
        "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
        "concept": "Guia",
        "amount": "600.00",
        "calculation_type": "divide",
        "created_at": "2026-02-09T03:54:48.855434Z",
        "updated_at": "2026-02-09T03:54:48.855439Z"
      },
      {
        "id": "7bb48102-92ed-489e-81cd-25592c617cd6",
        "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
        "concept": "Tickets",
        "amount": "600.00",
        "calculation_type": "multiply",
        "created_at": "2026-02-09T03:54:48.856624Z",
        "updated_at": "2026-02-09T03:54:48.856628Z"
      }
    ],
    "failed": 0,
    "errors": null
  } 
  ```
  
#### Bulk Add PricingTier
Este endpoint nos permite pasar varias _pricing_tier_ en una sola petición post, todos relacionados al _service_ pasado por la url.
- bulk-add-pricing-tier: `POST` http://localhost:8000/api/service/51b0c356-79d2-4b1f-9951-650fb438aa3d/bulk-add-pricing-tiers/
- Body:
  ```json
  {
    "items": [
      {
        "min_people": 1,
        "max_people": 2,
        "total_price": 100
      },
      {
        "min_people": 2,
        "max_people": 3,
        "total_price": 200
      },
      {
        "min_people": 3,
        "max_people": 5,
        "total_price": 500
      }
    ]
  } 
  ```
- Body:
  ```json
  {
    "message": "Successfully created 3 pricing tiers",
    "created": [
      {
        "id": "0006d7bf-a764-410f-a957-bcb2eb943157",
        "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
        "total_price": "100.00",
        "min_people": 1,
        "max_people": 2,
        "created_at": "2026-02-09T04:17:59.015593Z",
        "updated_at": "2026-02-09T04:17:59.015604Z"
      },
      {
        "id": "a7527e24-a72f-46cd-b0a0-92e32ff06a87",
        "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
        "total_price": "200.00",
        "min_people": 2,
        "max_people": 3,
        "created_at": "2026-02-09T04:17:59.019272Z",
        "updated_at": "2026-02-09T04:17:59.019278Z"
      },
      {
        "id": "8a98f191-210f-4adc-a3a6-71fc9a3b66a3",
        "service": "51b0c356-79d2-4b1f-9951-650fb438aa3d",
        "total_price": "500.00",
        "min_people": 3,
        "max_people": 5,
        "created_at": "2026-02-09T04:17:59.020594Z",
        "updated_at": "2026-02-09T04:17:59.020599Z"
      }
    ],
    "failed": 0,
    "errors": null
  }
  ```

#### Bulk Add Tags
Este endpoint nos permite pasar varias _tags_ en una sola petición post, todos relacionados al _service_ pasado por la url.
- bulk-add-tags: `POST` http://localhost:8000/api/service/51b0c356-79d2-4b1f-9951-650fb438aa3d/bulk-add-tags/
- Body:
  ```json
  {
    "items": [
      "fb997f80-ec11-42e7-b248-c868501aadf2",
      "368af562-79dd-44a5-ae84-af057346a381"
    ]
  }
  ```
- Respuesta:
  ```json
  {
    "message": "Successfully added 2 tags to service",
    "tags": [
      {
        "id": "fb997f80-ec11-42e7-b248-c868501aadf2",
        "name": "Deportes",
        "created_at": "2026-02-06T17:59:00.841137Z",
        "updated_at": "2026-02-06T17:59:00.841149Z"
      },
      {
        "id": "368af562-79dd-44a5-ae84-af057346a381",
        "name": "Caminata",
        "created_at": "2026-02-06T17:59:16.190705Z",
        "updated_at": "2026-02-06T17:59:16.190714Z"
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
- Respuesta:
  ```json
  {
    "id": "60d8a71d-7813-4a93-8ee2-b1142fb10f5e",
    "type_media": "image",
    "file": "/media_files/media/2026/02/09/Screenshot_From_2025-08-14_16-12-43.png",
    "url": null,
    "is_cover": false,
    "created_at": "2026-02-09T03:00:18.322774Z",
    "updated_at": "2026-02-09T03:00:18.322789Z",
    "title": "Pasaporte",
    "description": "Es un pasaporte"
  } 
  ```
  
#### Upload Document
Este endpoint nos permite subir un documento y relacionarlo al _service_ pasado por la url, todo lo que se sube aqui esta en categoria _document_.
- upload-document: `POST` http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/upload-document/
- Body: Form-Data
    - title: Documento del tour
    - description: Este es un documento del tour
    - file: (Seleccionar archivo de documento)
- Respuesta:
  ```json
  {
    "id": "9126b83f-bd6c-4a28-ab9d-fcb189b14eaf",
    "type_media": "document",
    "file": "/media_files/media/2026/02/09/PASAPORTE.pdf",
    "url": null,
    "is_cover": false,
    "created_at": "2026-02-09T03:06:13.174833Z",
    "updated_at": "2026-02-09T03:06:13.174858Z",
    "title": "Pasaporte",
    "description": "Es un pasaporte"
  }
  ```

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
- Respuesta:
  ```json
  {
    "id": "db32d8d6-1b5f-4128-ab3f-a919150b3ba3",
    "type_media": "post",
    "file": null,
    "url": "http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/create-post/",
    "is_cover": false,
    "created_at": "2026-02-09T03:07:33.284025Z",
    "updated_at": "2026-02-09T03:07:33.284040Z",
    "title": "Post de Facebook",
    "description": "Esta es la description"
  }
  ```

#### Upload Cover
Este endpoint nos permite subir una imagen de portada y relacionarla al _service_ pasado por la url, este tendra el campo _is_cover_ en true.
- upload-cover: `POST` http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/upload-cover/
- Body: Form-Data
    - title: Portada del tour
    - description: Esta es la portada del tour
    - file: (Seleccionar archivo de imagen)
- Respuesta: 
  ```json
  {
    "id": "8d07544a-49d5-4af9-a359-8a5bacafa36d",
    "type_media": "image",
    "file": "/media_files/media/2026/02/09/Screenshot_From_2025-08-15_12-24-25.png",
    "url": null,
    "is_cover": true,
    "created_at": "2026-02-09T03:37:25.916803Z",
    "updated_at": "2026-02-09T03:37:25.916822Z",
    "title": "El cover",
    "description": "Descripcion del cover"
  } 
  ```

#### Set Cover
Este endpoint nos permite seleccionar una imagen ya subida y ponerla como portada del _service_ pasado por la url, este tendra el campo _is_cover_ en true y todos los demás en false, valida que el id del _media_ este relacionado a este _service_.
- set-cover: `PATCH` http://localhost:8000/api/service/f10d84ef-a560-4d77-8509-bb0795c1c8b5/set-cover/9c99173c-a927-4fff-9603-9cbb2e97fcfe/
- Body: Vacío

### Get Summary Service
Este endpoint nos permite obtener un resumen de todos los _service_ con los siguientes campos:
- Get Summary Service: http://localhost:8000/api/service/summary/
- Campos:
  - id
  - title
  - type
  - duration (Suma de duration_value y duration_unit)
  - cover (URL de la imagen de portada si existe)

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
  - tags:
    ```json
    [
      "fb997f80-ec11-42e7-b248-c868501aadf2",
      "368af562-79dd-44a5-ae84-af057346a381"
    ]
    ```
  - departure_time: "09:00"
  - price_rules:
    ```json
    [
      {
        "concept": "Transporte",
        "amount": 100,
        "calculation_type": "divide"
      },
      {
        "concept": "Guía",
        "amount": 150,
        "calculation_type": "divide"
      }
    ]
    ```
    - pricing_tiers:
    ```json
      [
        {
          "min_people": 1,
          "max_people": 2,
          "total_price": 100
        },
        {
          "min_people": 2,
          "max_people": 3,
          "total_price": 200
        },
        {
          "min_people": 3,
          "max_people": 5,
          "total_price": 500
        }
     ]
    ```

## Package
### Get Package
Estos endpoints nos permite listar los _package_ ya sea todos o solo uno pasando el id
- Get Package: http://localhost:8000/api/package/
- Get Package by Id: http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0
- Respuesta:
  ```json
  {
  "count": 7,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "6096d721-a541-4808-a673-41884379ea02",
      "title": "MachiPicchu VIP",
      "description": "Es el plan VIP de Machu Picchu con varias actividades",
      "reference_price": "300.00",
      "package_services": [
        {
          "id": "5ca354b7-0a77-4e40-865f-066a09a80478",
          "service": {
            "id": "2455d449-2c98-47cb-9a92-4ee56aed3991",
            "title": "Tour 1",
            "duration_in_hours": 168,
            "duration_value": 1,
            "duration_unit": "weeks",
            "reference_price": 0.0
          },
          "order": 0
        },
        ...
      ],
      "total_duration": "59 días",
      "total_duration_hours": 1416,
      "services_count": 3,
      "media": [
        {
          "id": "8df035b2-10f4-4389-a377-6e119d22f3ba",
          "type_media": "image",
          "file": "/media_files/media/2026/02/09/wonder_logo_color_mNxhhSn.png",
          "url": null,
          "is_cover": true,
          "created_at": "2026-02-09T05:08:28.295199Z",
          "updated_at": "2026-02-09T05:08:28.295207Z",
          "title": "Cover",
          "description": "Service cover image"
        },
       ...
      ],
      "created_at": "2026-02-09T17:10:17.311689Z",
      "updated_at": "2026-02-09T17:10:17.311716Z"
    },
    ... ]
  }
  ```

### Filters
- Filtros para _package_
- Filtros: http://localhost:8000/api/package/?search=Machu&reference_price_min=100&reference_price_max=100000&total_duration_hours_min=24&total_duration_hours_max=144
- Query Params:
  - search: Permite buscar por título o descripción del paquete
  - reference_price_min: Permite filtrar por precio de referencia mínimo
  - reference_price_max: Permite filtrar por precio de referencia máximo
  - total_duration_hours_min: Permite filtrar por duración total mínima en horas
  - total_duration_hours_max: Permite filtrar por duración total máxima en horas

### Post Package
Este endpoint nos permite crear un _package_, en este nos es necesario pasar los valores de los _services_
- Post Package: http://localhost:8000/api/package/
- Body:
  ```json
  {
    "title": "MachiPicchu VIP",
    "description": "Es el plan VIP de Machu Picchu con varias actividades",
    "reference_price": 300,
    "services": [
      {
        "service_id": "95694ebf-20a6-423b-b533-85a76fd8c199",
        "order": 0 
      },
      {
        "service_id": "92d255ed-264c-47eb-a4e3-eb91d987bf5b",
        "order": 1 
      },
      {
        "service_id": "2455d449-2c98-47cb-9a92-4ee56aed3991",
        "order": 2 
      }
    ]
  }
  ```
- Respuesta:
  ```json
  {
    "id": "6a34c42d-79be-4b83-85db-eb89d45f0e72",
    "title": "MachiPicchu VIP",
    "description": "Es el plan VIP de Machu Picchu con varias actividades",
    "reference_price": "300.00",
    "total_duration": "59 días",
    "total_duration_hours": 1416,
    "package_services": [
      {
        "id": "46a1a84d-dfcf-4967-adf1-aa840f131c77",
        "service": {
          "id": "95694ebf-20a6-423b-b533-85a76fd8c199",
          "title": "Ica 2D/3N - PRUEBA",
          "duration_in_hours": 1080,
          "duration_value": 45,
          "duration_unit": "days",
          "reference_price": 0.0
        },
        "order": 0
      },
     ...
    ],
    "media": [
      {
        "id": "8df035b2-10f4-4389-a377-6e119d22f3ba",
        "type_media": "image",
        "file": "/media_files/media/2026/02/09/wonder_logo_color_mNxhhSn.png",
        "url": null,
        "is_cover": true,
        "created_at": "2026-02-09T05:08:28.295199Z",
        "updated_at": "2026-02-09T05:08:28.295207Z",
        "title": "Cover",
        "description": "Service cover image"
      },
      ...
    ],
    "created_at": "2026-02-09T17:20:48.344455Z",
    "updated_at": "2026-02-09T17:20:48.344465Z"
  }
  ```

### Patch Package
Este endpoint nos permite actualizar un _package_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0/
- Body: 
  ```json
    {
      "reference_price": 4000,
      "services": [
      {
        "service_id": "95694ebf-20a6-423b-b533-85a76fd8c199",
        "order": 1 
      },
      {
        "service_id": "92d255ed-264c-47eb-a4e3-eb91d987bf5b",
        "order": 2 
      },
      {
        "service_id": "2455d449-2c98-47cb-9a92-4ee56aed3991",
        "order": 3 
      }
      ]
    }
  ```
- Respuesta: 
  ```json
  {
    "id": "6a34c42d-79be-4b83-85db-eb89d45f0e72",
    "title": "MachiPicchu VIP",
    "description": "Es el plan VIP de Machu Picchu con varias actividades",
    "reference_price": "4000.00",
    "total_duration": "59 días",
    "total_duration_hours": 1416,
    "package_services": [
      {
        "id": "d5a02a02-ebd7-4e3d-9c9e-fed7818786b3",
        "service": {
          "id": "95694ebf-20a6-423b-b533-85a76fd8c199",
          "title": "Ica 2D/3N - PRUEBA",
          "duration_in_hours": 1080,
          "duration_value": 45,
          "duration_unit": "days",
          "reference_price": 0.0
        },
        "order": 1
      },
     ...
    ],
    "media": [
      {
        "id": "8df035b2-10f4-4389-a377-6e119d22f3ba",
        "type_media": "image",
        "file": "/media_files/media/2026/02/09/wonder_logo_color_mNxhhSn.png",
        "url": null,
        "is_cover": true,
        "created_at": "2026-02-09T05:08:28.295199Z",
        "updated_at": "2026-02-09T05:08:28.295207Z",
        "title": "Cover",
        "description": "Service cover image"
      },
      ...
    ],
    "created_at": "2026-02-09T17:20:48.344455Z",
    "updated_at": "2026-02-09T17:24:19.710762Z"
  }
  ```

### Delete Package
Este endpoint nos permite eliminar un _package_ pasando el id
- Delete: http://localhost:8000/api/package/45cd2f9c-57db-4ee3-b5fa-8a801aaac438/
- Respuesta: Status 204 No Content

### Action
#### Add Service
Este endpoint nos permite pasar por la url el id del _service_ que se quiere relacionar durante la creación de un _package_
- add-service: `POST` http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0/add-service/
- Body: 
  ```json
  {
    "service_id": "ecda7946-a11d-4caa-9866-f16f6c864ffb",
    "order": 8
  }
  ```
- Respuesta:
```json
{
  "id": "6096d721-a541-4808-a673-41884379ea02",
  "title": "MachiPicchu VIP",
  "description": "Es el plan VIP de Machu Picchu con varias actividades",
  "reference_price": "300.00",
  "total_duration": "104 días",
  "total_duration_hours": 2496,
  "package_services": [
    {
      "id": "30794bf5-9719-4733-8521-25af81fec485",
      "service": {
        "id": "ecda7946-a11d-4caa-9866-f16f6c864ffb",
        "title": "Ica 2D/3N",
        "duration_in_hours": 1080,
        "duration_value": 45,
        "duration_unit": "days",
        "reference_price": 0.0
      },
      "order": 8
    },
    ...
  ],
  "media": [
    {
      "id": "8df035b2-10f4-4389-a377-6e119d22f3ba",
      "type_media": "image",
      "file": "/media_files/media/2026/02/09/wonder_logo_color_mNxhhSn.png",
      "url": null,
      "is_cover": true,
      "created_at": "2026-02-09T05:08:28.295199Z",
      "updated_at": "2026-02-09T05:08:28.295207Z",
      "title": "Cover",
      "description": "Service cover image"
    },
    ...
  ],
  "created_at": "2026-02-09T17:10:17.311689Z",
  "updated_at": "2026-02-09T17:10:17.311716Z"
}
```

#### Remove Service
Este endpoint nos permite eliminar la relación de un _service_ dentro de un _package_ pasando ambos ids por la url
- remove-service: `DELETE` http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0/remove-service/61f34e3e-00f9-4dd1-bbb2-9bb87bdfe43f/
- Respuesta: Status 204 No Content 
- Nota: El primer id es el del _package_ y el segundo es el del _service_ que se quiere eliminar del paquete

#### Update Service Order
Este endpoint nos permite actualizar el orden de un _service_ dentro de un _package_ pasando el id del _package_por la url
- update-service-order: `PATCH` http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0/update-order/
- Body: 
  ```json
  {
    "services": [
      {
        "service_id": "95694ebf-20a6-423b-b533-85a76fd8c199",
        "order": 1
      },
      {
        "service_id": "92d255ed-264c-47eb-a4e3-eb91d987bf5b",
        "order": 2 
      },
      {
        "service_id": "2455d449-2c98-47cb-9a92-4ee56aed3991",
        "order": 3 
      }
    ]
  } 
  ```
- Respuesta:
```json
{
  "id": "6096d721-a541-4808-a673-41884379ea02",
  "title": "MachiPicchu VIP",
  "description": "Es el plan VIP de Machu Picchu con varias actividades",
  "reference_price": "300.00",
  "total_duration": "59 días",
  "total_duration_hours": 1416,
  "package_services": [
    {
      "id": "6277dc01-0b9f-47d4-a1bb-bac36e4eb967",
      "service": {
        "id": "92d255ed-264c-47eb-a4e3-eb91d987bf5b",
        "title": "Tour Prueba",
        "duration_in_hours": 168,
        "duration_value": 1,
        "duration_unit": "weeks",
        "reference_price": 0.0
      },
      "order": 2
    },
    {
      "id": "5ca354b7-0a77-4e40-865f-066a09a80478",
      "service": {
        "id": "2455d449-2c98-47cb-9a92-4ee56aed3991",
        "title": "Tour 1",
        "duration_in_hours": 168,
        "duration_value": 1,
        "duration_unit": "weeks",
        "reference_price": 0.0
      },
      "order": 3
    },
    {
      "id": "30794bf5-9719-4733-8521-25af81fec485",
      "service": {
        "id": "ecda7946-a11d-4caa-9866-f16f6c864ffb",
        "title": "Ica 2D/3N",
        "duration_in_hours": 1080,
        "duration_value": 45,
        "duration_unit": "days",
        "reference_price": 0.0
      },
      "order": 8
    }
  ],
 ...
} 
```
- Nota: Solo se actualiza el orden de los servicios dentro del paquete

#### Detail Duration
Este endpoint nos permite obtener la duración total del _package_ pasando el id por la url
- duration: `GET` http://localhost:8000/api/package/98ba4761-a967-4ffb-a4e6-38c725af24c0/duration/
- Respuesta:
  ```json
  {
    "total_duration": "59 días",
    "total_duration_hours": 1416,
    "reference_price": 300.0,
    "services": [
      {
        "id": "92d255ed-264c-47eb-a4e3-eb91d987bf5b",
        "title": "Tour Prueba",
        "order": 2,
        "duration_value": 1,
        "duration_unit": "weeks",
        "duration_in_hours": 168,
        "reference_price": 0.0
      },
      {
        "id": "2455d449-2c98-47cb-9a92-4ee56aed3991",
        "title": "Tour 1",
        "order": 3,
        "duration_value": 1,
        "duration_unit": "weeks",
        "duration_in_hours": 168,
        "reference_price": 0.0
      },
      {
        "id": "ecda7946-a11d-4caa-9866-f16f6c864ffb",
        "title": "Ica 2D/3N",
        "order": 8,
        "duration_value": 45,
        "duration_unit": "days",
        "duration_in_hours": 1080,
        "reference_price": 0.0
      }
    ]
  }
  ```

#### Package Summary
Este endpoint nos permite obtener un resumen de todos los _package_ con los siguientes campos:
- Get Package Summary: http://localhost:8000/api/package/summary/
- Campos: 
  - id
  - title
  - description
  - reference_price
  - services_count (Número total de servicios en el paquete)
  - total_duration (Duración total del paquete en días)
- Respuesta: 
  ```json
  {
    "count": 8,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": "6a34c42d-79be-4b83-85db-eb89d45f0e72",
        "title": "MachiPicchu VIP",
        "description": "Es el plan VIP de Machu Picchu con varias actividades",
        "reference_price": "4000.00",
        "services_count": 3,
        "total_duration": "59 días"
      },
      {
        "id": "6096d721-a541-4808-a673-41884379ea02",
        "title": "MachiPicchu VIP",
        "description": "Es el plan VIP de Machu Picchu con varias actividades",
        "reference_price": "300.00",
        "services_count": 3,
        "total_duration": "59 días"
      },
      ...
    ]
  } 
  ```

## Módulo Personas (Clientes)
### Get Person
Estos endpoints nos permite listar los _Person_ ya sea todos o solo uno pasando él id
- Get Person: http://127.0.0.1:8000/api/person/
- Get Person by Id: http://127.0.0.1:8000/api/person/f5c80b3f-efe7-4fd9-a1d8-0429035b5567
  - Respuesta:
  ```json 
   {
    "count": 8,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": "3fcc4079-4b95-4ec1-a729-ff2eed4d7b07",
        "first_name": "Pasajero",
        "last_name": "Temp temp1",
        "email": "temp.e0bcf7fc@sys.local",
        "phone_number": null,
        "media": [],
        "passport_number": null,
        "group": [
          "68e747ec-fabc-4b35-b04e-f0ffee469a79"
        ],
        "birth_date": null,
        "nationality": null,
        "is_generic": true,
        "created_at": "2026-02-26T05:46:23.471669Z",
        "updated_at": "2026-02-26T05:46:23.471678Z"
      },
      {
        "id": "a4c8b815-354f-4939-a6ab-1753ae59923b",
        "first_name": "Carolina",
        "last_name": "Vega",
        "email": "c.vega@empresa.com",
        "phone_number": "999888555",
        "media": [],
        "passport_number": "CO998855",
        "group": [
          "c13c99b9-df45-4a25-a821-9025719b795e",
          "5bf242bf-0a0c-4f5a-89cd-a6dfa515a8a0",
          "68e747ec-fabc-4b35-b04e-f0ffee469a79"
        ],
        "birth_date": null,
        "nationality": "CO",
        "is_generic": false,
        "created_at": "2026-02-26T05:44:44.902435Z",
        "updated_at": "2026-02-26T05:44:44.902444Z"
      },
      ...
   
      ]
    }
    ```

### Filters
  - Filtros para _person_ `http://localhost:8000/api/person/summary/?q=Cris` es un filtro con busqueda `or` para los siguientes campos:
  - first_name: Filtrar por nombre
  - last_name: Filtrar por apellido
  - email: Filtrar por email
  - phone_number: Filtrar por número de teléfono q
- Y un filtro por nacionalidad `http://localhost:8000/api/person/summary/?nationality=US` este es de tipo `and`
- Ejemplo: http://127.0.0.1:8000/api/person/?q=martin&nationality=PE

### Post Client
Este endpoint nos permite crear un _person_ pasando en el cuerpo los datos requeridos
- Post Client: http://127.0.0.1:8000/api/person/
- Body:
  ```json
   {
      "first_name": "Valentina",
      "last_name": "Rios Martinez",
      "email": "valentina.rios@example.com",
      "phone_number": "+5491122334455",
      "passport_number": "A7788990",
      "birth_date": "2000-01-30",
      "nationality": "AR"
    }
  ```
- Respuesta: 
  ```json
  {
    "id": "22c72505-860c-4e5d-88a0-2913473ca879",
    "first_name": "valentina",
    "last_name": "rios martinez",
    "email": "valentina.rios@example.com",
    "phone_number": "+5491122334455",
    "media": [],
    "passport_number": "A7788990",
    "group": [],
    "birth_date": "2000-01-30",
    "nationality": "AR",
    "is_generic": false,
    "created_at": "2026-02-26T05:56:27.506437Z",
    "updated_at": "2026-02-26T05:56:27.506447Z"
  }
  ```

### Patch Person
Este endpoint nos permite actualizar un _person_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://127.0.0.1:8000/api/person/f5c80b3f-efe7-4fd9-a1d8-0429035b5567/
- Body:
  ```json
  {
      "first_name": "Martin",
      "nationality": "Americana"
  }
  ```
- Respuesta:
  ```json
  {
    "id": "22c72505-860c-4e5d-88a0-2913473ca879",
    "first_name": "martin",
    "last_name": "rios martinez",
    "email": "valentina.rios@example.com",
    "phone_number": "+5491122334455",
    "media": [],
    "passport_number": "A7788990",
    "group": [],
    "birth_date": "2000-01-30",
    "nationality": "US",
    "is_generic": false,
    "created_at": "2026-02-26T05:56:27.506437Z",
    "updated_at": "2026-02-26T05:58:05.885592Z"
  }
  ```

### Delete Person
Este endpoint nos permite eliminar un _person_ pasando el id
- Delete: http://127.0.0.1:8000/api/person/f5c80b3f-efe7-4fd9-a1d8-0429035b5567/
- Respuesta: Status 204 No Content

### Actions
#### Upload Document
Este endpoint nos permite subir un documento y relacionarlo al _person_ pasado por la url, todo lo que se sube aqui esta en categoria _document_.
- upload-document: `POST` http://127.0.0.1:8000/api/person/f5c80b3f-efe7-4fd9-a1d8-0429035b5567/upload-document/
- Body: Form-Data
    - title: Documento del cliente
    - description: Este es un documento del cliente
    - file: (Seleccionar archivo de documento)
- Respuesta:
  ```json
  {
    "id": "48d5b95f-ee15-47af-b172-38a02b2deba7",
    "type_media": "document",
    "file": "/media_files/media/2026/02/26/CONTRATO_DE_PRESTACI%C3%93N_DE_SERVICIOS_DE_DESARROLLO_WEB.pdf",
    "url": null,
    "is_cover": false,
    "created_at": "2026-02-26T06:00:01.566255Z",
    "updated_at": "2026-02-26T06:00:01.566267Z",
    "title": "",
    "description": ""
  }
  ```
#### Upload Image
Este endpoint nos permite subir una imagen y relacionarla al _person_ pasado por la url, todo lo que se sube aqui esta en categoria _image.
- upload-image: `POST` http://127.0.0.1:8000/api/person/f5c80b3f-efe7-4fd9-a1d8-0429035b5567/upload-media/
- Body: Form-Data
    - title: Imagen del cliente
    - description: Esta es una imagen del cliente
    - file: (Seleccionar archivo de imagen)
- Respuesta:
  ```json 
  {
    "id": "a232696d-eacb-4a9f-af6c-bdfdc1839f3f",
    "type_media": "image",
    "file": "/media_files/media/2026/02/26/Screenshot_From_2026-02-19_15-50-08_73suEdz.png",
    "url": null,
    "is_cover": false,
    "created_at": "2026-02-26T06:03:33.468582Z",
    "updated_at": "2026-02-26T06:03:33.468592Z",
    "title": "Passport",
    "description": "Es el pasaporte"
  }
  ```

#### Get Summary Person
Este endpoint nos permite obtener un resumen de todos los _person_ con los siguientes campos:
- Get Summary Person: http://127.0.0.1:8000/api/person/summary/?q=martin&nationality=US
- Campos:
  - id
  - first_name
  - last_name
  - email
  - phone_number
  - nationality
  - created_at
- Respuesta:
  ```json
  {
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": "22c72505-860c-4e5d-88a0-2913473ca879",
        "first_name": "Martin",
        "last_name": "Rios Martinez",
        "email": "valentina.rios@example.com",
        "phone_number": "+5491122334455",
        "nationality": "US"
      }
    ]
  }
  ```

### Countries
Este endpoint nos permite obtener la lista de países disponibles para asignar a la nacionalidad de un cliente.
- Get Countries: http://localhost:8000/api/countries/
- Respuesta:
  ```json
  [
    {
      "value": "US",
      "label": "United States"
    },
    {
      "value": "CA",
      "label": "Canada"
    },
    {
      "value": "GB",
      "label": "United Kingdom"
    },
    ...
  ]
  ```
_Nota: Crear para subir varios documentos o varias imagenes para person_

##  Group
Este modulo nos permite gestionar los grupos de personas, esto es útil para agrupar clientes que viajan juntos o que tienen alguna relación entre ellos.
### Get Group
Estos endpoints nos permite listar los _group_ ya sea todos o solo uno pasando él id
- Get Group: http://localhost:8000/api/group/
- Get Group by Id: http://localhost:8000/api/group/68e747ec-fabc-4b35-b04e-f0ffee469a79
- Respuesta:
  ```json
  {
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": "e53d1203-6984-4427-a0c3-510296092169",
        "name": "GRP-FY7Z3W",
        "person": [
          {
            "id": "c6f55248-9676-4926-9bd3-7ad6553eb596",
            "first_name": "Pedro",
            "last_name": "Suárez",
            "email": "pedro.suarez@email.com",
            "phone_number": "911223344",
            "media": [],
            "passport_number": "PE456789",
            "group": [
              "e53d1203-6984-4427-a0c3-510296092169"
            ],
            "birth_date": null,
            "nationality": "PE",
            "is_generic": false,
            "created_at": "2026-02-26T05:40:26.449565Z",
            "updated_at": "2026-02-26T05:40:26.449576Z"
          },
          {
            "id": "44cd1112-15ed-4906-8ce4-e153abef1cea",
            "first_name": "Pasajero",
            "last_name": "Temp temp1",
            "email": "temp.1bb2785f@sys.local",
            "phone_number": null,
            "media": [],
            "passport_number": null,
            "group": [
              "e53d1203-6984-4427-a0c3-510296092169"
            ],
            "birth_date": null,
            "nationality": null,
            "is_generic": true,
            "created_at": "2026-02-26T05:40:26.476813Z",
            "updated_at": "2026-02-26T05:40:26.476822Z"
          }
        ],
        "description": null,
        "contact_info": "Pedro Suárez",
        "total_people": 2,
        "expense": [],
        "created_at": "2026-02-26T05:40:26.444242Z",
        "updated_at": "2026-02-26T05:40:26.444254Z"
      },
      ...
      }
    ]
  }
  ```
### Post Group
Este endpoint nos permite crear un _group_.
- Post Group: http://localhost:8000/api/group/
- Body:
  ```json
  {
      "description": "Es el grupo 5",
      "contact_info": "Perez Martinez"
  } 
  ```
- Respuesta:
  ```json
  {
    "id": "e8df3d2b-02d3-4bb1-99c3-88bfe3a52469",
    "name": "GRP-VB3MIP",
    "person": [],
    "description": "Es el grupo 5",
    "contact_info": "Perez Martinez",
    "total_people": 0,
    "expense": [],
    "created_at": "2026-02-26T06:22:43.067087Z",
    "updated_at": "2026-02-26T06:22:43.067104Z"
  }
  ```

### Patch Group
Este endpoint nos permite actualizar un _group_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/group/e8df3d2b-02d3-4bb1-99c3-88bfe3a52469/
- Body:
  ```json 
  {
      "description": "Es el grupo 6",
      "contact_info": "Juana Martinez"
  } 
  ```
- Respuesta:
  ```json
  {
    "id": "e8df3d2b-02d3-4bb1-99c3-88bfe3a52469",
    "name": "GRP-EHODW3",
    "person": [],
    "description": "Es el grupo 6",
    "contact_info": "Juana Martinez",
    "total_people": 0,
    "expense": [],
    "created_at": "2026-02-26T06:22:43.067087Z",
    "updated_at": "2026-02-26T06:28:30.858985Z"
  }
  ```
  
### Delete Group
Este endpoint nos permite eliminar un _group_ pasando el id
- Delete: http://localhost:8000/api/group/e8df3d2b-02d3-4bb1-99c3-88bfe3a52469/
- Respuesta: Status 204 No Content

### Actions
### Add Person to Group
Este endpoint nos permite agregar una persona a un grupo pasando ambos ids por la url
- add-person: `POST` http://localhost:8000/api/group/e8df3d2b-02d3-4bb1-99c3-88bfe3a52469/add-person/
- Body:
  ```json
  {
      "person_id": "22c72505-860c-4e5d-88a0-2913473ca879"
  }
  ```
- Respuesta: 
  ```json
  {
    "message": "Person 'Martin Rios martinez' added to group 'GRP-3OGPE9' successfully.",
    "group": {
      "id": "fd718429-cedd-4616-86f1-f687427958b1",
      "name": "GRP-DJ2L2L",
      "person": [
        {
          "id": "22c72505-860c-4e5d-88a0-2913473ca879",
          "first_name": "Martin",
          "last_name": "Rios Martinez",
          "email": "valentina.rios@example.com",
          "phone_number": "+5491122334455",
          "media": [
            {
              "id": "a232696d-eacb-4a9f-af6c-bdfdc1839f3f",
              "type_media": "image",
              "file": "/media_files/media/2026/02/26/Screenshot_From_2026-02-19_15-50-08_73suEdz.png",
              "url": null,
              "is_cover": false,
              "created_at": "2026-02-26T06:03:33.468582Z",
              "updated_at": "2026-02-26T06:03:33.468592Z",
              "title": "Passport",
              "description": "Es el pasaporte"
            },
            {
              "id": "c00f406b-52c7-4829-a93a-762cb4f011ce",
              "type_media": "image",
              "file": "/media_files/media/2026/02/26/Screenshot_From_2026-02-19_15-50-08.png",
              "url": null,
              "is_cover": false,
              "created_at": "2026-02-26T06:03:00.553034Z",
              "updated_at": "2026-02-26T06:03:00.553047Z",
              "title": "",
              "description": ""
            },
            {
              "id": "48d5b95f-ee15-47af-b172-38a02b2deba7",
              "type_media": "document",
              "file": "/media_files/media/2026/02/26/CONTRATO_DE_PRESTACI%C3%93N_DE_SERVICIOS_DE_DESARROLLO_WEB.pdf",
              "url": null,
              "is_cover": false,
              "created_at": "2026-02-26T06:00:01.566255Z",
              "updated_at": "2026-02-26T06:00:01.566267Z",
              "title": "",
              "description": ""
            }
          ],
          "passport_number": "A7788990",
          "group": [
            "fd718429-cedd-4616-86f1-f687427958b1"
          ],
          "birth_date": "2000-01-30",
          "nationality": "US",
          "is_generic": false,
          "created_at": "2026-02-26T05:56:27.506437Z",
          "updated_at": "2026-02-26T05:58:05.885592Z"
        }
      ],
      "description": "Es el grupo 5",
      "contact_info": "Perez Martinez",
      "total_people": 1,
      "expense": [],
      "created_at": "2026-02-26T06:21:56.877753Z",
      "updated_at": "2026-02-26T06:21:56.877772Z"
    }
  }
  ```
  
#### Remove Person
Este endpoint nos permite eliminar una persona de un grupo pasando el id del grupo por la url y el id a traves del cuerpo
- remove-person: `POST` http://localhost:8000/api/group/fd718429-cedd-4616-86f1-f687427958b1/remove-person/
- Body:
  ```json 
  {
      "person_id": "c6f55248-9676-4926-9bd3-7ad6553eb596"
  }
  ```
- Respuesta: 
  ```json
  {
    "message": "Person 'Pedro Suárez' removed from group 'GRP-3OGPE9' successfully.",
    "group": {
      "id": "fd718429-cedd-4616-86f1-f687427958b1",
      "name": "GRP-ML0HAS",
      "person": [
        {
          "id": "44cd1112-15ed-4906-8ce4-e153abef1cea",
          "first_name": "Pasajero",
          "last_name": "Temp temp1",
          "email": "temp.1bb2785f@sys.local",
          "phone_number": null,
          "media": [],
          "passport_number": null,
          "group": [
            "e53d1203-6984-4427-a0c3-510296092169",
            "fd718429-cedd-4616-86f1-f687427958b1"
          ],
          "birth_date": null,
          "nationality": null,
          "is_generic": true,
          "created_at": "2026-02-26T05:40:26.476813Z",
          "updated_at": "2026-02-26T05:40:26.476822Z"
        },
        {
          "id": "f0826ebc-548d-4abd-ab65-82a5740732fa",
          "first_name": "Felipe",
          "last_name": "Castillo",
          "email": "f.castillo@empresa.com",
          "phone_number": "999888666",
          "media": [],
          "passport_number": "CO998866",
          "group": [
            "c13c99b9-df45-4a25-a821-9025719b795e",
            "5bf242bf-0a0c-4f5a-89cd-a6dfa515a8a0",
            "68e747ec-fabc-4b35-b04e-f0ffee469a79",
            "fd718429-cedd-4616-86f1-f687427958b1"
          ],
          "birth_date": null,
          "nationality": "CO",
          "is_generic": false,
          "created_at": "2026-02-26T05:44:44.877861Z",
          "updated_at": "2026-02-26T05:44:44.877873Z"
        },
        {
          "id": "3fcc4079-4b95-4ec1-a729-ff2eed4d7b07",
          "first_name": "Pasajero",
          "last_name": "Temp temp1",
          "email": "temp.e0bcf7fc@sys.local",
          "phone_number": null,
          "media": [],
          "passport_number": null,
          "group": [
            "68e747ec-fabc-4b35-b04e-f0ffee469a79",
            "fd718429-cedd-4616-86f1-f687427958b1"
          ],
          "birth_date": null,
          "nationality": null,
          "is_generic": true,
          "created_at": "2026-02-26T05:46:23.471669Z",
          "updated_at": "2026-02-26T05:46:23.471678Z"
        },
        {
          "id": "22c72505-860c-4e5d-88a0-2913473ca879",
          "first_name": "Martin",
          "last_name": "Rios Martinez",
          "email": "valentina.rios@example.com",
          "phone_number": "+5491122334455",
          "media": [
            {
              "id": "a232696d-eacb-4a9f-af6c-bdfdc1839f3f",
              "type_media": "image",
              "file": "/media_files/media/2026/02/26/Screenshot_From_2026-02-19_15-50-08_73suEdz.png",
              "url": null,
              "is_cover": false,
              "created_at": "2026-02-26T06:03:33.468582Z",
              "updated_at": "2026-02-26T06:03:33.468592Z",
              "title": "Passport",
              "description": "Es el pasaporte"
            },
            {
              "id": "c00f406b-52c7-4829-a93a-762cb4f011ce",
              "type_media": "image",
              "file": "/media_files/media/2026/02/26/Screenshot_From_2026-02-19_15-50-08.png",
              "url": null,
              "is_cover": false,
              "created_at": "2026-02-26T06:03:00.553034Z",
              "updated_at": "2026-02-26T06:03:00.553047Z",
              "title": "",
              "description": ""
            },
            {
              "id": "48d5b95f-ee15-47af-b172-38a02b2deba7",
              "type_media": "document",
              "file": "/media_files/media/2026/02/26/CONTRATO_DE_PRESTACI%C3%93N_DE_SERVICIOS_DE_DESARROLLO_WEB.pdf",
              "url": null,
              "is_cover": false,
              "created_at": "2026-02-26T06:00:01.566255Z",
              "updated_at": "2026-02-26T06:00:01.566267Z",
              "title": "",
              "description": ""
            }
          ],
          "passport_number": "A7788990",
          "group": [
            "fd718429-cedd-4616-86f1-f687427958b1"
          ],
          "birth_date": "2000-01-30",
          "nationality": "US",
          "is_generic": false,
          "created_at": "2026-02-26T05:56:27.506437Z",
          "updated_at": "2026-02-26T05:58:05.885592Z"
        }
      ],
      "description": "Es el grupo 5",
      "contact_info": "Perez Martinez",
      "total_people": 4,
      "expense": [],
      "created_at": "2026-02-26T06:21:56.877753Z",
      "updated_at": "2026-02-26T06:21:56.877772Z"
    }
  }
  ```
  
## Service Quote Person
Este módulo nos permite gestionar la relación entre las cotizaciones de servicios y las personas, aquí se asignan los servicios a cada persona, se pueden agregar o eliminar servicios de cada persona y también se pueden agregar los datos de viaje como fecha de salida, fecha de llegada, hora de salida y hora de llegada.
### Get Service Quote Person
Estos endpoints nos permite listar los _ServiceQuotePerson_ ya sea todos o solo uno pasando él id por la url.
- Get Service Quote Person: http://localhost:8000/api/service-quote-person/
- Get Service Quote Person by Id: http://localhost:8000/api/service-quote-person/1c9b8a2e-5c3b-4d9f-a9c8-8b9f6c9e8b9f
- Respuesta:
  ```json
  {
    "count": 18,
    "next": "http://localhost:8000/api/service-quote-person/?limit=10&offset=10",
    "previous": null,
    "results": [  
      {
          "id": "6cb85a5f-b982-412b-ada1-4c3536e4cca1",
          "calculated_cost": 240.0,
          "notes": "Comida china",
          "person": "c6f55248-9676-4926-9bd3-7ad6553eb596",
          "service": "d427b527-1019-4de7-979f-e2f9780af28c",
          "quote": "f27e8ec3-85f6-4b3e-a58a-77fb7c62dbf3",
          "departure_date": "2026-05-10",
          "arrive_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_time": "12:00:00",
          "person_name": "Pedro Suárez",
          "service_name": "Valle Sagrado de los Incas (Vip)",
          "created_at": "2026-02-26T05:40:26.467470Z"
      },
      ...
    ]
  }
  ```

### Post Service Quote Person
Este endpoint nos permite crear un _ServiceQuotePerson_ pasando en el cuerpo los datos requeridos
- Post Service Quote Person: http://localhost:8000/api/service-quote-person/
- Body:
  ```json
  {
    "person_id": "f8f30244-81de-4eb9-b929-480b189a70a3",
    "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
    "departure_date": "2026-05-10",
    "departure_time": "08:00:00",
    "arrive_date": "2026-05-10",
    "arrive_time": "12:00:00",
    "notes": "Coordinadora del equipo",
    "quote_id": "26e8039a-2c7f-4e19-a8ff-6c6dea529836"
  } 
  ```
- Respuesta:
  ```json
  {
    "id": "bff7ace3-0e11-45ce-b381-c86b93741a65",
    "calculated_cost": 154.28571428571428,
    "notes": "Coordinadora del equipo",
    "person": "f8f30244-81de-4eb9-b929-480b189a70a3",
    "service": "9fa1eb00-803f-42b3-9014-7427369ba624",
    "quote": "26e8039a-2c7f-4e19-a8ff-6c6dea529836",
    "departure_date": "2026-05-10",
    "arrive_date": "2026-05-10",
    "departure_time": "08:00:00",
    "arrive_time": "12:00:00",
    "person_name": "Pasajero Temp temp1",
    "service_name": "Machu Picchu \"Conexión Amanecer\"",
    "created_at": "2026-02-27T04:56:33.399451Z"
  } 
  ```

### Patch Service Quote Person
Este endpoint nos permite actualizar un _ServiceQuotePerson_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/service-quote-person/bff7ace3-0e11-45ce-b381-c86b93741a65/
- Body:
  ```json
  {
    "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
    "notes": "Comida china",
    "person_id": "c6f55248-9676-4926-9bd3-7ad6553eb596",
    "quote_id": "f27e8ec3-85f6-4b3e-a58a-77fb7c62dbf3"
  }
  ```
- Respuesta:
  ```json
  {
    "id": "6cb85a5f-b982-412b-ada1-4c3536e4cca1",
    "calculated_cost": 240.0,
    "notes": "Comida china",
    "person": "c6f55248-9676-4926-9bd3-7ad6553eb596",
    "service": "d427b527-1019-4de7-979f-e2f9780af28c",
    "quote": "f27e8ec3-85f6-4b3e-a58a-77fb7c62dbf3",
    "departure_date": "2026-05-10",
    "arrive_date": "2026-05-10",
    "departure_time": "08:00:00",
    "arrive_time": "12:00:00",
    "person_name": "Pedro Suárez",
    "service_name": "Valle Sagrado de los Incas (Vip)",
    "created_at": "2026-02-26T05:40:26.467470Z"
  }
  ```

### Delete Service Quote Person
Este endpoint nos permite eliminar un _ServiceQuotePerson_ pasando el id por la url
- Delete: http://localhost:8000/api/service-quote-person/6cb85a5f-b982-412b-ada1-4c3536e4cca1/
- Respuesta: Status 204 No Content


## Quote
Este módulo nos permite gestionar las cotizaciones, aquí se pueden crear cotizaciones, agregar servicios a las cotizaciones, eliminar servicios de las cotizaciones, obtener el resumen de una cotización y también se pueden generar las versiones de las cotizaciones.
### Get Quote
- Get Quote: http://localhost:8000/api/quote/
- Get Quote by Id: http://localhost:8000/api/quote/f27e8ec3-85f6-4b3e-a58a-77fb7c62
- Respuesta:
  ```json
  {
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
      {
        "id": "26e8039a-2c7f-4e19-a8ff-6c6dea529836",
        "status": "draft",
        "version": 1,
        "version_display": "1",
        "contact_info": "Natalia Ríos",
        "valid_until": "2026-03-28",
        "total_price": "1080.00",
        "is_public": false,
        "notes": null,
        "created_at": "2026-02-26T05:46:23.460767Z",
        "updated_at": "2026-02-26T05:46:23.460772Z",
        "group": "68e747ec-fabc-4b35-b04e-f0ffee469a79",
        "parent_quote": null,
        "all_versions": [
          {
            "id": "26e8039a-2c7f-4e19-a8ff-6c6dea529836",
            "version": "1",
            "total_price": "1080.00",
            "created_at": "2026-02-26T05:46:23.460767Z"
          }
        ],
        "detail_quote_by_person": [
          {
            "person_id": "8a360e25-d85d-4901-be3d-88f12108d617",
            "person_name": "Natalia Ríos",
            "total": 154.28571428571428,
            "services": [
              {
                "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
                "service_type": "private",
                "service_name": "Machu Picchu \"Conexión Amanecer\"",
                "cost": 154.28571428571428,
                "departure": "2026-05-10 08:00:00"
              }
            ]
          },
          {
            "person_id": "3fcc4079-4b95-4ec1-a729-ff2eed4d7b07",
            "person_name": "Pasajero Temp temp1",
            "total": 154.28571428571428,
            "services": [
              {
                "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
                "service_type": "private",
                "service_name": "Machu Picchu \"Conexión Amanecer\"",
                "cost": 154.28571428571428,
                "departure": "2026-05-10 08:00:00"
              }
            ]
          },
          {
            "person_id": "f0826ebc-548d-4abd-ab65-82a5740732fa",
            "person_name": "Felipe Castillo",
            "total": 154.28571428571428,
            "services": [
              {
                "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
                "service_type": "private",
                "service_name": "Machu Picchu \"Conexión Amanecer\"",
                "cost": 154.28571428571428,
                "departure": "2026-05-10 08:00:00"
              }
            ]
          },
          {
            "person_id": "a4c8b815-354f-4939-a6ab-1753ae59923b",
            "person_name": "Carolina Vega",
            "total": 154.28571428571428,
            "services": [
              {
                "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
                "service_type": "private",
                "service_name": "Machu Picchu \"Conexión Amanecer\"",
                "cost": 154.28571428571428,
                "departure": "2026-05-10 08:00:00"
              }
            ]
          },
          {
            "person_id": "22c72505-860c-4e5d-88a0-2913473ca879",
            "person_name": "Martin Rios Martinez",
            "total": 154.28571428571428,
            "services": [
              {
                "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
                "service_type": "private",
                "service_name": "Machu Picchu \"Conexión Amanecer\"",
                "cost": 154.28571428571428,
                "departure": "2026-05-10 08:00:00"
              }
            ]
          },
          {
            "person_id": "f8f30244-81de-4eb9-b929-480b189a70a3",
            "person_name": "Pasajero Temp temp1",
            "total": 308.57142857142856,
            "services": [
              {
                "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
                "service_type": "private",
                "service_name": "Machu Picchu \"Conexión Amanecer\"",
                "cost": 154.28571428571428,
                "departure": "2026-05-10 08:00:00"
              },
              {
                "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
                "service_type": "private",
                "service_name": "Machu Picchu \"Conexión Amanecer\"",
                "cost": 154.28571428571428,
                "departure": "2026-05-10 08:00:00"
              }
            ]
          }
        ]
      },
      ...
    ]
  }
  ```

### Post Quote
Este endpoint nos permite crear una cotización pasando en el cuerpo los datos requeridos
- Post Quote: http://localhost:8000/api/quote/
- Body:
  ```json
  {
    "status": "draft",
    "version": 1,
    "valid_until": "2025-11-11",
    "notes": "string",
    "group": "c13c99b9-df45-4a25-a821-9025719b795e"
  }  
  ```
- Respuesta:
  ```json
  {
    "id": "4e440f00-37cb-4f2f-84e0-460670d60750",
    "status": "draft",
    "version": 1,
    "version_display": "1",
    "contact_info": null,
    "valid_until": "2025-11-11",
    "total_price": "0.00",
    "notes": "string",
    "created_at": "2026-02-27T15:18:46.690471Z",
    "updated_at": "2026-02-27T15:18:46.690480Z",
    "group": "c13c99b9-df45-4a25-a821-9025719b795e",
    "parent_quote": null,
    "all_versions": [
      {
        "id": "4e440f00-37cb-4f2f-84e0-460670d60750",
        "version": "1",
        "total_price": "0.00",
        "created_at": "2026-02-27T15:18:46.690471Z"
      }
    ],
    "detail_quote_by_person": []
  }
  ```
  
### Patch Quote
Este endpoint nos permite actualizar una cotización pasando solo lo que se desea actualizar o todo el cuerpo
- Patch: http://localhost:8000/api/quote/4e440f00-37cb-4f2f-84e0-460670d60750/
- Body
  ```json
  {
    "notes": "No hay carne",
    "valid_until": "2025-11-12"
  }
  ```
- Respuesta:
  ```json
  {
    "id": "4e440f00-37cb-4f2f-84e0-460670d60750",
    "status": "draft",
    "version": 1,
    "version_display": "1",
    "contact_info": null,
    "valid_until": "2025-11-12",
    "total_price": "0.00",
    "notes": "No hay carne",
    "created_at": "2026-02-27T15:18:46.690471Z",
    "updated_at": "2026-02-27T15:26:13.583424Z",
    "group": "c13c99b9-df45-4a25-a821-9025719b795e",
    "parent_quote": null,
    "all_versions": [
      {
        "id": "4e440f00-37cb-4f2f-84e0-460670d60750",
        "version": "1",
        "total_price": "0.00",
        "created_at": "2026-02-27T15:18:46.690471Z"
      }
    ],
    "detail_quote_by_person": []
  }
  ```
### Delete Quote
Este endpoint nos permite eliminar una cotización pasando el id por la url
- Delete: http://localhost:8000/api/quote/4e440f00-37cb-4f2f-84e0-460670d60750/
- Respuesta: Status 204 No Content

### Actions
#### Bulk Create Quote
Este Modulo te permite crear cotizaciones de manera masiva, pasando una lista de cotizaciones en el cuerpo, esto es útil para crear cotizaciones de cada grupo de manera masiva.
- Bulk Create Quote: `POST` http://localhost:8000/api/quote/all-in-one-quote/
- Body:
  ```json
  {
    "contact_info": {
      "first_name": "Natalia",
      "last_name": "Ríos",
      "email": "n.rios@empresa.com",
      "phone_number": "999888777",
      "passport_number": "CO998877",
      "nationality": "CO"
    },
    "notes": "Son Personas que ya vinieron antes al Peru",
    "services": [
      {
        "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "person_temp_id": "contact",
        "departure_date": "2026-05-10",
        "departure_time": "08:00:00",
        "arrive_date": "2026-05-10",
        "arrive_time": "12:00:00",
        "notes": "Coordinadora del equipo"
      },
      {
        "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "person_temp_id": "temp1",
        "departure_date": "2026-05-10",
        "departure_time": "08:00:00",
        "arrive_date": "2026-05-10",
        "arrive_time": "12:00:00",
        "notes": "Asistente invitado"
      },
      {
        "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "person_temp_id": {
          "first_name": "Felipe",
          "last_name": "Castillo",
          "email": "f.castillo@empresa.com",
          "phone_number": "999888666",
          "passport_number": "CO998866",
          "nationality": "CO"
        },
        "departure_date": "2026-05-10",
        "departure_time": "08:00:00",
        "arrive_date": "2026-05-10",
        "arrive_time": "12:00:00",
        "notes": "Gerente de ventas"
      },
      {
        "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "person_temp_id": {
          "first_name": "Carolina",
          "last_name": "Vega",
          "email": "c.vega@empresa.com",
          "phone_number": "999888555",
          "passport_number": "CO998855",
          "nationality": "CO"
        },
        "departure_date": "2026-05-10",
        "departure_time": "08:00:00",
        "arrive_date": "2026-05-10",
        "arrive_time": "12:00:00",
        "notes": "Directora de marketing"
      },
  
      {
        "service_id": "7da1b512-b886-4471-bf14-f7b295990532",
        "person_temp_id": "contact",
        "departure_date": "2026-05-11",
        "departure_time": "09:00:00",
        "arrive_date": "2026-05-11",
        "arrive_time": "13:30:00",
        "notes": "Servicio adicional - traslado aeropuerto"
      },
      {
        "service_id": "0e629236-9d16-449e-9b8c-d05e75918090",
        "person_temp_id": "temp2",
        "departure_date": "2026-05-12",
        "departure_time": "07:30:00",
        "arrive_date": "2026-05-12",
        "arrive_time": "11:45:00",
        "notes": "Participante extra"
      },
      {
        "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
        "person_temp_id": {
          "first_name": "Luis",
          "last_name": "Morales",
          "email": "l.morales@empresa.com",
          "phone_number": "999777444",
          "passport_number": "CO112233",
          "nationality": "CO"
        },
        "departure_date": "2026-05-13",
        "departure_time": "10:15:00",
        "arrive_date": "2026-05-13",
        "arrive_time": "14:20:00",
        "notes": "Supervisor regional"
      },
      {
        "service_id": "553847c6-44b9-4f18-9870-b462943ab202",
        "person_temp_id": {
          "first_name": "Andrea",
          "last_name": "Pardo",
          "email": "a.pardo@empresa.com",
          "phone_number": "999666333",
          "passport_number": "CO445566",
          "nationality": "CO"
        },
        "departure_date": "2026-05-14",
        "departure_time": "06:45:00",
        "arrive_date": "2026-05-14",
        "arrive_time": "11:10:00",
        "notes": "Invitada especial"
      }
    ]
  } 
  ```
- Respuesta:
  ```json
  {
    "quote_id": "53811972-9021-4e46-82a4-487e15394755",
    "group_id": "6c138d82-acea-444f-9c58-6c649d0a118a",
    "group_name": "GRP-LCFFUG",
    "total_price": 1655.0,
    "total_people": 7,
    "created_group": true
  } 
  ```

#### Create Version
Este endpoint nos permite crear una nueva versión de una cotización existente, pasando el id de la cotización por la url
- Create Version: `POST` http://localhost:8000/api/quote/f27e8ec3-85f6-4b3e-a58a-77fb7c62dbf3/create-version/
- Respuesta:
  ```json
  {
    "message": "New version created successfully",
    "cloned_items_count": 8,
    "quote": {
      "id": "908f3ec4-6852-4f82-8745-08615fdc352c",
      "status": "draft",
      "version": 3,
      "version_display": "1.3",
      "contact_info": "Natalia Ríos",
      "valid_until": "2026-03-29",
      "total_price": "1655.00",
      "notes": "Son Personas que ya vinieron antes al Peru",
      "created_at": "2026-03-02T19:59:14.455046Z",
      "updated_at": "2026-03-02T19:59:14.455067Z",
      "group": "55b027d7-3def-4332-9a04-1e502b548d8b",
      "parent_quote": "6363fe6f-fa03-4736-9d40-89b3fea9ea8a",
      "all_versions": [
        {
          "id": "6363fe6f-fa03-4736-9d40-89b3fea9ea8a",
          "version": "1",
          "total_price": "1655.00",
          "created_at": "2026-02-27T15:43:28.708838Z"
        },
        {
          "id": "353beca5-7662-4f1d-a851-d06906edfc51",
          "version": "1.2",
          "total_price": "1655.00",
          "created_at": "2026-02-27T16:00:35.091755Z"
        },
        {
          "id": "3bf62604-e671-47db-9e85-af96b83188b6",
          "version": "1.2",
          "total_price": "1655.00",
          "created_at": "2026-02-27T15:45:20.493426Z"
        },
        {
          "id": "908f3ec4-6852-4f82-8745-08615fdc352c",
          "version": "1.3",
          "total_price": "1655.00",
          "created_at": "2026-03-02T19:59:14.455046Z"
        },
        {
          "id": "8482b00e-20c2-4e47-95b0-611bdc5ad7f4",
          "version": "1.3",
          "total_price": "1655.00",
          "created_at": "2026-02-27T16:12:42.846144Z"
        }
      ],
      "detail_quote_by_person": [
        {
          "person_id": "8a360e25-d85d-4901-be3d-88f12108d617",
          "person_name": "Natalia Ríos",
          "total": 430.0,
          "services": [
            {
              "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
              "service_type": "private",
              "service_name": "Machu Picchu \"Conexión Amanecer\"",
              "cost": 180.0,
              "departure": "2026-05-10 08:00:00"
            },
            {
              "service_id": "7da1b512-b886-4471-bf14-f7b295990532",
              "service_type": "group",
              "service_name": "El Camino del Apu Ausangate",
              "cost": 250.0,
              "departure": "2026-05-11 09:00:00"
            }
          ]
        },
        {
          "person_id": "bbce136c-e1bc-4e42-b2ca-923d48907a6c",
          "person_name": "Pasajero Temp temp1",
          "total": 180.0,
          "services": [
            {
              "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
              "service_type": "private",
              "service_name": "Machu Picchu \"Conexión Amanecer\"",
              "cost": 180.0,
              "departure": "2026-05-10 08:00:00"
            }
          ]
        },
        {
          "person_id": "f0826ebc-548d-4abd-ab65-82a5740732fa",
          "person_name": "Felipe Castillo",
          "total": 180.0,
          "services": [
            {
              "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
              "service_type": "private",
              "service_name": "Machu Picchu \"Conexión Amanecer\"",
              "cost": 180.0,
              "departure": "2026-05-10 08:00:00"
            }
          ]
        },
        {
          "person_id": "a4c8b815-354f-4939-a6ab-1753ae59923b",
          "person_name": "Carolina Vega",
          "total": 180.0,
          "services": [
            {
              "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
              "service_type": "private",
              "service_name": "Machu Picchu \"Conexión Amanecer\"",
              "cost": 180.0,
              "departure": "2026-05-10 08:00:00"
            }
          ]
        },
        {
          "person_id": "d1301730-b3eb-4160-b72f-7e09b54218b1",
          "person_name": "Pasajero Temp temp2",
          "total": 420.0,
          "services": [
            {
              "service_id": "0e629236-9d16-449e-9b8c-d05e75918090",
              "service_type": "arbitrary",
              "service_name": "Salkantay Trek a Machu Picchu",
              "cost": 420.0,
              "departure": "2026-05-12 07:30:00"
            }
          ]
        },
        {
          "person_id": "79a96ad1-6a63-40da-b1ab-3561c03dd8fe",
          "person_name": "Luis Morales",
          "total": 240.0,
          "services": [
            {
              "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
              "service_type": "private",
              "service_name": "Valle Sagrado de los Incas (Vip)",
              "cost": 240.0,
              "departure": "2026-05-13 10:15:00"
            }
          ]
        },
        {
          "person_id": "1bffa2a7-8eb8-482a-85a7-1005aae1fee4",
          "person_name": "Andrea Pardo",
          "total": 25.0,
          "services": [
            {
              "service_id": "553847c6-44b9-4f18-9870-b462943ab202",
              "service_type": "group",
              "service_name": "City Tour Cusco",
              "cost": 25.0,
              "departure": "2026-05-14 06:45:00"
            }
          ]
        }
      ]
    }
  }
  ```

#### Full Detail
Este endpoint nos permite obtener el detalle completo de una cotización, pasando el id de la cotización por la url, esto incluye el detalle de cada persona y los servicios asociados a cada persona.
- Full Detail: `GET` http://localhost:8000/api/quote/f27e8ec3-85f6-4b3e-a58a-77fb7c62dbf3/full-detail/
- Respuesta:
```json
{
  "id": "26e8039a-2c7f-4e19-a8ff-6c6dea529836",
  "status": "draft",
  "version": 1,
  "version_display": "1",
  "contact_info": "Natalia Ríos",
  "valid_until": "2026-03-28",
  "total_price": "1080.00",
  "notes": null,
  "created_at": "2026-02-26T05:46:23.460767Z",
  "updated_at": "2026-02-26T05:46:23.460772Z",
  "parent_quote": null,
  "all_versions": [
    {
      "id": "26e8039a-2c7f-4e19-a8ff-6c6dea529836",
      "version": "1",
      "total_price": "1080.00",
      "status": "draft",
      "created_at": "2026-02-26T05:46:23.460767Z"
    }
  ],
  "group_info": {
    "id": "68e747ec-fabc-4b35-b04e-f0ffee469a79",
    "name": "GRP-LV0FSD",
    "description": null,
    "contact_info": "Natalia Ríos",
    "total_people": 4,
    "created_at": "2026-02-26T05:46:23.443540Z"
  },
  "persons_detail": [
    {
      "id": "8a360e25-d85d-4901-be3d-88f12108d617",
      "full_name": "Natalia Ríos",
      "first_name": "Natalia",
      "last_name": "Ríos",
      "email": "n.rios@empresa.com",
      "phone_number": "999888777",
      "passport_number": "CO998877",
      "birth_date": null,
      "nationality": "CO",
      "is_generic": false,
      "total_cost": 154.28571428571428,
      "services_count": 1,
      "services": [
        {
          "service_quote_person_id": "1838de16-7763-4bfa-9e24-4d65d0414fc8",
          "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "service_name": "Machu Picchu \"Conexión Amanecer\"",
          "service_type": "private",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Coordinadora del equipo"
        }
      ],
      "media": []
    },
    {
      "id": "f0826ebc-548d-4abd-ab65-82a5740732fa",
      "full_name": "Felipe Castillo",
      "first_name": "Felipe",
      "last_name": "Castillo",
      "email": "f.castillo@empresa.com",
      "phone_number": "999888666",
      "passport_number": "CO998866",
      "birth_date": null,
      "nationality": "CO",
      "is_generic": false,
      "total_cost": 154.28571428571428,
      "services_count": 1,
      "services": [
        {
          "service_quote_person_id": "444bca72-5609-403e-8f98-8fc0fc8915cf",
          "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "service_name": "Machu Picchu \"Conexión Amanecer\"",
          "service_type": "private",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Gerente de ventas"
        }
      ],
      "media": []
    },
    {
      "id": "a4c8b815-354f-4939-a6ab-1753ae59923b",
      "full_name": "Carolina Vega",
      "first_name": "Carolina",
      "last_name": "Vega",
      "email": "c.vega@empresa.com",
      "phone_number": "999888555",
      "passport_number": "CO998855",
      "birth_date": null,
      "nationality": "CO",
      "is_generic": false,
      "total_cost": 154.28571428571428,
      "services_count": 1,
      "services": [
        {
          "service_quote_person_id": "ff59dc1a-d618-4a53-86e4-704b0dfd6f16",
          "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "service_name": "Machu Picchu \"Conexión Amanecer\"",
          "service_type": "private",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Directora de marketing"
        }
      ],
      "media": []
    },
    {
      "id": "f8f30244-81de-4eb9-b929-480b189a70a3",
      "full_name": "Pasajero Temp temp1",
      "first_name": "Pasajero",
      "last_name": "Temp temp1",
      "email": "temp.a919d9ad@sys.local",
      "phone_number": null,
      "passport_number": null,
      "birth_date": null,
      "nationality": null,
      "is_generic": true,
      "total_cost": 308.57142857142856,
      "services_count": 2,
      "services": [
        {
          "service_quote_person_id": "bff7ace3-0e11-45ce-b381-c86b93741a65",
          "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "service_name": "Machu Picchu \"Conexión Amanecer\"",
          "service_type": "private",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Coordinadora del equipo"
        },
        {
          "service_quote_person_id": "b7355582-5dd6-4d79-b342-4e7bd36a8a75",
          "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "service_name": "Machu Picchu \"Conexión Amanecer\"",
          "service_type": "private",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Coordinadora del equipo"
        }
      ],
      "media": []
    },
    {
      "id": "3fcc4079-4b95-4ec1-a729-ff2eed4d7b07",
      "full_name": "Pasajero Temp temp1",
      "first_name": "Pasajero",
      "last_name": "Temp temp1",
      "email": "temp.e0bcf7fc@sys.local",
      "phone_number": null,
      "passport_number": null,
      "birth_date": null,
      "nationality": null,
      "is_generic": true,
      "total_cost": 154.28571428571428,
      "services_count": 1,
      "services": [
        {
          "service_quote_person_id": "911b6a6e-53b8-4b67-bf9a-d98a0ca188b6",
          "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "service_name": "Machu Picchu \"Conexión Amanecer\"",
          "service_type": "private",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Asistente invitado"
        }
      ],
      "media": []
    },
    {
      "id": "22c72505-860c-4e5d-88a0-2913473ca879",
      "full_name": "Martin Rios Martinez",
      "first_name": "Martin",
      "last_name": "Rios Martinez",
      "email": "valentina.rios@example.com",
      "phone_number": "+5491122334455",
      "passport_number": "A7788990",
      "birth_date": "2000-01-30",
      "nationality": "US",
      "is_generic": false,
      "total_cost": 154.28571428571428,
      "services_count": 1,
      "services": [
        {
          "service_quote_person_id": "f2f11317-8455-4206-82bf-76badd24a300",
          "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "service_name": "Machu Picchu \"Conexión Amanecer\"",
          "service_type": "private",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Coordinadora del equipo"
        }
      ],
      "media": [
        {
          "id": "a232696d-eacb-4a9f-af6c-bdfdc1839f3f",
          "type": "image",
          "title": "Passport",
          "url": null,
          "file": "/media_files/media/2026/02/26/Screenshot_From_2026-02-19_15-50-08_73suEdz.png",
          "is_cover": false
        },
        {
          "id": "c00f406b-52c7-4829-a93a-762cb4f011ce",
          "type": "image",
          "title": "",
          "url": null,
          "file": "/media_files/media/2026/02/26/Screenshot_From_2026-02-19_15-50-08.png",
          "is_cover": false
        },
        {
          "id": "48d5b95f-ee15-47af-b172-38a02b2deba7",
          "type": "document",
          "title": "",
          "url": null,
          "file": "/media_files/media/2026/02/26/CONTRATO_DE_PRESTACI%C3%93N_DE_SERVICIOS_DE_DESARROLLO_WEB.pdf",
          "is_cover": false
        }
      ]
    }
  ],
  "services_detail": [
    {
      "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
      "title": "Machu Picchu \"Conexión Amanecer\"",
      "type": "private",
      "duration_value": 2,
      "duration_unit": "days",
      "summary": "<p>La&nbsp;experiencia&nbsp;completa&nbsp;para&nbsp;visitar&nbsp;la&nbsp;maravilla&nbsp;del&nbsp;mundo&nbsp;sin&nbsp;el&nbsp;agotamiento&nbsp;de&nbsp;ir&nbsp;y&nbsp;volver&nbsp;el&nbsp;mismo&nbsp;día.</p>",
      "includes": "<ul><li>Tickets&nbsp;de&nbsp;tren&nbsp;(Ida&nbsp;y&nbsp;Vuelta).</li><li>1&nbsp;noche&nbsp;de&nbsp;alojamiento&nbsp;en&nbsp;Aguas&nbsp;Calientes.</li><li>Entrada&nbsp;a&nbsp;Machu&nbsp;Picchu&nbsp;y&nbsp;bus&nbsp;Consettur.</li><li>Guía&nbsp;profesional&nbsp;bilingüe.</li></ul>",
      "excludes": "<ul><li>Entrada&nbsp;a&nbsp;Huayna&nbsp;Picchu&nbsp;(opcional).</li><li>Almuerzos&nbsp;y&nbsp;cenas&nbsp;no&nbsp;especificados.</li></ul>",
      "departure_time": "08:00:00",
      "reference_price": 360.0,
      "pricing_info": {
        "type": "private",
        "rules": [
          {
            "id": "52ee8be8-c502-4b43-bc44-dae3bd584ba5",
            "concept": "Guia",
            "amount": 240.0,
            "calculation_type": "divide"
          },
          {
            "id": "d9f77dd7-f008-44f7-83fe-fd3a63f39468",
            "concept": "Transporte",
            "amount": 60.0,
            "calculation_type": "multiply"
          },
          {
            "id": "b1b9f1e7-a23a-48c3-b42a-2b6ee62fd581",
            "concept": "Tickets",
            "amount": 30.0,
            "calculation_type": "multiply"
          },
          {
            "id": "49ce95d2-172f-47f4-88d6-5a72f6d49861",
            "concept": "Comida",
            "amount": 30.0,
            "calculation_type": "multiply"
          }
        ]
      },
      "persons_in_service": [
        {
          "service_quote_person_id": "1838de16-7763-4bfa-9e24-4d65d0414fc8",
          "person_id": "8a360e25-d85d-4901-be3d-88f12108d617",
          "person_name": "Natalia Ríos",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Coordinadora del equipo"
        },
        {
          "service_quote_person_id": "911b6a6e-53b8-4b67-bf9a-d98a0ca188b6",
          "person_id": "3fcc4079-4b95-4ec1-a729-ff2eed4d7b07",
          "person_name": "Pasajero Temp temp1",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Asistente invitado"
        },
        {
          "service_quote_person_id": "444bca72-5609-403e-8f98-8fc0fc8915cf",
          "person_id": "f0826ebc-548d-4abd-ab65-82a5740732fa",
          "person_name": "Felipe Castillo",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Gerente de ventas"
        },
        {
          "service_quote_person_id": "ff59dc1a-d618-4a53-86e4-704b0dfd6f16",
          "person_id": "a4c8b815-354f-4939-a6ab-1753ae59923b",
          "person_name": "Carolina Vega",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Directora de marketing"
        },
        {
          "service_quote_person_id": "f2f11317-8455-4206-82bf-76badd24a300",
          "person_id": "22c72505-860c-4e5d-88a0-2913473ca879",
          "person_name": "Martin Rios Martinez",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Coordinadora del equipo"
        },
        {
          "service_quote_person_id": "b7355582-5dd6-4d79-b342-4e7bd36a8a75",
          "person_id": "f8f30244-81de-4eb9-b929-480b189a70a3",
          "person_name": "Pasajero Temp temp1",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Coordinadora del equipo"
        },
        {
          "service_quote_person_id": "bff7ace3-0e11-45ce-b381-c86b93741a65",
          "person_id": "f8f30244-81de-4eb9-b929-480b189a70a3",
          "person_name": "Pasajero Temp temp1",
          "individual_cost": 154.28571428571428,
          "departure_date": "2026-05-10",
          "departure_time": "08:00:00",
          "arrive_date": "2026-05-10",
          "arrive_time": "12:00:00",
          "notes": "Coordinadora del equipo"
        }
      ],
      "total_cost_for_service": 1079.9999999999998,
      "itineraries": [
        {
          "id": "c7533408-f619-46ec-8deb-efde988df291",
          "title": "Dia 1",
          "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
        },
        {
          "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
          "title": "Dia 2",
          "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
        }
      ],
      "media": [
        {
          "id": "b74c2553-d7e9-46b2-ae73-1dc99dd3af5d",
          "type": "image",
          "title": "Cover",
          "description": "Service cover image",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_5_pLtRPAY.webp",
          "is_cover": true
        },
        {
          "id": "b5f9320f-d854-4ddb-8f7a-1dff084acd2a",
          "type": "image",
          "title": "Media 4",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_4_w0i5QEQ.webp",
          "is_cover": false
        },
        {
          "id": "ddb33e03-78b2-4502-adc5-51ab6f3f2e88",
          "type": "image",
          "title": "Media 3",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_3_GVie4xX.webp",
          "is_cover": false
        },
        {
          "id": "0b2258ea-ea06-4567-869d-80010b257a8d",
          "type": "image",
          "title": "Media 2",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_2_CFlfgPt.webp",
          "is_cover": false
        },
        {
          "id": "30e235a7-655b-4c11-b347-a2802abcf269",
          "type": "image",
          "title": "Media 1",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_1_Vlf0mx7.webp",
          "is_cover": false
        }
      ],
      "tags": [
        {
          "id": "71f5ab05-0b07-4849-bc88-fc3935897a08",
          "name": "Aventura"
        },
        {
          "id": "9f49912a-9809-45e1-ab9c-b67f4ddf132c",
          "name": "Historico"
        },
        {
          "id": "04a995be-55a8-428c-b2b7-2f1b8fa2784a",
          "name": "Trekking"
        }
      ]
    }
  ],
  "itinerary_schedule": [
    {
      "service_quote_person_id": "1838de16-7763-4bfa-9e24-4d65d0414fc8",
      "departure_date": "2026-05-10",
      "departure_time": "08:00:00",
      "arrive_date": "2026-05-10",
      "arrive_time": "12:00:00",
      "service": {
        "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "private",
        "duration_value": 2,
        "duration_unit": "days"
      },
      "person": {
        "id": "8a360e25-d85d-4901-be3d-88f12108d617",
        "full_name": "Natalia Ríos"
      },
      "cost": 154.28571428571428,
      "notes": "Coordinadora del equipo",
      "itinerary_details": [
        {
          "id": "c7533408-f619-46ec-8deb-efde988df291",
          "title": "Dia 1",
          "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
        },
        {
          "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
          "title": "Dia 2",
          "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
        }
      ]
    },
    {
      "service_quote_person_id": "444bca72-5609-403e-8f98-8fc0fc8915cf",
      "departure_date": "2026-05-10",
      "departure_time": "08:00:00",
      "arrive_date": "2026-05-10",
      "arrive_time": "12:00:00",
      "service": {
        "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "private",
        "duration_value": 2,
        "duration_unit": "days"
      },
      "person": {
        "id": "f0826ebc-548d-4abd-ab65-82a5740732fa",
        "full_name": "Felipe Castillo"
      },
      "cost": 154.28571428571428,
      "notes": "Gerente de ventas",
      "itinerary_details": [
        {
          "id": "c7533408-f619-46ec-8deb-efde988df291",
          "title": "Dia 1",
          "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
        },
        {
          "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
          "title": "Dia 2",
          "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
        }
      ]
    },
    {
      "service_quote_person_id": "ff59dc1a-d618-4a53-86e4-704b0dfd6f16",
      "departure_date": "2026-05-10",
      "departure_time": "08:00:00",
      "arrive_date": "2026-05-10",
      "arrive_time": "12:00:00",
      "service": {
        "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "private",
        "duration_value": 2,
        "duration_unit": "days"
      },
      "person": {
        "id": "a4c8b815-354f-4939-a6ab-1753ae59923b",
        "full_name": "Carolina Vega"
      },
      "cost": 154.28571428571428,
      "notes": "Directora de marketing",
      "itinerary_details": [
        {
          "id": "c7533408-f619-46ec-8deb-efde988df291",
          "title": "Dia 1",
          "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
        },
        {
          "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
          "title": "Dia 2",
          "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
        }
      ]
    },
    {
      "service_quote_person_id": "bff7ace3-0e11-45ce-b381-c86b93741a65",
      "departure_date": "2026-05-10",
      "departure_time": "08:00:00",
      "arrive_date": "2026-05-10",
      "arrive_time": "12:00:00",
      "service": {
        "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "private",
        "duration_value": 2,
        "duration_unit": "days"
      },
      "person": {
        "id": "f8f30244-81de-4eb9-b929-480b189a70a3",
        "full_name": "Pasajero Temp temp1"
      },
      "cost": 154.28571428571428,
      "notes": "Coordinadora del equipo",
      "itinerary_details": [
        {
          "id": "c7533408-f619-46ec-8deb-efde988df291",
          "title": "Dia 1",
          "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
        },
        {
          "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
          "title": "Dia 2",
          "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
        }
      ]
    },
    {
      "service_quote_person_id": "b7355582-5dd6-4d79-b342-4e7bd36a8a75",
      "departure_date": "2026-05-10",
      "departure_time": "08:00:00",
      "arrive_date": "2026-05-10",
      "arrive_time": "12:00:00",
      "service": {
        "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "private",
        "duration_value": 2,
        "duration_unit": "days"
      },
      "person": {
        "id": "f8f30244-81de-4eb9-b929-480b189a70a3",
        "full_name": "Pasajero Temp temp1"
      },
      "cost": 154.28571428571428,
      "notes": "Coordinadora del equipo",
      "itinerary_details": [
        {
          "id": "c7533408-f619-46ec-8deb-efde988df291",
          "title": "Dia 1",
          "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
        },
        {
          "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
          "title": "Dia 2",
          "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
        }
      ]
    },
    {
      "service_quote_person_id": "911b6a6e-53b8-4b67-bf9a-d98a0ca188b6",
      "departure_date": "2026-05-10",
      "departure_time": "08:00:00",
      "arrive_date": "2026-05-10",
      "arrive_time": "12:00:00",
      "service": {
        "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "private",
        "duration_value": 2,
        "duration_unit": "days"
      },
      "person": {
        "id": "3fcc4079-4b95-4ec1-a729-ff2eed4d7b07",
        "full_name": "Pasajero Temp temp1"
      },
      "cost": 154.28571428571428,
      "notes": "Asistente invitado",
      "itinerary_details": [
        {
          "id": "c7533408-f619-46ec-8deb-efde988df291",
          "title": "Dia 1",
          "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
        },
        {
          "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
          "title": "Dia 2",
          "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
        }
      ]
    },
    {
      "service_quote_person_id": "f2f11317-8455-4206-82bf-76badd24a300",
      "departure_date": "2026-05-10",
      "departure_time": "08:00:00",
      "arrive_date": "2026-05-10",
      "arrive_time": "12:00:00",
      "service": {
        "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "private",
        "duration_value": 2,
        "duration_unit": "days"
      },
      "person": {
        "id": "22c72505-860c-4e5d-88a0-2913473ca879",
        "full_name": "Martin Rios Martinez"
      },
      "cost": 154.28571428571428,
      "notes": "Coordinadora del equipo",
      "itinerary_details": [
        {
          "id": "c7533408-f619-46ec-8deb-efde988df291",
          "title": "Dia 1",
          "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
        },
        {
          "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
          "title": "Dia 2",
          "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
        }
      ]
    }
  ],
  "media_files": {
    "services_media": [
      {
        "id": "b74c2553-d7e9-46b2-ae73-1dc99dd3af5d",
        "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "service_title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "image",
        "title": "Cover",
        "description": "Service cover image",
        "url": null,
        "file": "/media_files/media/2026/02/24/image_5_pLtRPAY.webp",
        "is_cover": true
      },
      {
        "id": "b5f9320f-d854-4ddb-8f7a-1dff084acd2a",
        "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "service_title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "image",
        "title": "Media 4",
        "description": "",
        "url": null,
        "file": "/media_files/media/2026/02/24/image_4_w0i5QEQ.webp",
        "is_cover": false
      },
      {
        "id": "ddb33e03-78b2-4502-adc5-51ab6f3f2e88",
        "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "service_title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "image",
        "title": "Media 3",
        "description": "",
        "url": null,
        "file": "/media_files/media/2026/02/24/image_3_GVie4xX.webp",
        "is_cover": false
      },
      {
        "id": "0b2258ea-ea06-4567-869d-80010b257a8d",
        "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "service_title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "image",
        "title": "Media 2",
        "description": "",
        "url": null,
        "file": "/media_files/media/2026/02/24/image_2_CFlfgPt.webp",
        "is_cover": false
      },
      {
        "id": "30e235a7-655b-4c11-b347-a2802abcf269",
        "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "service_title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "image",
        "title": "Media 1",
        "description": "",
        "url": null,
        "file": "/media_files/media/2026/02/24/image_1_Vlf0mx7.webp",
        "is_cover": false
      }
    ],
    "persons_media": [
      {
        "id": "a232696d-eacb-4a9f-af6c-bdfdc1839f3f",
        "person_id": "22c72505-860c-4e5d-88a0-2913473ca879",
        "person_name": "Martin Rios Martinez",
        "type": "image",
        "title": "Passport",
        "description": "Es el pasaporte",
        "url": null,
        "file": "/media_files/media/2026/02/26/Screenshot_From_2026-02-19_15-50-08_73suEdz.png",
        "is_cover": false
      },
      {
        "id": "c00f406b-52c7-4829-a93a-762cb4f011ce",
        "person_id": "22c72505-860c-4e5d-88a0-2913473ca879",
        "person_name": "Martin Rios Martinez",
        "type": "image",
        "title": "",
        "description": "",
        "url": null,
        "file": "/media_files/media/2026/02/26/Screenshot_From_2026-02-19_15-50-08.png",
        "is_cover": false
      },
      {
        "id": "48d5b95f-ee15-47af-b172-38a02b2deba7",
        "person_id": "22c72505-860c-4e5d-88a0-2913473ca879",
        "person_name": "Martin Rios Martinez",
        "type": "document",
        "title": "",
        "description": "",
        "url": null,
        "file": "/media_files/media/2026/02/26/CONTRATO_DE_PRESTACI%C3%93N_DE_SERVICIOS_DE_DESARROLLO_WEB.pdf",
        "is_cover": false
      }
    ]
  },
  "cost_summary": {
    "total_price": 1080.0,
    "total_services": 1,
    "total_persons": 6,
    "by_service_type": {
      "group": {
        "count": 0,
        "total": 0.0
      },
      "private": {
        "count": 7,
        "total": 1079.9999999999998
      },
      "arbitrary": {
        "count": 0,
        "total": 0.0
      }
    },
    "by_person": [
      {
        "person_id": "8a360e25-d85d-4901-be3d-88f12108d617",
        "person_name": "Natalia Ríos",
        "total": 154.28571428571428,
        "services_count": 1
      },
      {
        "person_id": "f0826ebc-548d-4abd-ab65-82a5740732fa",
        "person_name": "Felipe Castillo",
        "total": 154.28571428571428,
        "services_count": 1
      },
      {
        "person_id": "a4c8b815-354f-4939-a6ab-1753ae59923b",
        "person_name": "Carolina Vega",
        "total": 154.28571428571428,
        "services_count": 1
      },
      {
        "person_id": "f8f30244-81de-4eb9-b929-480b189a70a3",
        "person_name": "Pasajero Temp temp1",
        "total": 308.57142857142856,
        "services_count": 2
      },
      {
        "person_id": "3fcc4079-4b95-4ec1-a729-ff2eed4d7b07",
        "person_name": "Pasajero Temp temp1",
        "total": 154.28571428571428,
        "services_count": 1
      },
      {
        "person_id": "22c72505-860c-4e5d-88a0-2913473ca879",
        "person_name": "Martin Rios Martinez",
        "total": 154.28571428571428,
        "services_count": 1
      }
    ],
    "by_service": [
      {
        "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "service_name": "Machu Picchu \"Conexión Amanecer\"",
        "service_type": "private",
        "total": 1079.9999999999998,
        "persons_count": 7
      }
    ]
  }
}
```

#### Summary Quote
Este endpoint nos devuelve un resumen de la cotización con el detalle de cada servicio, cada persona y un resumen general de costos.
- Summary Quote: - Summary Quote: http://localhost:8000/api/quote/26e8039a-2c7f-4e19-a8ff-6c6dea529836/summary/
- Respuesta:
```json
{
  "quote_id": "26e8039a-2c7f-4e19-a8ff-6c6dea529836",
  "version": "1",
  "customer": "Natalia Ríos",
  "total_general": 1080.0,
  "breakdown_by_service_type": {
    "group": 0,
    "private": 1079.9999999999998,
    "arbitrary": 0
  },
  "itinerary": [
    {
      "date": "2026-05-10",
      "time": "08:00:00",
      "service": "Machu Picchu \"Conexión Amanecer\"",
      "type": "private",
      "passenger": "Natalia Ríos",
      "individual_cost": 154.28571428571428
    },
    {
      "date": "2026-05-10",
      "time": "08:00:00",
      "service": "Machu Picchu \"Conexión Amanecer\"",
      "type": "private",
      "passenger": "Felipe Castillo",
      "individual_cost": 154.28571428571428
    },
    {
      "date": "2026-05-10",
      "time": "08:00:00",
      "service": "Machu Picchu \"Conexión Amanecer\"",
      "type": "private",
      "passenger": "Carolina Vega",
      "individual_cost": 154.28571428571428
    },
    {
      "date": "2026-05-10",
      "time": "08:00:00",
      "service": "Machu Picchu \"Conexión Amanecer\"",
      "type": "private",
      "passenger": "Pasajero Temp temp1",
      "individual_cost": 154.28571428571428
    },
    {
      "date": "2026-05-10",
      "time": "08:00:00",
      "service": "Machu Picchu \"Conexión Amanecer\"",
      "type": "private",
      "passenger": "Pasajero Temp temp1",
      "individual_cost": 154.28571428571428
    },
    {
      "date": "2026-05-10",
      "time": "08:00:00",
      "service": "Machu Picchu \"Conexión Amanecer\"",
      "type": "private",
      "passenger": "Pasajero Temp temp1",
      "individual_cost": 154.28571428571428
    },
    {
      "date": "2026-05-10",
      "time": "08:00:00",
      "service": "Machu Picchu \"Conexión Amanecer\"",
      "type": "private",
      "passenger": "Martin Rios Martinez",
      "individual_cost": 154.28571428571428
    }
  ]
}
```


#### Set Public
Este endpoint nos permite cambiar el estado de la cotización a publico o privado, para poder compartir con los clientes
- Set Public: `POST` http://localhost:8000/api/quote/26e8039a-2c7f-4e19-a8ff-6c6dea529836/toggle-public/
- Respuesta: 
  ```json
  {
    "quote_id": "40edc3d0-363e-46ca-9605-0e9b8fe270d3",
    "is_public": true,
    "message": "Cotización ahora es pública",
    "public_url": "http://localhost:8000/api/quote/public/40edc3d0-363e-46ca-9605-0e9b8fe270d3/"
  }
  ``` 

#### Get Quote Public
Este endpoint nos permite obtener la información de la cotización en caso que esta haya sido marcada como pública, no es necesario estar autenticado para acceder a esta información
- Get Quote Public: http://localhost:8000/api/quote/public/40edc3d0-363e-46ca-9605-0e9b8fe270d3/
- Respuesta:
  ```json
  {
    "id": "40edc3d0-363e-46ca-9605-0e9b8fe270d3",
    "status": "draft",
    "version": 2,
    "version_display": "1.2",
    "contact_info": "Cristian Monzon Guzman",
    "valid_until": "2026-04-02",
    "is_expired": false,
    "total_price": "3740.00",
    "notes": "",
    "created_at": "2026-03-03T01:19:40.928405Z",
    "updated_at": "2026-03-03T01:19:40.928416Z",
    "group_info": {
      "id": "345c18f9-7f88-4c7c-b27b-3580fcfb6508",
      "name": "GRP-PFGDA7",
      "description": null,
      "contact_info": "Cristian Monzon Guzman",
      "total_people": 8,
      "created_at": "2026-03-03T01:16:05.523887Z"
    },
    "persons_detail": [
      {
        "id": "cb5788e3-827d-42bb-ac31-394aabc4a7a4",
        "full_name": "Pepe Pepe",
        "first_name": "Pepe",
        "last_name": "Pepe",
        "email": "pepe@example.com",
        "phone_number": null,
        "passport_number": null,
        "birth_date": null,
        "nationality": "PE",
        "is_generic": false,
        "total_cost": 300.0,
        "services_count": 3,
        "services": [
          {
            "service_quote_person_id": "ffd0727c-ce8a-4def-a5c4-bbb7c313b062",
            "service_id": "553847c6-44b9-4f18-9870-b462943ab202",
            "service_name": "City Tour Cusco",
            "service_type": "group",
            "individual_cost": 25.0,
            "departure_date": "2026-03-02",
            "departure_time": "08:00:00",
            "arrive_date": "2026-03-06",
            "arrive_time": "20:11:00",
            "notes": null
          },
          {
            "service_quote_person_id": "ed7bb2e8-c24b-4daf-8a04-3d560747d662",
            "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
            "service_name": "Machu Picchu \"Conexión Amanecer\"",
            "service_type": "private",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "dad141c9-a17a-4dc4-957a-79c4233c2428",
            "service_id": "0e629236-9d16-449e-9b8c-d05e75918090",
            "service_name": "Salkantay Trek a Machu Picchu",
            "service_type": "arbitrary",
            "individual_cost": 125.0,
            "departure_date": "2026-03-02",
            "departure_time": "20:13:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "21:13:00",
            "notes": null
          }
        ],
        "photos": []
      },
      {
        "id": "e2b9f682-8c8b-42fc-90b5-e638263de8e7",
        "full_name": "Mario Maria",
        "first_name": "Mario",
        "last_name": "Maria",
        "email": "maria@example.com",
        "phone_number": null,
        "passport_number": null,
        "birth_date": null,
        "nationality": null,
        "is_generic": false,
        "total_cost": 540.0,
        "services_count": 4,
        "services": [
          {
            "service_quote_person_id": "7915b9aa-3c71-40a2-8dc6-5daf5de11f9a",
            "service_id": "553847c6-44b9-4f18-9870-b462943ab202",
            "service_name": "City Tour Cusco",
            "service_type": "group",
            "individual_cost": 25.0,
            "departure_date": "2026-03-02",
            "departure_time": "08:00:00",
            "arrive_date": "2026-03-06",
            "arrive_time": "20:11:00",
            "notes": null
          },
          {
            "service_quote_person_id": "248e4aea-7bb1-4dcd-b6e6-3b2fcd0de130",
            "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
            "service_name": "Valle Sagrado de los Incas (Vip)",
            "service_type": "private",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "73ac7f8a-ddad-4097-9b2c-8cb59e93773e",
            "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
            "service_name": "Machu Picchu \"Conexión Amanecer\"",
            "service_type": "private",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "23e6cc61-623e-4b48-94b9-503a10acb3ab",
            "service_id": "7da1b512-b886-4471-bf14-f7b295990532",
            "service_name": "El Camino del Apu Ausangate",
            "service_type": "group",
            "individual_cost": 250.0,
            "departure_date": "2026-03-24",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "20:16:00",
            "notes": null
          }
        ],
        "photos": []
      },
      {
        "id": "2e9a70d4-e9c4-4c59-9f11-4f89acc2d14d",
        "full_name": "Pasajero Temp temp-2",
        "first_name": "Pasajero",
        "last_name": "Temp temp-2",
        "email": "temp.0310d22f@sys.local",
        "phone_number": null,
        "passport_number": null,
        "birth_date": null,
        "nationality": null,
        "is_generic": true,
        "total_cost": 540.0,
        "services_count": 4,
        "services": [
          {
            "service_quote_person_id": "f8939de2-eab6-49f6-b861-114d4c4e6926",
            "service_id": "553847c6-44b9-4f18-9870-b462943ab202",
            "service_name": "City Tour Cusco",
            "service_type": "group",
            "individual_cost": 25.0,
            "departure_date": "2026-03-02",
            "departure_time": "08:00:00",
            "arrive_date": "2026-03-06",
            "arrive_time": "20:11:00",
            "notes": null
          },
          {
            "service_quote_person_id": "678ceab6-b874-4013-958a-8597c45aec2f",
            "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
            "service_name": "Valle Sagrado de los Incas (Vip)",
            "service_type": "private",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "7665f609-be2c-4ce8-b3c1-085028b7e61e",
            "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
            "service_name": "Machu Picchu \"Conexión Amanecer\"",
            "service_type": "private",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "afa1343c-9df9-4df6-b143-ae9ed295514a",
            "service_id": "7da1b512-b886-4471-bf14-f7b295990532",
            "service_name": "El Camino del Apu Ausangate",
            "service_type": "group",
            "individual_cost": 250.0,
            "departure_date": "2026-03-02",
            "departure_time": "09:00:00",
            "arrive_date": "2026-04-02",
            "arrive_time": "20:36:00",
            "notes": null
          }
        ],
        "photos": []
      },
      {
        "id": "28497a1f-d82c-4291-8790-7e5a1d9e929d",
        "full_name": "Cristian Monzon Guzman",
        "first_name": "Cristian",
        "last_name": "Monzon Guzman",
        "email": "cristian-02-@live.com",
        "phone_number": "940576340",
        "passport_number": "AEF8799238",
        "birth_date": null,
        "nationality": "PE",
        "is_generic": false,
        "total_cost": 415.0,
        "services_count": 4,
        "services": [
          {
            "service_quote_person_id": "6ebdb674-c240-429a-9d8d-e8d450d81d2c",
            "service_id": "553847c6-44b9-4f18-9870-b462943ab202",
            "service_name": "City Tour Cusco",
            "service_type": "group",
            "individual_cost": 25.0,
            "departure_date": "2026-03-02",
            "departure_time": "08:00:00",
            "arrive_date": "2026-03-06",
            "arrive_time": "20:11:00",
            "notes": null
          },
          {
            "service_quote_person_id": "ac2d76e7-6d3f-4b36-a3fe-c156660f2816",
            "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
            "service_name": "Valle Sagrado de los Incas (Vip)",
            "service_type": "private",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "b03a00a7-1701-4aed-bd73-469e20bc181d",
            "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
            "service_name": "Machu Picchu \"Conexión Amanecer\"",
            "service_type": "private",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "938ce35e-c847-41cb-8ab6-ec1d89da764c",
            "service_id": "0e629236-9d16-449e-9b8c-d05e75918090",
            "service_name": "Salkantay Trek a Machu Picchu",
            "service_type": "arbitrary",
            "individual_cost": 125.0,
            "departure_date": "2026-03-02",
            "departure_time": "20:13:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "21:13:00",
            "notes": null
          }
        ],
        "photos": []
      },
      {
        "id": "83aea660-c830-460d-bef9-e0e87f347bd0",
        "full_name": "Pasajero Temp temp-5",
        "first_name": "Pasajero",
        "last_name": "Temp temp-5",
        "email": "temp.c9c58cc3@sys.local",
        "phone_number": null,
        "passport_number": null,
        "birth_date": null,
        "nationality": null,
        "is_generic": true,
        "total_cost": 515.0,
        "services_count": 3,
        "services": [
          {
            "service_quote_person_id": "77094529-782f-4ae3-8408-edbcd3afa378",
            "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
            "service_name": "Valle Sagrado de los Incas (Vip)",
            "service_type": "private",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "c1e94e46-59de-4f20-9f34-c02dd3a62b68",
            "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
            "service_name": "Machu Picchu \"Conexión Amanecer\"",
            "service_type": "private",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "17f3612b-0d09-4260-86ed-02d4ed9de4eb",
            "service_id": "7da1b512-b886-4471-bf14-f7b295990532",
            "service_name": "El Camino del Apu Ausangate",
            "service_type": "group",
            "individual_cost": 250.0,
            "departure_date": "2026-03-24",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "20:16:00",
            "notes": null
          }
        ],
        "photos": []
      },
      {
        "id": "bd8f423d-3422-45ee-bbb7-6f775f9c11c4",
        "full_name": "Jose Maria",
        "first_name": "Jose",
        "last_name": "Maria",
        "email": "Jose@example.com",
        "phone_number": "",
        "passport_number": "",
        "birth_date": null,
        "nationality": "CL",
        "is_generic": false,
        "total_cost": 515.0,
        "services_count": 3,
        "services": [
          {
            "service_quote_person_id": "f06d0787-1856-426f-9d16-8a52f7b96848",
            "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
            "service_name": "Valle Sagrado de los Incas (Vip)",
            "service_type": "private",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "d2089327-2d0f-43dc-95d1-26d945af18d7",
            "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
            "service_name": "Machu Picchu \"Conexión Amanecer\"",
            "service_type": "private",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "bef465fa-8767-4fbc-ba4a-5e34f16f890a",
            "service_id": "7da1b512-b886-4471-bf14-f7b295990532",
            "service_name": "El Camino del Apu Ausangate",
            "service_type": "group",
            "individual_cost": 250.0,
            "departure_date": "2026-03-24",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "20:16:00",
            "notes": null
          }
        ],
        "photos": []
      },
      {
        "id": "46bbf972-5677-4e46-8f71-0450e729d25a",
        "full_name": "Pasajero Temp temp-1",
        "first_name": "Pasajero",
        "last_name": "Temp temp-1",
        "email": "temp.6dca7786@sys.local",
        "phone_number": null,
        "passport_number": null,
        "birth_date": null,
        "nationality": null,
        "is_generic": true,
        "total_cost": 390.0,
        "services_count": 3,
        "services": [
          {
            "service_quote_person_id": "2af17790-a042-4951-98fa-bdea56881f2d",
            "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
            "service_name": "Valle Sagrado de los Incas (Vip)",
            "service_type": "private",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "c2452895-bab3-40e6-b5db-1f1830ea8d02",
            "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
            "service_name": "Machu Picchu \"Conexión Amanecer\"",
            "service_type": "private",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "868838d2-9444-4a25-bdba-c43bba9ca653",
            "service_id": "0e629236-9d16-449e-9b8c-d05e75918090",
            "service_name": "Salkantay Trek a Machu Picchu",
            "service_type": "arbitrary",
            "individual_cost": 125.0,
            "departure_date": "2026-03-02",
            "departure_time": "20:13:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "21:13:00",
            "notes": null
          }
        ],
        "photos": []
      },
      {
        "id": "fb4740fc-a415-42aa-a535-497956a3198f",
        "full_name": "Luis Bustamante",
        "first_name": "Luis",
        "last_name": "Bustamante",
        "email": "luis@example.com",
        "phone_number": "940786777",
        "passport_number": "",
        "birth_date": null,
        "nationality": "EE",
        "is_generic": false,
        "total_cost": 525.0,
        "services_count": 3,
        "services": [
          {
            "service_quote_person_id": "141fc31b-b6c0-4c51-ac28-180009c28fa1",
            "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
            "service_name": "Machu Picchu \"Conexión Amanecer\"",
            "service_type": "private",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "84d9ed7c-930a-4c83-99a0-331feeef13be",
            "service_id": "0e629236-9d16-449e-9b8c-d05e75918090",
            "service_name": "Salkantay Trek a Machu Picchu",
            "service_type": "arbitrary",
            "individual_cost": 125.0,
            "departure_date": "2026-03-02",
            "departure_time": "20:13:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "21:13:00",
            "notes": null
          },
          {
            "service_quote_person_id": "f9fb495e-7c65-47b4-bac2-86e932f3a75b",
            "service_id": "7da1b512-b886-4471-bf14-f7b295990532",
            "service_name": "El Camino del Apu Ausangate",
            "service_type": "group",
            "individual_cost": 250.0,
            "departure_date": "2026-03-24",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "20:16:00",
            "notes": null
          }
        ],
        "photos": []
      }
    ],
    "services_detail": [
      {
        "id": "553847c6-44b9-4f18-9870-b462943ab202",
        "title": "City Tour Cusco",
        "type": "group",
        "duration_value": 5,
        "duration_unit": "hours",
        "summary": "<p>La&nbsp;introducción&nbsp;perfecta&nbsp;a&nbsp;la&nbsp;capital&nbsp;imperial.&nbsp;Este&nbsp;recorrido&nbsp;combina&nbsp;la&nbsp;riqueza&nbsp;colonial&nbsp;del&nbsp;centro&nbsp;de&nbsp;la&nbsp;ciudad&nbsp;con&nbsp;la&nbsp;monumentalidad&nbsp;de&nbsp;los&nbsp;centros&nbsp;arqueológicos&nbsp;periféricos,&nbsp;permitiéndole&nbsp;entender&nbsp;la&nbsp;superposición&nbsp;de&nbsp;culturas&nbsp;en&nbsp;el&nbsp;ombligo&nbsp;del&nbsp;mundo.</p>",
        "includes": "<ul><li>Guía&nbsp;profesional&nbsp;bilingüe&nbsp;(Español/Inglés).</li><li>Transporte&nbsp;turístico&nbsp;moderno&nbsp;con&nbsp;conductor&nbsp;profesional.</li><li>Recojo&nbsp;del&nbsp;punto&nbsp;de&nbsp;encuentro&nbsp;céntrico.</li></ul>",
        "excludes": "<ul><li>Boleto&nbsp;Turístico&nbsp;del&nbsp;Cusco&nbsp;(BTG).</li><li>Entrada&nbsp;al&nbsp;Templo&nbsp;del&nbsp;Qoricancha&nbsp;(20&nbsp;soles).</li><li>Alimentación&nbsp;y&nbsp;gastos&nbsp;personales.</li></ul>",
        "departure_time": "09:00:00",
        "reference_price": 25.0,
        "pricing_info": {
          "type": "group",
          "reference_price": 25.0,
          "description": "Precio por persona (grupo)"
        },
        "persons_in_service": [
          {
            "service_quote_person_id": "ffd0727c-ce8a-4def-a5c4-bbb7c313b062",
            "person_id": "cb5788e3-827d-42bb-ac31-394aabc4a7a4",
            "person_name": "Pepe Pepe",
            "individual_cost": 25.0,
            "departure_date": "2026-03-02",
            "departure_time": "08:00:00",
            "arrive_date": "2026-03-06",
            "arrive_time": "20:11:00",
            "notes": null
          },
          {
            "service_quote_person_id": "7915b9aa-3c71-40a2-8dc6-5daf5de11f9a",
            "person_id": "e2b9f682-8c8b-42fc-90b5-e638263de8e7",
            "person_name": "Mario Maria",
            "individual_cost": 25.0,
            "departure_date": "2026-03-02",
            "departure_time": "08:00:00",
            "arrive_date": "2026-03-06",
            "arrive_time": "20:11:00",
            "notes": null
          },
          {
            "service_quote_person_id": "f8939de2-eab6-49f6-b861-114d4c4e6926",
            "person_id": "2e9a70d4-e9c4-4c59-9f11-4f89acc2d14d",
            "person_name": "Pasajero Temp temp-2",
            "individual_cost": 25.0,
            "departure_date": "2026-03-02",
            "departure_time": "08:00:00",
            "arrive_date": "2026-03-06",
            "arrive_time": "20:11:00",
            "notes": null
          },
          {
            "service_quote_person_id": "6ebdb674-c240-429a-9d8d-e8d450d81d2c",
            "person_id": "28497a1f-d82c-4291-8790-7e5a1d9e929d",
            "person_name": "Cristian Monzon Guzman",
            "individual_cost": 25.0,
            "departure_date": "2026-03-02",
            "departure_time": "08:00:00",
            "arrive_date": "2026-03-06",
            "arrive_time": "20:11:00",
            "notes": null
          }
        ],
        "total_cost_for_service": 100.0,
        "people_count": 4,
        "itineraries": [
          {
            "id": "d4b0b3b7-8785-4bba-8b5d-06c56b5483c2",
            "title": "09:00 AM",
            "description": "<p>Visita&nbsp;guiada&nbsp;al&nbsp;Templo&nbsp;del&nbsp;Sol&nbsp;(Qoricancha).</p>",
            "created_at": "2026-02-24T20:51:47.763531Z"
          },
          {
            "id": "a5eb79ff-37eb-44e3-aeb4-84a20dfa283e",
            "title": "10:30 AM",
            "description": "<p>Traslado&nbsp;y&nbsp;recorrido&nbsp;por&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Sacsayhuaman.</p>",
            "created_at": "2026-02-24T20:51:47.765616Z"
          },
          {
            "id": "519f8dda-3280-4c2d-ad1d-4b69eea6b510",
            "title": "11:30 AM",
            "description": "<p>Visita&nbsp;al&nbsp;centro&nbsp;ritual&nbsp;de&nbsp;Qenqo.</p>",
            "created_at": "2026-02-24T20:51:47.766317Z"
          },
          {
            "id": "2bad7dfd-6e61-49c0-abc0-4b26ea2d7c1d",
            "title": "12:15 PM",
            "description": "<p>Parada&nbsp;en&nbsp;Puca&nbsp;Pucara&nbsp;(Fortaleza&nbsp;Roja).</p>",
            "created_at": "2026-02-24T20:51:47.767019Z"
          },
          {
            "id": "47f2ac2a-91f6-4ecf-895d-75a393ca6341",
            "title": "12:45 PM",
            "description": "<p>Visita&nbsp;a&nbsp;las&nbsp;fuentes&nbsp;ceremoniales&nbsp;de&nbsp;Tambomachay.</p>",
            "created_at": "2026-02-24T20:51:47.767698Z"
          },
          {
            "id": "a5d12cdb-efe8-47ed-b195-ef618ed0847a",
            "title": "02:00 PM",
            "description": "<p>Retorno&nbsp;al&nbsp;centro&nbsp;de&nbsp;Cusco.</p>",
            "created_at": "2026-02-24T20:51:47.768347Z"
          }
        ],
        "photos": [
          {
            "id": "7bc4356e-d0ff-4b97-bcbe-d9a156726b5d",
            "type": "image",
            "title": "Cover",
            "description": "Service cover image",
            "url": null,
            "file": "/media_files/media/2026/02/24/imagen_1.webp",
            "is_cover": true
          },
          {
            "id": "2fcf28b2-db23-4a75-a854-214623198977",
            "type": "image",
            "title": "Media 4",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/imagen_5.webp",
            "is_cover": false
          },
          {
            "id": "5ef3666c-bf60-48d4-83fc-0a9f51395f55",
            "type": "image",
            "title": "Media 3",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/imagen_4.webp",
            "is_cover": false
          },
          {
            "id": "ffb249c8-8934-4591-8635-d7e00c089f92",
            "type": "image",
            "title": "Media 2",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/imagen_3.webp",
            "is_cover": false
          },
          {
            "id": "a71c6f47-622c-45fa-9bab-f0f8f708b48f",
            "type": "image",
            "title": "Media 1",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/imagen_2.webp",
            "is_cover": false
          }
        ],
        "tags": [
          {
            "id": "9f49912a-9809-45e1-ab9c-b67f4ddf132c",
            "name": "Historico"
          },
          {
            "id": "04a995be-55a8-428c-b2b7-2f1b8fa2784a",
            "name": "Trekking"
          }
        ]
      },
      {
        "id": "d427b527-1019-4de7-979f-e2f9780af28c",
        "title": "Valle Sagrado de los Incas (Vip)",
        "type": "private",
        "duration_value": 2,
        "duration_unit": "days",
        "summary": "<p>Un&nbsp;recorrido&nbsp;profundo&nbsp;por&nbsp;el&nbsp;valle&nbsp;más&nbsp;fértil&nbsp;de&nbsp;los&nbsp;Andes,&nbsp;visitando&nbsp;laboratorios&nbsp;agrícolas&nbsp;y&nbsp;pueblos&nbsp;que&nbsp;mantienen&nbsp;viva&nbsp;la&nbsp;cultura&nbsp;inca.</p>",
        "includes": "<ul><li>Transporte&nbsp;turístico&nbsp;para&nbsp;todos&nbsp;los&nbsp;traslados.</li><li>Almuerzo&nbsp;buffet&nbsp;en&nbsp;Urubamba.</li><li>Guía&nbsp;certificado.</li></ul><p></p>",
        "excludes": "<ul><li>Boleto&nbsp;Turístico&nbsp;Integral&nbsp;(130&nbsp;soles).</li><li>Gastos&nbsp;en&nbsp;mercados&nbsp;artesanales.</li></ul>",
        "departure_time": "09:00:00",
        "reference_price": 240.0,
        "pricing_info": {
          "type": "private",
          "rules": [
            {
              "id": "2dfebbe8-993a-4bac-b105-8faba16aae70",
              "concept": "Guia",
              "amount": 150.0,
              "calculation_type": "divide",
              "description": "Dividido entre personas"
            },
            {
              "id": "c2a18db1-daee-4784-837f-50ab0f380cb4",
              "concept": "Transporte",
              "amount": 40.0,
              "calculation_type": "multiply",
              "description": "Por persona"
            },
            {
              "id": "3704d36f-080e-4dc2-b585-991825007403",
              "concept": "Comida",
              "amount": 30.0,
              "calculation_type": "multiply",
              "description": "Por persona"
            },
            {
              "id": "ebff5d72-abab-48de-ba4b-942ab07ba3fb",
              "concept": "Tickets",
              "amount": 20.0,
              "calculation_type": "multiply",
              "description": "Por persona"
            }
          ],
          "description": "Precio calculado según reglas"
        },
        "persons_in_service": [
          {
            "service_quote_person_id": "77094529-782f-4ae3-8408-edbcd3afa378",
            "person_id": "83aea660-c830-460d-bef9-e0e87f347bd0",
            "person_name": "Pasajero Temp temp-5",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "248e4aea-7bb1-4dcd-b6e6-3b2fcd0de130",
            "person_id": "e2b9f682-8c8b-42fc-90b5-e638263de8e7",
            "person_name": "Mario Maria",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "f06d0787-1856-426f-9d16-8a52f7b96848",
            "person_id": "bd8f423d-3422-45ee-bbb7-6f775f9c11c4",
            "person_name": "Jose Maria",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "678ceab6-b874-4013-958a-8597c45aec2f",
            "person_id": "2e9a70d4-e9c4-4c59-9f11-4f89acc2d14d",
            "person_name": "Pasajero Temp temp-2",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "2af17790-a042-4951-98fa-bdea56881f2d",
            "person_id": "46bbf972-5677-4e46-8f71-0450e729d25a",
            "person_name": "Pasajero Temp temp-1",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          },
          {
            "service_quote_person_id": "ac2d76e7-6d3f-4b36-a3fe-c156660f2816",
            "person_id": "28497a1f-d82c-4291-8790-7e5a1d9e929d",
            "person_name": "Cristian Monzon Guzman",
            "individual_cost": 115.0,
            "departure_date": "2026-03-03",
            "departure_time": "20:16:00",
            "arrive_date": "2026-03-19",
            "arrive_time": "20:17:00",
            "notes": null
          }
        ],
        "total_cost_for_service": 690.0,
        "people_count": 6,
        "itineraries": [
          {
            "id": "5f073e6e-6076-4943-afcb-0a35fd4fb99c",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;hacia&nbsp;Chinchero&nbsp;para&nbsp;ver&nbsp;demostraciones&nbsp;textiles.&nbsp;Visita&nbsp;a&nbsp;los&nbsp;laboratorios&nbsp;agrícolas&nbsp;de&nbsp;Moray&nbsp;y&nbsp;las&nbsp;Salineras&nbsp;de&nbsp;Maras.&nbsp;Pernocte&nbsp;en&nbsp;Ollantaytambo&nbsp;o&nbsp;Cusco.</p>",
            "created_at": "2026-02-24T20:57:33.207470Z"
          },
          {
            "id": "72ea1660-fc41-47bc-ae5a-187409b99c73",
            "title": "Dia 2",
            "description": "<p>Exploración&nbsp;de&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Ollantaytambo&nbsp;y&nbsp;el&nbsp;mercado&nbsp;de&nbsp;Pisac.&nbsp;Almuerzo&nbsp;buffet&nbsp;incluido&nbsp;en&nbsp;el&nbsp;corazón&nbsp;del&nbsp;Valle.&nbsp;Retorno&nbsp;a&nbsp;Cusco&nbsp;por&nbsp;la&nbsp;tarde.</p>",
            "created_at": "2026-02-24T20:57:33.208496Z"
          }
        ],
        "photos": [
          {
            "id": "26e40d05-a40e-4e3f-96fc-30270574e3f8",
            "type": "image",
            "title": "Cover",
            "description": "Service cover image",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_3.webp",
            "is_cover": true
          },
          {
            "id": "aebe7690-f676-469b-b985-7cf33daa9725",
            "type": "image",
            "title": "Media 4",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_5.webp",
            "is_cover": false
          },
          {
            "id": "65087896-57c4-44e7-ba10-5312c11d6345",
            "type": "image",
            "title": "Media 3",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_4.webp",
            "is_cover": false
          },
          {
            "id": "d9500639-f8aa-436b-84ff-368ce3d8ea85",
            "type": "image",
            "title": "Media 2",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_2.webp",
            "is_cover": false
          },
          {
            "id": "8109ba85-cea3-46de-939b-d56184db732f",
            "type": "image",
            "title": "Media 1",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_1.webp",
            "is_cover": false
          }
        ],
        "tags": [
          {
            "id": "71f5ab05-0b07-4849-bc88-fc3935897a08",
            "name": "Aventura"
          },
          {
            "id": "9f49912a-9809-45e1-ab9c-b67f4ddf132c",
            "name": "Historico"
          },
          {
            "id": "04a995be-55a8-428c-b2b7-2f1b8fa2784a",
            "name": "Trekking"
          }
        ]
      },
      {
        "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
        "title": "Machu Picchu \"Conexión Amanecer\"",
        "type": "private",
        "duration_value": 2,
        "duration_unit": "days",
        "summary": "<p>La&nbsp;experiencia&nbsp;completa&nbsp;para&nbsp;visitar&nbsp;la&nbsp;maravilla&nbsp;del&nbsp;mundo&nbsp;sin&nbsp;el&nbsp;agotamiento&nbsp;de&nbsp;ir&nbsp;y&nbsp;volver&nbsp;el&nbsp;mismo&nbsp;día.</p>",
        "includes": "<ul><li>Tickets&nbsp;de&nbsp;tren&nbsp;(Ida&nbsp;y&nbsp;Vuelta).</li><li>1&nbsp;noche&nbsp;de&nbsp;alojamiento&nbsp;en&nbsp;Aguas&nbsp;Calientes.</li><li>Entrada&nbsp;a&nbsp;Machu&nbsp;Picchu&nbsp;y&nbsp;bus&nbsp;Consettur.</li><li>Guía&nbsp;profesional&nbsp;bilingüe.</li></ul>",
        "excludes": "<ul><li>Entrada&nbsp;a&nbsp;Huayna&nbsp;Picchu&nbsp;(opcional).</li><li>Almuerzos&nbsp;y&nbsp;cenas&nbsp;no&nbsp;especificados.</li></ul>",
        "departure_time": "08:00:00",
        "reference_price": 360.0,
        "pricing_info": {
          "type": "private",
          "rules": [
            {
              "id": "52ee8be8-c502-4b43-bc44-dae3bd584ba5",
              "concept": "Guia",
              "amount": 240.0,
              "calculation_type": "divide",
              "description": "Dividido entre personas"
            },
            {
              "id": "d9f77dd7-f008-44f7-83fe-fd3a63f39468",
              "concept": "Transporte",
              "amount": 60.0,
              "calculation_type": "multiply",
              "description": "Por persona"
            },
            {
              "id": "b1b9f1e7-a23a-48c3-b42a-2b6ee62fd581",
              "concept": "Tickets",
              "amount": 30.0,
              "calculation_type": "multiply",
              "description": "Por persona"
            },
            {
              "id": "49ce95d2-172f-47f4-88d6-5a72f6d49861",
              "concept": "Comida",
              "amount": 30.0,
              "calculation_type": "multiply",
              "description": "Por persona"
            }
          ],
          "description": "Precio calculado según reglas"
        },
        "persons_in_service": [
          {
            "service_quote_person_id": "ed7bb2e8-c24b-4daf-8a04-3d560747d662",
            "person_id": "cb5788e3-827d-42bb-ac31-394aabc4a7a4",
            "person_name": "Pepe Pepe",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "141fc31b-b6c0-4c51-ac28-180009c28fa1",
            "person_id": "fb4740fc-a415-42aa-a535-497956a3198f",
            "person_name": "Luis Bustamante",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "c1e94e46-59de-4f20-9f34-c02dd3a62b68",
            "person_id": "83aea660-c830-460d-bef9-e0e87f347bd0",
            "person_name": "Pasajero Temp temp-5",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "73ac7f8a-ddad-4097-9b2c-8cb59e93773e",
            "person_id": "e2b9f682-8c8b-42fc-90b5-e638263de8e7",
            "person_name": "Mario Maria",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "d2089327-2d0f-43dc-95d1-26d945af18d7",
            "person_id": "bd8f423d-3422-45ee-bbb7-6f775f9c11c4",
            "person_name": "Jose Maria",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "7665f609-be2c-4ce8-b3c1-085028b7e61e",
            "person_id": "2e9a70d4-e9c4-4c59-9f11-4f89acc2d14d",
            "person_name": "Pasajero Temp temp-2",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "c2452895-bab3-40e6-b5db-1f1830ea8d02",
            "person_id": "46bbf972-5677-4e46-8f71-0450e729d25a",
            "person_name": "Pasajero Temp temp-1",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "b03a00a7-1701-4aed-bd73-469e20bc181d",
            "person_id": "28497a1f-d82c-4291-8790-7e5a1d9e929d",
            "person_name": "Cristian Monzon Guzman",
            "individual_cost": 150.0,
            "departure_date": "2026-03-01",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-07",
            "arrive_time": "20:16:00",
            "notes": null
          }
        ],
        "total_cost_for_service": 1200.0,
        "people_count": 8,
        "itineraries": [
          {
            "id": "c7533408-f619-46ec-8deb-efde988df291",
            "title": "Dia 1",
            "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>",
            "created_at": "2026-02-24T21:10:34.959665Z"
          },
          {
            "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
            "title": "Dia 2",
            "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>",
            "created_at": "2026-02-24T21:10:34.960650Z"
          }
        ],
        "photos": [
          {
            "id": "b74c2553-d7e9-46b2-ae73-1dc99dd3af5d",
            "type": "image",
            "title": "Cover",
            "description": "Service cover image",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_5_pLtRPAY.webp",
            "is_cover": true
          },
          {
            "id": "b5f9320f-d854-4ddb-8f7a-1dff084acd2a",
            "type": "image",
            "title": "Media 4",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_4_w0i5QEQ.webp",
            "is_cover": false
          },
          {
            "id": "ddb33e03-78b2-4502-adc5-51ab6f3f2e88",
            "type": "image",
            "title": "Media 3",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_3_GVie4xX.webp",
            "is_cover": false
          },
          {
            "id": "0b2258ea-ea06-4567-869d-80010b257a8d",
            "type": "image",
            "title": "Media 2",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_2_CFlfgPt.webp",
            "is_cover": false
          },
          {
            "id": "30e235a7-655b-4c11-b347-a2802abcf269",
            "type": "image",
            "title": "Media 1",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_1_Vlf0mx7.webp",
            "is_cover": false
          }
        ],
        "tags": [
          {
            "id": "71f5ab05-0b07-4849-bc88-fc3935897a08",
            "name": "Aventura"
          },
          {
            "id": "9f49912a-9809-45e1-ab9c-b67f4ddf132c",
            "name": "Historico"
          },
          {
            "id": "04a995be-55a8-428c-b2b7-2f1b8fa2784a",
            "name": "Trekking"
          }
        ]
      },
      {
        "id": "0e629236-9d16-449e-9b8c-d05e75918090",
        "title": "Salkantay Trek a Machu Picchu",
        "type": "arbitrary",
        "duration_value": 4,
        "duration_unit": "days",
        "summary": "<p>Una&nbsp;caminata&nbsp;épica&nbsp;que&nbsp;atraviesa&nbsp;desde&nbsp;picos&nbsp;nevados&nbsp;hasta&nbsp;la&nbsp;densa&nbsp;selva&nbsp;alta,&nbsp;llegando&nbsp;a&nbsp;Machu&nbsp;Picchu&nbsp;por&nbsp;una&nbsp;ruta&nbsp;alternativa.</p>",
        "includes": "<ul><li>Equipo&nbsp;de&nbsp;camping&nbsp;y&nbsp;cocinero&nbsp;de&nbsp;montaña.</li><li>Mulas&nbsp;para&nbsp;carga&nbsp;de&nbsp;equipaje.</li><li>Todas&nbsp;las&nbsp;comidas&nbsp;durante&nbsp;la&nbsp;ruta.</li><li>Entrada&nbsp;a&nbsp;Machu&nbsp;Picchu&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno.</li></ul>",
        "excludes": "<ul><li>Bolsa&nbsp;de&nbsp;dormir&nbsp;(Sleeping&nbsp;bag).</li><li>Caballo&nbsp;de&nbsp;silla&nbsp;personal.</li></ul>",
        "departure_time": "10:00:00",
        "reference_price": 420.0,
        "pricing_info": {
          "type": "arbitrary",
          "tiers": [
            {
              "id": "8cfed8a9-d057-4da0-972f-1381048cc205",
              "min_people": 1,
              "max_people": 2,
              "total_price": 420.0,
              "price_per_person": 420.0
            },
            {
              "id": "810c102b-3b6b-42b7-8dcc-0b4d8681540a",
              "min_people": 2,
              "max_people": 4,
              "total_price": 500.0,
              "price_per_person": 250.0
            },
            {
              "id": "3c3968b3-b078-4470-abb9-e5476e519e83",
              "min_people": 5,
              "max_people": 8,
              "total_price": 1000.0,
              "price_per_person": 200.0
            }
          ],
          "description": "Precio según número de personas"
        },
        "persons_in_service": [
          {
            "service_quote_person_id": "84d9ed7c-930a-4c83-99a0-331feeef13be",
            "person_id": "fb4740fc-a415-42aa-a535-497956a3198f",
            "person_name": "Luis Bustamante",
            "individual_cost": 125.0,
            "departure_date": "2026-03-02",
            "departure_time": "20:13:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "21:13:00",
            "notes": null
          },
          {
            "service_quote_person_id": "dad141c9-a17a-4dc4-957a-79c4233c2428",
            "person_id": "cb5788e3-827d-42bb-ac31-394aabc4a7a4",
            "person_name": "Pepe Pepe",
            "individual_cost": 125.0,
            "departure_date": "2026-03-02",
            "departure_time": "20:13:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "21:13:00",
            "notes": null
          },
          {
            "service_quote_person_id": "868838d2-9444-4a25-bdba-c43bba9ca653",
            "person_id": "46bbf972-5677-4e46-8f71-0450e729d25a",
            "person_name": "Pasajero Temp temp-1",
            "individual_cost": 125.0,
            "departure_date": "2026-03-02",
            "departure_time": "20:13:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "21:13:00",
            "notes": null
          },
          {
            "service_quote_person_id": "938ce35e-c847-41cb-8ab6-ec1d89da764c",
            "person_id": "28497a1f-d82c-4291-8790-7e5a1d9e929d",
            "person_name": "Cristian Monzon Guzman",
            "individual_cost": 125.0,
            "departure_date": "2026-03-02",
            "departure_time": "20:13:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "21:13:00",
            "notes": null
          }
        ],
        "total_cost_for_service": 500.0,
        "people_count": 4,
        "itineraries": [
          {
            "id": "5baaaa3d-9c77-461b-a32f-00b47d575cdf",
            "title": "Dia 1",
            "description": "<p>Cusco&nbsp;a&nbsp;Soraypampa.&nbsp;Visita&nbsp;a&nbsp;la&nbsp;Laguna&nbsp;Humantay&nbsp;(4,200m).</p>",
            "created_at": "2026-02-24T21:27:04.305552Z"
          },
          {
            "id": "518182f7-f255-4aec-b558-d6c89a580164",
            "title": "Dia 2",
            "description": "<p>Cruce&nbsp;del&nbsp;Abra&nbsp;Salkantay,&nbsp;el&nbsp;punto&nbsp;más&nbsp;alto,&nbsp;y&nbsp;descenso&nbsp;hacia&nbsp;el&nbsp;bosque&nbsp;nuboso&nbsp;(Chaullay).</p>",
            "created_at": "2026-02-24T21:27:04.306551Z"
          },
          {
            "id": "6180062f-dd71-486d-bbad-d88f35918016",
            "title": "Dia 3",
            "description": "<p>Caminata&nbsp;por&nbsp;el&nbsp;valle&nbsp;de&nbsp;Santa&nbsp;Teresa&nbsp;hacia&nbsp;Hidroeléctrica&nbsp;y&nbsp;finalmente&nbsp;Aguas&nbsp;Calientes.</p>",
            "created_at": "2026-02-24T21:27:04.307408Z"
          }
        ],
        "photos": [
          {
            "id": "e5ffded8-58e3-432a-a9da-8e8d35df27d2",
            "type": "image",
            "title": "Cover",
            "description": "Service cover image",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_5_0DxFd2F.webp",
            "is_cover": true
          },
          {
            "id": "05eb3e99-2e0a-4184-b128-9ccbfd2b154c",
            "type": "image",
            "title": "Media 4",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_4_COjljnw.webp",
            "is_cover": false
          },
          {
            "id": "9f3a01ac-0ea0-4141-860c-9cb325417c19",
            "type": "image",
            "title": "Media 3",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_3_DFJ1Bqh.webp",
            "is_cover": false
          },
          {
            "id": "28356626-0c72-4381-871b-9f00ad560c23",
            "type": "image",
            "title": "Media 2",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_2_1Tv6HrO.webp",
            "is_cover": false
          },
          {
            "id": "eafed371-7d49-436d-bf1c-74ede9a2e317",
            "type": "image",
            "title": "Media 1",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_1_ffhtWdw.webp",
            "is_cover": false
          }
        ],
        "tags": [
          {
            "id": "71f5ab05-0b07-4849-bc88-fc3935897a08",
            "name": "Aventura"
          },
          {
            "id": "04a995be-55a8-428c-b2b7-2f1b8fa2784a",
            "name": "Trekking"
          }
        ]
      },
      {
        "id": "7da1b512-b886-4471-bf14-f7b295990532",
        "title": "El Camino del Apu Ausangate",
        "type": "group",
        "duration_value": 3,
        "duration_unit": "days",
        "summary": "<p>Un&nbsp;tour&nbsp;diseñado&nbsp;para&nbsp;fotógrafos&nbsp;y&nbsp;montañistas&nbsp;que&nbsp;buscan&nbsp;paisajes&nbsp;irreales&nbsp;y&nbsp;la&nbsp;famosa&nbsp;Montaña&nbsp;de&nbsp;Siete&nbsp;Colores.</p>",
        "includes": "<ul><li>Transporte&nbsp;privado&nbsp;ida&nbsp;y&nbsp;vuelta.</li><li>Alimentación&nbsp;de&nbsp;alta&nbsp;montaña.</li><li>Equipo&nbsp;de&nbsp;primeros&nbsp;auxilios&nbsp;y&nbsp;oxígeno.</li><li>Guía&nbsp;experto&nbsp;en&nbsp;alta&nbsp;montaña.</li></ul>",
        "excludes": "<ul><li>Entradas&nbsp;a&nbsp;las&nbsp;comunidades&nbsp;locales.</li><li>Alquiler&nbsp;de&nbsp;caballos&nbsp;opcionales.</li></ul>",
        "departure_time": "09:00:00",
        "reference_price": 250.0,
        "pricing_info": {
          "type": "group",
          "reference_price": 250.0,
          "description": "Precio por persona (grupo)"
        },
        "persons_in_service": [
          {
            "service_quote_person_id": "afa1343c-9df9-4df6-b143-ae9ed295514a",
            "person_id": "2e9a70d4-e9c4-4c59-9f11-4f89acc2d14d",
            "person_name": "Pasajero Temp temp-2",
            "individual_cost": 250.0,
            "departure_date": "2026-03-02",
            "departure_time": "09:00:00",
            "arrive_date": "2026-04-02",
            "arrive_time": "20:36:00",
            "notes": null
          },
          {
            "service_quote_person_id": "bef465fa-8767-4fbc-ba4a-5e34f16f890a",
            "person_id": "bd8f423d-3422-45ee-bbb7-6f775f9c11c4",
            "person_name": "Jose Maria",
            "individual_cost": 250.0,
            "departure_date": "2026-03-24",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "23e6cc61-623e-4b48-94b9-503a10acb3ab",
            "person_id": "e2b9f682-8c8b-42fc-90b5-e638263de8e7",
            "person_name": "Mario Maria",
            "individual_cost": 250.0,
            "departure_date": "2026-03-24",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "f9fb495e-7c65-47b4-bac2-86e932f3a75b",
            "person_id": "fb4740fc-a415-42aa-a535-497956a3198f",
            "person_name": "Luis Bustamante",
            "individual_cost": 250.0,
            "departure_date": "2026-03-24",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "20:16:00",
            "notes": null
          },
          {
            "service_quote_person_id": "17f3612b-0d09-4260-86ed-02d4ed9de4eb",
            "person_id": "83aea660-c830-460d-bef9-e0e87f347bd0",
            "person_name": "Pasajero Temp temp-5",
            "individual_cost": 250.0,
            "departure_date": "2026-03-24",
            "departure_time": "20:15:00",
            "arrive_date": "2026-05-14",
            "arrive_time": "20:16:00",
            "notes": null
          }
        ],
        "total_cost_for_service": 1250.0,
        "people_count": 5,
        "itineraries": [
          {
            "id": "88ebb82a-b947-4d82-b8d8-ad993bde6c90",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;de&nbsp;Cusco&nbsp;hacia&nbsp;Upis,&nbsp;camping&nbsp;al&nbsp;pie&nbsp;del&nbsp;nevado&nbsp;Ausangate&nbsp;con&nbsp;baños&nbsp;termales.</p>",
            "created_at": "2026-02-24T21:31:28.441193Z"
          },
          {
            "id": "bcebb020-0071-44a0-b12b-1d99d9012687",
            "title": "Dia 2",
            "description": "<p>Caminata&nbsp;por&nbsp;pasos&nbsp;de&nbsp;altura&nbsp;rodeando&nbsp;lagunas&nbsp;turquesas&nbsp;(Pucacocha).&nbsp;Campamento&nbsp;cerca&nbsp;de&nbsp;la&nbsp;montaña&nbsp;de&nbsp;colores.</p>",
            "created_at": "2026-02-24T21:31:28.442258Z"
          },
          {
            "id": "8dd7764f-5342-4e63-921f-7f22726ba4db",
            "title": "Dia 3",
            "description": "<p>Llegada&nbsp;a&nbsp;Vinicunca&nbsp;(Montaña&nbsp;Arcoíris)&nbsp;temprano&nbsp;en&nbsp;la&nbsp;mañana&nbsp;antes&nbsp;de&nbsp;la&nbsp;multitud.&nbsp;Descenso&nbsp;y&nbsp;retorno&nbsp;a&nbsp;la&nbsp;ciudad&nbsp;de&nbsp;Cusco.</p><p></p>",
            "created_at": "2026-02-24T21:31:28.442974Z"
          }
        ],
        "photos": [
          {
            "id": "74d46f2b-98ac-4702-8323-35bcafa7a486",
            "type": "image",
            "title": "Cover",
            "description": "Service cover image",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_1_tU5XrRu.webp",
            "is_cover": true
          },
          {
            "id": "98dd6362-8364-4c72-92de-bb97885b8616",
            "type": "image",
            "title": "Media 4",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_5_SILSJH1.webp",
            "is_cover": false
          },
          {
            "id": "4996695c-ebc5-4603-a12c-2cf5b28a8a0e",
            "type": "image",
            "title": "Media 3",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_4_AtQxst5.webp",
            "is_cover": false
          },
          {
            "id": "ea65b2c6-87a7-426c-9063-1ae7247b168e",
            "type": "image",
            "title": "Media 2",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_3_4EP5VZq.webp",
            "is_cover": false
          },
          {
            "id": "ecec955c-5e54-4343-9b41-a85055eb7312",
            "type": "image",
            "title": "Media 1",
            "description": "",
            "url": null,
            "file": "/media_files/media/2026/02/24/image_2_UYr4FjO.webp",
            "is_cover": false
          }
        ],
        "tags": [
          {
            "id": "71f5ab05-0b07-4849-bc88-fc3935897a08",
            "name": "Aventura"
          },
          {
            "id": "04a995be-55a8-428c-b2b7-2f1b8fa2784a",
            "name": "Trekking"
          }
        ]
      }
    ],
    "itinerary_schedule": [
      {
        "service_quote_person_id": "ed7bb2e8-c24b-4daf-8a04-3d560747d662",
        "departure_date": "2026-03-01",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-07",
        "arrive_time": "20:16:00",
        "service": {
          "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "title": "Machu Picchu \"Conexión Amanecer\"",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>La&nbsp;experiencia&nbsp;completa&nbsp;para&nbsp;visitar&nbsp;la&nbsp;maravilla&nbsp;del&nbsp;mundo&nbsp;sin&nbsp;el&nbsp;agotamiento&nbsp;de&nbsp;ir&nbsp;y&nbsp;volver&nbsp;el&nbsp;mismo&nbsp;día.</p>"
        },
        "person": {
          "id": "cb5788e3-827d-42bb-ac31-394aabc4a7a4",
          "full_name": "Pepe Pepe"
        },
        "cost": 150.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "c7533408-f619-46ec-8deb-efde988df291",
            "title": "Dia 1",
            "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
          },
          {
            "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
            "title": "Dia 2",
            "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "141fc31b-b6c0-4c51-ac28-180009c28fa1",
        "departure_date": "2026-03-01",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-07",
        "arrive_time": "20:16:00",
        "service": {
          "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "title": "Machu Picchu \"Conexión Amanecer\"",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>La&nbsp;experiencia&nbsp;completa&nbsp;para&nbsp;visitar&nbsp;la&nbsp;maravilla&nbsp;del&nbsp;mundo&nbsp;sin&nbsp;el&nbsp;agotamiento&nbsp;de&nbsp;ir&nbsp;y&nbsp;volver&nbsp;el&nbsp;mismo&nbsp;día.</p>"
        },
        "person": {
          "id": "fb4740fc-a415-42aa-a535-497956a3198f",
          "full_name": "Luis Bustamante"
        },
        "cost": 150.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "c7533408-f619-46ec-8deb-efde988df291",
            "title": "Dia 1",
            "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
          },
          {
            "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
            "title": "Dia 2",
            "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "c1e94e46-59de-4f20-9f34-c02dd3a62b68",
        "departure_date": "2026-03-01",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-07",
        "arrive_time": "20:16:00",
        "service": {
          "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "title": "Machu Picchu \"Conexión Amanecer\"",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>La&nbsp;experiencia&nbsp;completa&nbsp;para&nbsp;visitar&nbsp;la&nbsp;maravilla&nbsp;del&nbsp;mundo&nbsp;sin&nbsp;el&nbsp;agotamiento&nbsp;de&nbsp;ir&nbsp;y&nbsp;volver&nbsp;el&nbsp;mismo&nbsp;día.</p>"
        },
        "person": {
          "id": "83aea660-c830-460d-bef9-e0e87f347bd0",
          "full_name": "Pasajero Temp temp-5"
        },
        "cost": 150.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "c7533408-f619-46ec-8deb-efde988df291",
            "title": "Dia 1",
            "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
          },
          {
            "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
            "title": "Dia 2",
            "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "73ac7f8a-ddad-4097-9b2c-8cb59e93773e",
        "departure_date": "2026-03-01",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-07",
        "arrive_time": "20:16:00",
        "service": {
          "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "title": "Machu Picchu \"Conexión Amanecer\"",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>La&nbsp;experiencia&nbsp;completa&nbsp;para&nbsp;visitar&nbsp;la&nbsp;maravilla&nbsp;del&nbsp;mundo&nbsp;sin&nbsp;el&nbsp;agotamiento&nbsp;de&nbsp;ir&nbsp;y&nbsp;volver&nbsp;el&nbsp;mismo&nbsp;día.</p>"
        },
        "person": {
          "id": "e2b9f682-8c8b-42fc-90b5-e638263de8e7",
          "full_name": "Mario Maria"
        },
        "cost": 150.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "c7533408-f619-46ec-8deb-efde988df291",
            "title": "Dia 1",
            "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
          },
          {
            "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
            "title": "Dia 2",
            "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "d2089327-2d0f-43dc-95d1-26d945af18d7",
        "departure_date": "2026-03-01",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-07",
        "arrive_time": "20:16:00",
        "service": {
          "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "title": "Machu Picchu \"Conexión Amanecer\"",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>La&nbsp;experiencia&nbsp;completa&nbsp;para&nbsp;visitar&nbsp;la&nbsp;maravilla&nbsp;del&nbsp;mundo&nbsp;sin&nbsp;el&nbsp;agotamiento&nbsp;de&nbsp;ir&nbsp;y&nbsp;volver&nbsp;el&nbsp;mismo&nbsp;día.</p>"
        },
        "person": {
          "id": "bd8f423d-3422-45ee-bbb7-6f775f9c11c4",
          "full_name": "Jose Maria"
        },
        "cost": 150.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "c7533408-f619-46ec-8deb-efde988df291",
            "title": "Dia 1",
            "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
          },
          {
            "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
            "title": "Dia 2",
            "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "7665f609-be2c-4ce8-b3c1-085028b7e61e",
        "departure_date": "2026-03-01",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-07",
        "arrive_time": "20:16:00",
        "service": {
          "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "title": "Machu Picchu \"Conexión Amanecer\"",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>La&nbsp;experiencia&nbsp;completa&nbsp;para&nbsp;visitar&nbsp;la&nbsp;maravilla&nbsp;del&nbsp;mundo&nbsp;sin&nbsp;el&nbsp;agotamiento&nbsp;de&nbsp;ir&nbsp;y&nbsp;volver&nbsp;el&nbsp;mismo&nbsp;día.</p>"
        },
        "person": {
          "id": "2e9a70d4-e9c4-4c59-9f11-4f89acc2d14d",
          "full_name": "Pasajero Temp temp-2"
        },
        "cost": 150.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "c7533408-f619-46ec-8deb-efde988df291",
            "title": "Dia 1",
            "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
          },
          {
            "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
            "title": "Dia 2",
            "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "c2452895-bab3-40e6-b5db-1f1830ea8d02",
        "departure_date": "2026-03-01",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-07",
        "arrive_time": "20:16:00",
        "service": {
          "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "title": "Machu Picchu \"Conexión Amanecer\"",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>La&nbsp;experiencia&nbsp;completa&nbsp;para&nbsp;visitar&nbsp;la&nbsp;maravilla&nbsp;del&nbsp;mundo&nbsp;sin&nbsp;el&nbsp;agotamiento&nbsp;de&nbsp;ir&nbsp;y&nbsp;volver&nbsp;el&nbsp;mismo&nbsp;día.</p>"
        },
        "person": {
          "id": "46bbf972-5677-4e46-8f71-0450e729d25a",
          "full_name": "Pasajero Temp temp-1"
        },
        "cost": 150.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "c7533408-f619-46ec-8deb-efde988df291",
            "title": "Dia 1",
            "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
          },
          {
            "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
            "title": "Dia 2",
            "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "b03a00a7-1701-4aed-bd73-469e20bc181d",
        "departure_date": "2026-03-01",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-07",
        "arrive_time": "20:16:00",
        "service": {
          "id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "title": "Machu Picchu \"Conexión Amanecer\"",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>La&nbsp;experiencia&nbsp;completa&nbsp;para&nbsp;visitar&nbsp;la&nbsp;maravilla&nbsp;del&nbsp;mundo&nbsp;sin&nbsp;el&nbsp;agotamiento&nbsp;de&nbsp;ir&nbsp;y&nbsp;volver&nbsp;el&nbsp;mismo&nbsp;día.</p>"
        },
        "person": {
          "id": "28497a1f-d82c-4291-8790-7e5a1d9e929d",
          "full_name": "Cristian Monzon Guzman"
        },
        "cost": 150.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "c7533408-f619-46ec-8deb-efde988df291",
            "title": "Dia 1",
            "description": "<p>Traslado&nbsp;de&nbsp;Cusco&nbsp;a&nbsp;Ollantaytambo&nbsp;para&nbsp;tomar&nbsp;el&nbsp;tren.&nbsp;Llegada&nbsp;a&nbsp;Aguas&nbsp;Calientes,&nbsp;tarde&nbsp;libre&nbsp;para&nbsp;visitar&nbsp;los&nbsp;baños&nbsp;termales&nbsp;del&nbsp;pueblo.</p>"
          },
          {
            "id": "0f54c4a5-3e6f-4f42-8655-f38aab5180f6",
            "title": "Dia 2",
            "description": "<p>Bus&nbsp;muy&nbsp;temprano&nbsp;a&nbsp;la&nbsp;ciudadela.&nbsp;Tour&nbsp;guiado&nbsp;de&nbsp;2.5&nbsp;horas&nbsp;por&nbsp;los&nbsp;puntos&nbsp;clave.&nbsp;Tiempo&nbsp;libre&nbsp;para&nbsp;fotos.&nbsp;Descenso&nbsp;al&nbsp;pueblo&nbsp;y&nbsp;tren&nbsp;de&nbsp;retorno&nbsp;a&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "ffd0727c-ce8a-4def-a5c4-bbb7c313b062",
        "departure_date": "2026-03-02",
        "departure_time": "08:00:00",
        "arrive_date": "2026-03-06",
        "arrive_time": "20:11:00",
        "service": {
          "id": "553847c6-44b9-4f18-9870-b462943ab202",
          "title": "City Tour Cusco",
          "type": "group",
          "duration_value": 5,
          "duration_unit": "hours",
          "summary": "<p>La&nbsp;introducción&nbsp;perfecta&nbsp;a&nbsp;la&nbsp;capital&nbsp;imperial.&nbsp;Este&nbsp;recorrido&nbsp;combina&nbsp;la&nbsp;riqueza&nbsp;colonial&nbsp;del&nbsp;centro&nbsp;de&nbsp;la&nbsp;ciudad&nbsp;con&nbsp;la&nbsp;monumentalidad&nbsp;de&nbsp;los&nbsp;centros&nbsp;arqueológicos&nbsp;periféricos,&nbsp;permitiéndole&nbsp;entender&nbsp;la&nbsp;superposición&nbsp;de&nbsp;culturas&nbsp;en&nbsp;el&nbsp;ombligo&nbsp;del&nbsp;mundo.</p>"
        },
        "person": {
          "id": "cb5788e3-827d-42bb-ac31-394aabc4a7a4",
          "full_name": "Pepe Pepe"
        },
        "cost": 25.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "d4b0b3b7-8785-4bba-8b5d-06c56b5483c2",
            "title": "09:00 AM",
            "description": "<p>Visita&nbsp;guiada&nbsp;al&nbsp;Templo&nbsp;del&nbsp;Sol&nbsp;(Qoricancha).</p>"
          },
          {
            "id": "a5eb79ff-37eb-44e3-aeb4-84a20dfa283e",
            "title": "10:30 AM",
            "description": "<p>Traslado&nbsp;y&nbsp;recorrido&nbsp;por&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Sacsayhuaman.</p>"
          },
          {
            "id": "519f8dda-3280-4c2d-ad1d-4b69eea6b510",
            "title": "11:30 AM",
            "description": "<p>Visita&nbsp;al&nbsp;centro&nbsp;ritual&nbsp;de&nbsp;Qenqo.</p>"
          },
          {
            "id": "2bad7dfd-6e61-49c0-abc0-4b26ea2d7c1d",
            "title": "12:15 PM",
            "description": "<p>Parada&nbsp;en&nbsp;Puca&nbsp;Pucara&nbsp;(Fortaleza&nbsp;Roja).</p>"
          },
          {
            "id": "47f2ac2a-91f6-4ecf-895d-75a393ca6341",
            "title": "12:45 PM",
            "description": "<p>Visita&nbsp;a&nbsp;las&nbsp;fuentes&nbsp;ceremoniales&nbsp;de&nbsp;Tambomachay.</p>"
          },
          {
            "id": "a5d12cdb-efe8-47ed-b195-ef618ed0847a",
            "title": "02:00 PM",
            "description": "<p>Retorno&nbsp;al&nbsp;centro&nbsp;de&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "7915b9aa-3c71-40a2-8dc6-5daf5de11f9a",
        "departure_date": "2026-03-02",
        "departure_time": "08:00:00",
        "arrive_date": "2026-03-06",
        "arrive_time": "20:11:00",
        "service": {
          "id": "553847c6-44b9-4f18-9870-b462943ab202",
          "title": "City Tour Cusco",
          "type": "group",
          "duration_value": 5,
          "duration_unit": "hours",
          "summary": "<p>La&nbsp;introducción&nbsp;perfecta&nbsp;a&nbsp;la&nbsp;capital&nbsp;imperial.&nbsp;Este&nbsp;recorrido&nbsp;combina&nbsp;la&nbsp;riqueza&nbsp;colonial&nbsp;del&nbsp;centro&nbsp;de&nbsp;la&nbsp;ciudad&nbsp;con&nbsp;la&nbsp;monumentalidad&nbsp;de&nbsp;los&nbsp;centros&nbsp;arqueológicos&nbsp;periféricos,&nbsp;permitiéndole&nbsp;entender&nbsp;la&nbsp;superposición&nbsp;de&nbsp;culturas&nbsp;en&nbsp;el&nbsp;ombligo&nbsp;del&nbsp;mundo.</p>"
        },
        "person": {
          "id": "e2b9f682-8c8b-42fc-90b5-e638263de8e7",
          "full_name": "Mario Maria"
        },
        "cost": 25.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "d4b0b3b7-8785-4bba-8b5d-06c56b5483c2",
            "title": "09:00 AM",
            "description": "<p>Visita&nbsp;guiada&nbsp;al&nbsp;Templo&nbsp;del&nbsp;Sol&nbsp;(Qoricancha).</p>"
          },
          {
            "id": "a5eb79ff-37eb-44e3-aeb4-84a20dfa283e",
            "title": "10:30 AM",
            "description": "<p>Traslado&nbsp;y&nbsp;recorrido&nbsp;por&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Sacsayhuaman.</p>"
          },
          {
            "id": "519f8dda-3280-4c2d-ad1d-4b69eea6b510",
            "title": "11:30 AM",
            "description": "<p>Visita&nbsp;al&nbsp;centro&nbsp;ritual&nbsp;de&nbsp;Qenqo.</p>"
          },
          {
            "id": "2bad7dfd-6e61-49c0-abc0-4b26ea2d7c1d",
            "title": "12:15 PM",
            "description": "<p>Parada&nbsp;en&nbsp;Puca&nbsp;Pucara&nbsp;(Fortaleza&nbsp;Roja).</p>"
          },
          {
            "id": "47f2ac2a-91f6-4ecf-895d-75a393ca6341",
            "title": "12:45 PM",
            "description": "<p>Visita&nbsp;a&nbsp;las&nbsp;fuentes&nbsp;ceremoniales&nbsp;de&nbsp;Tambomachay.</p>"
          },
          {
            "id": "a5d12cdb-efe8-47ed-b195-ef618ed0847a",
            "title": "02:00 PM",
            "description": "<p>Retorno&nbsp;al&nbsp;centro&nbsp;de&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "f8939de2-eab6-49f6-b861-114d4c4e6926",
        "departure_date": "2026-03-02",
        "departure_time": "08:00:00",
        "arrive_date": "2026-03-06",
        "arrive_time": "20:11:00",
        "service": {
          "id": "553847c6-44b9-4f18-9870-b462943ab202",
          "title": "City Tour Cusco",
          "type": "group",
          "duration_value": 5,
          "duration_unit": "hours",
          "summary": "<p>La&nbsp;introducción&nbsp;perfecta&nbsp;a&nbsp;la&nbsp;capital&nbsp;imperial.&nbsp;Este&nbsp;recorrido&nbsp;combina&nbsp;la&nbsp;riqueza&nbsp;colonial&nbsp;del&nbsp;centro&nbsp;de&nbsp;la&nbsp;ciudad&nbsp;con&nbsp;la&nbsp;monumentalidad&nbsp;de&nbsp;los&nbsp;centros&nbsp;arqueológicos&nbsp;periféricos,&nbsp;permitiéndole&nbsp;entender&nbsp;la&nbsp;superposición&nbsp;de&nbsp;culturas&nbsp;en&nbsp;el&nbsp;ombligo&nbsp;del&nbsp;mundo.</p>"
        },
        "person": {
          "id": "2e9a70d4-e9c4-4c59-9f11-4f89acc2d14d",
          "full_name": "Pasajero Temp temp-2"
        },
        "cost": 25.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "d4b0b3b7-8785-4bba-8b5d-06c56b5483c2",
            "title": "09:00 AM",
            "description": "<p>Visita&nbsp;guiada&nbsp;al&nbsp;Templo&nbsp;del&nbsp;Sol&nbsp;(Qoricancha).</p>"
          },
          {
            "id": "a5eb79ff-37eb-44e3-aeb4-84a20dfa283e",
            "title": "10:30 AM",
            "description": "<p>Traslado&nbsp;y&nbsp;recorrido&nbsp;por&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Sacsayhuaman.</p>"
          },
          {
            "id": "519f8dda-3280-4c2d-ad1d-4b69eea6b510",
            "title": "11:30 AM",
            "description": "<p>Visita&nbsp;al&nbsp;centro&nbsp;ritual&nbsp;de&nbsp;Qenqo.</p>"
          },
          {
            "id": "2bad7dfd-6e61-49c0-abc0-4b26ea2d7c1d",
            "title": "12:15 PM",
            "description": "<p>Parada&nbsp;en&nbsp;Puca&nbsp;Pucara&nbsp;(Fortaleza&nbsp;Roja).</p>"
          },
          {
            "id": "47f2ac2a-91f6-4ecf-895d-75a393ca6341",
            "title": "12:45 PM",
            "description": "<p>Visita&nbsp;a&nbsp;las&nbsp;fuentes&nbsp;ceremoniales&nbsp;de&nbsp;Tambomachay.</p>"
          },
          {
            "id": "a5d12cdb-efe8-47ed-b195-ef618ed0847a",
            "title": "02:00 PM",
            "description": "<p>Retorno&nbsp;al&nbsp;centro&nbsp;de&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "6ebdb674-c240-429a-9d8d-e8d450d81d2c",
        "departure_date": "2026-03-02",
        "departure_time": "08:00:00",
        "arrive_date": "2026-03-06",
        "arrive_time": "20:11:00",
        "service": {
          "id": "553847c6-44b9-4f18-9870-b462943ab202",
          "title": "City Tour Cusco",
          "type": "group",
          "duration_value": 5,
          "duration_unit": "hours",
          "summary": "<p>La&nbsp;introducción&nbsp;perfecta&nbsp;a&nbsp;la&nbsp;capital&nbsp;imperial.&nbsp;Este&nbsp;recorrido&nbsp;combina&nbsp;la&nbsp;riqueza&nbsp;colonial&nbsp;del&nbsp;centro&nbsp;de&nbsp;la&nbsp;ciudad&nbsp;con&nbsp;la&nbsp;monumentalidad&nbsp;de&nbsp;los&nbsp;centros&nbsp;arqueológicos&nbsp;periféricos,&nbsp;permitiéndole&nbsp;entender&nbsp;la&nbsp;superposición&nbsp;de&nbsp;culturas&nbsp;en&nbsp;el&nbsp;ombligo&nbsp;del&nbsp;mundo.</p>"
        },
        "person": {
          "id": "28497a1f-d82c-4291-8790-7e5a1d9e929d",
          "full_name": "Cristian Monzon Guzman"
        },
        "cost": 25.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "d4b0b3b7-8785-4bba-8b5d-06c56b5483c2",
            "title": "09:00 AM",
            "description": "<p>Visita&nbsp;guiada&nbsp;al&nbsp;Templo&nbsp;del&nbsp;Sol&nbsp;(Qoricancha).</p>"
          },
          {
            "id": "a5eb79ff-37eb-44e3-aeb4-84a20dfa283e",
            "title": "10:30 AM",
            "description": "<p>Traslado&nbsp;y&nbsp;recorrido&nbsp;por&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Sacsayhuaman.</p>"
          },
          {
            "id": "519f8dda-3280-4c2d-ad1d-4b69eea6b510",
            "title": "11:30 AM",
            "description": "<p>Visita&nbsp;al&nbsp;centro&nbsp;ritual&nbsp;de&nbsp;Qenqo.</p>"
          },
          {
            "id": "2bad7dfd-6e61-49c0-abc0-4b26ea2d7c1d",
            "title": "12:15 PM",
            "description": "<p>Parada&nbsp;en&nbsp;Puca&nbsp;Pucara&nbsp;(Fortaleza&nbsp;Roja).</p>"
          },
          {
            "id": "47f2ac2a-91f6-4ecf-895d-75a393ca6341",
            "title": "12:45 PM",
            "description": "<p>Visita&nbsp;a&nbsp;las&nbsp;fuentes&nbsp;ceremoniales&nbsp;de&nbsp;Tambomachay.</p>"
          },
          {
            "id": "a5d12cdb-efe8-47ed-b195-ef618ed0847a",
            "title": "02:00 PM",
            "description": "<p>Retorno&nbsp;al&nbsp;centro&nbsp;de&nbsp;Cusco.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "afa1343c-9df9-4df6-b143-ae9ed295514a",
        "departure_date": "2026-03-02",
        "departure_time": "09:00:00",
        "arrive_date": "2026-04-02",
        "arrive_time": "20:36:00",
        "service": {
          "id": "7da1b512-b886-4471-bf14-f7b295990532",
          "title": "El Camino del Apu Ausangate",
          "type": "group",
          "duration_value": 3,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;tour&nbsp;diseñado&nbsp;para&nbsp;fotógrafos&nbsp;y&nbsp;montañistas&nbsp;que&nbsp;buscan&nbsp;paisajes&nbsp;irreales&nbsp;y&nbsp;la&nbsp;famosa&nbsp;Montaña&nbsp;de&nbsp;Siete&nbsp;Colores.</p>"
        },
        "person": {
          "id": "2e9a70d4-e9c4-4c59-9f11-4f89acc2d14d",
          "full_name": "Pasajero Temp temp-2"
        },
        "cost": 250.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "88ebb82a-b947-4d82-b8d8-ad993bde6c90",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;de&nbsp;Cusco&nbsp;hacia&nbsp;Upis,&nbsp;camping&nbsp;al&nbsp;pie&nbsp;del&nbsp;nevado&nbsp;Ausangate&nbsp;con&nbsp;baños&nbsp;termales.</p>"
          },
          {
            "id": "bcebb020-0071-44a0-b12b-1d99d9012687",
            "title": "Dia 2",
            "description": "<p>Caminata&nbsp;por&nbsp;pasos&nbsp;de&nbsp;altura&nbsp;rodeando&nbsp;lagunas&nbsp;turquesas&nbsp;(Pucacocha).&nbsp;Campamento&nbsp;cerca&nbsp;de&nbsp;la&nbsp;montaña&nbsp;de&nbsp;colores.</p>"
          },
          {
            "id": "8dd7764f-5342-4e63-921f-7f22726ba4db",
            "title": "Dia 3",
            "description": "<p>Llegada&nbsp;a&nbsp;Vinicunca&nbsp;(Montaña&nbsp;Arcoíris)&nbsp;temprano&nbsp;en&nbsp;la&nbsp;mañana&nbsp;antes&nbsp;de&nbsp;la&nbsp;multitud.&nbsp;Descenso&nbsp;y&nbsp;retorno&nbsp;a&nbsp;la&nbsp;ciudad&nbsp;de&nbsp;Cusco.</p><p></p>"
          }
        ]
      },
      {
        "service_quote_person_id": "84d9ed7c-930a-4c83-99a0-331feeef13be",
        "departure_date": "2026-03-02",
        "departure_time": "20:13:00",
        "arrive_date": "2026-05-14",
        "arrive_time": "21:13:00",
        "service": {
          "id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "title": "Salkantay Trek a Machu Picchu",
          "type": "arbitrary",
          "duration_value": 4,
          "duration_unit": "days",
          "summary": "<p>Una&nbsp;caminata&nbsp;épica&nbsp;que&nbsp;atraviesa&nbsp;desde&nbsp;picos&nbsp;nevados&nbsp;hasta&nbsp;la&nbsp;densa&nbsp;selva&nbsp;alta,&nbsp;llegando&nbsp;a&nbsp;Machu&nbsp;Picchu&nbsp;por&nbsp;una&nbsp;ruta&nbsp;alternativa.</p>"
        },
        "person": {
          "id": "fb4740fc-a415-42aa-a535-497956a3198f",
          "full_name": "Luis Bustamante"
        },
        "cost": 125.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "5baaaa3d-9c77-461b-a32f-00b47d575cdf",
            "title": "Dia 1",
            "description": "<p>Cusco&nbsp;a&nbsp;Soraypampa.&nbsp;Visita&nbsp;a&nbsp;la&nbsp;Laguna&nbsp;Humantay&nbsp;(4,200m).</p>"
          },
          {
            "id": "518182f7-f255-4aec-b558-d6c89a580164",
            "title": "Dia 2",
            "description": "<p>Cruce&nbsp;del&nbsp;Abra&nbsp;Salkantay,&nbsp;el&nbsp;punto&nbsp;más&nbsp;alto,&nbsp;y&nbsp;descenso&nbsp;hacia&nbsp;el&nbsp;bosque&nbsp;nuboso&nbsp;(Chaullay).</p>"
          },
          {
            "id": "6180062f-dd71-486d-bbad-d88f35918016",
            "title": "Dia 3",
            "description": "<p>Caminata&nbsp;por&nbsp;el&nbsp;valle&nbsp;de&nbsp;Santa&nbsp;Teresa&nbsp;hacia&nbsp;Hidroeléctrica&nbsp;y&nbsp;finalmente&nbsp;Aguas&nbsp;Calientes.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "dad141c9-a17a-4dc4-957a-79c4233c2428",
        "departure_date": "2026-03-02",
        "departure_time": "20:13:00",
        "arrive_date": "2026-05-14",
        "arrive_time": "21:13:00",
        "service": {
          "id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "title": "Salkantay Trek a Machu Picchu",
          "type": "arbitrary",
          "duration_value": 4,
          "duration_unit": "days",
          "summary": "<p>Una&nbsp;caminata&nbsp;épica&nbsp;que&nbsp;atraviesa&nbsp;desde&nbsp;picos&nbsp;nevados&nbsp;hasta&nbsp;la&nbsp;densa&nbsp;selva&nbsp;alta,&nbsp;llegando&nbsp;a&nbsp;Machu&nbsp;Picchu&nbsp;por&nbsp;una&nbsp;ruta&nbsp;alternativa.</p>"
        },
        "person": {
          "id": "cb5788e3-827d-42bb-ac31-394aabc4a7a4",
          "full_name": "Pepe Pepe"
        },
        "cost": 125.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "5baaaa3d-9c77-461b-a32f-00b47d575cdf",
            "title": "Dia 1",
            "description": "<p>Cusco&nbsp;a&nbsp;Soraypampa.&nbsp;Visita&nbsp;a&nbsp;la&nbsp;Laguna&nbsp;Humantay&nbsp;(4,200m).</p>"
          },
          {
            "id": "518182f7-f255-4aec-b558-d6c89a580164",
            "title": "Dia 2",
            "description": "<p>Cruce&nbsp;del&nbsp;Abra&nbsp;Salkantay,&nbsp;el&nbsp;punto&nbsp;más&nbsp;alto,&nbsp;y&nbsp;descenso&nbsp;hacia&nbsp;el&nbsp;bosque&nbsp;nuboso&nbsp;(Chaullay).</p>"
          },
          {
            "id": "6180062f-dd71-486d-bbad-d88f35918016",
            "title": "Dia 3",
            "description": "<p>Caminata&nbsp;por&nbsp;el&nbsp;valle&nbsp;de&nbsp;Santa&nbsp;Teresa&nbsp;hacia&nbsp;Hidroeléctrica&nbsp;y&nbsp;finalmente&nbsp;Aguas&nbsp;Calientes.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "868838d2-9444-4a25-bdba-c43bba9ca653",
        "departure_date": "2026-03-02",
        "departure_time": "20:13:00",
        "arrive_date": "2026-05-14",
        "arrive_time": "21:13:00",
        "service": {
          "id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "title": "Salkantay Trek a Machu Picchu",
          "type": "arbitrary",
          "duration_value": 4,
          "duration_unit": "days",
          "summary": "<p>Una&nbsp;caminata&nbsp;épica&nbsp;que&nbsp;atraviesa&nbsp;desde&nbsp;picos&nbsp;nevados&nbsp;hasta&nbsp;la&nbsp;densa&nbsp;selva&nbsp;alta,&nbsp;llegando&nbsp;a&nbsp;Machu&nbsp;Picchu&nbsp;por&nbsp;una&nbsp;ruta&nbsp;alternativa.</p>"
        },
        "person": {
          "id": "46bbf972-5677-4e46-8f71-0450e729d25a",
          "full_name": "Pasajero Temp temp-1"
        },
        "cost": 125.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "5baaaa3d-9c77-461b-a32f-00b47d575cdf",
            "title": "Dia 1",
            "description": "<p>Cusco&nbsp;a&nbsp;Soraypampa.&nbsp;Visita&nbsp;a&nbsp;la&nbsp;Laguna&nbsp;Humantay&nbsp;(4,200m).</p>"
          },
          {
            "id": "518182f7-f255-4aec-b558-d6c89a580164",
            "title": "Dia 2",
            "description": "<p>Cruce&nbsp;del&nbsp;Abra&nbsp;Salkantay,&nbsp;el&nbsp;punto&nbsp;más&nbsp;alto,&nbsp;y&nbsp;descenso&nbsp;hacia&nbsp;el&nbsp;bosque&nbsp;nuboso&nbsp;(Chaullay).</p>"
          },
          {
            "id": "6180062f-dd71-486d-bbad-d88f35918016",
            "title": "Dia 3",
            "description": "<p>Caminata&nbsp;por&nbsp;el&nbsp;valle&nbsp;de&nbsp;Santa&nbsp;Teresa&nbsp;hacia&nbsp;Hidroeléctrica&nbsp;y&nbsp;finalmente&nbsp;Aguas&nbsp;Calientes.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "938ce35e-c847-41cb-8ab6-ec1d89da764c",
        "departure_date": "2026-03-02",
        "departure_time": "20:13:00",
        "arrive_date": "2026-05-14",
        "arrive_time": "21:13:00",
        "service": {
          "id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "title": "Salkantay Trek a Machu Picchu",
          "type": "arbitrary",
          "duration_value": 4,
          "duration_unit": "days",
          "summary": "<p>Una&nbsp;caminata&nbsp;épica&nbsp;que&nbsp;atraviesa&nbsp;desde&nbsp;picos&nbsp;nevados&nbsp;hasta&nbsp;la&nbsp;densa&nbsp;selva&nbsp;alta,&nbsp;llegando&nbsp;a&nbsp;Machu&nbsp;Picchu&nbsp;por&nbsp;una&nbsp;ruta&nbsp;alternativa.</p>"
        },
        "person": {
          "id": "28497a1f-d82c-4291-8790-7e5a1d9e929d",
          "full_name": "Cristian Monzon Guzman"
        },
        "cost": 125.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "5baaaa3d-9c77-461b-a32f-00b47d575cdf",
            "title": "Dia 1",
            "description": "<p>Cusco&nbsp;a&nbsp;Soraypampa.&nbsp;Visita&nbsp;a&nbsp;la&nbsp;Laguna&nbsp;Humantay&nbsp;(4,200m).</p>"
          },
          {
            "id": "518182f7-f255-4aec-b558-d6c89a580164",
            "title": "Dia 2",
            "description": "<p>Cruce&nbsp;del&nbsp;Abra&nbsp;Salkantay,&nbsp;el&nbsp;punto&nbsp;más&nbsp;alto,&nbsp;y&nbsp;descenso&nbsp;hacia&nbsp;el&nbsp;bosque&nbsp;nuboso&nbsp;(Chaullay).</p>"
          },
          {
            "id": "6180062f-dd71-486d-bbad-d88f35918016",
            "title": "Dia 3",
            "description": "<p>Caminata&nbsp;por&nbsp;el&nbsp;valle&nbsp;de&nbsp;Santa&nbsp;Teresa&nbsp;hacia&nbsp;Hidroeléctrica&nbsp;y&nbsp;finalmente&nbsp;Aguas&nbsp;Calientes.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "77094529-782f-4ae3-8408-edbcd3afa378",
        "departure_date": "2026-03-03",
        "departure_time": "20:16:00",
        "arrive_date": "2026-03-19",
        "arrive_time": "20:17:00",
        "service": {
          "id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "title": "Valle Sagrado de los Incas (Vip)",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;recorrido&nbsp;profundo&nbsp;por&nbsp;el&nbsp;valle&nbsp;más&nbsp;fértil&nbsp;de&nbsp;los&nbsp;Andes,&nbsp;visitando&nbsp;laboratorios&nbsp;agrícolas&nbsp;y&nbsp;pueblos&nbsp;que&nbsp;mantienen&nbsp;viva&nbsp;la&nbsp;cultura&nbsp;inca.</p>"
        },
        "person": {
          "id": "83aea660-c830-460d-bef9-e0e87f347bd0",
          "full_name": "Pasajero Temp temp-5"
        },
        "cost": 115.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "5f073e6e-6076-4943-afcb-0a35fd4fb99c",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;hacia&nbsp;Chinchero&nbsp;para&nbsp;ver&nbsp;demostraciones&nbsp;textiles.&nbsp;Visita&nbsp;a&nbsp;los&nbsp;laboratorios&nbsp;agrícolas&nbsp;de&nbsp;Moray&nbsp;y&nbsp;las&nbsp;Salineras&nbsp;de&nbsp;Maras.&nbsp;Pernocte&nbsp;en&nbsp;Ollantaytambo&nbsp;o&nbsp;Cusco.</p>"
          },
          {
            "id": "72ea1660-fc41-47bc-ae5a-187409b99c73",
            "title": "Dia 2",
            "description": "<p>Exploración&nbsp;de&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Ollantaytambo&nbsp;y&nbsp;el&nbsp;mercado&nbsp;de&nbsp;Pisac.&nbsp;Almuerzo&nbsp;buffet&nbsp;incluido&nbsp;en&nbsp;el&nbsp;corazón&nbsp;del&nbsp;Valle.&nbsp;Retorno&nbsp;a&nbsp;Cusco&nbsp;por&nbsp;la&nbsp;tarde.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "248e4aea-7bb1-4dcd-b6e6-3b2fcd0de130",
        "departure_date": "2026-03-03",
        "departure_time": "20:16:00",
        "arrive_date": "2026-03-19",
        "arrive_time": "20:17:00",
        "service": {
          "id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "title": "Valle Sagrado de los Incas (Vip)",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;recorrido&nbsp;profundo&nbsp;por&nbsp;el&nbsp;valle&nbsp;más&nbsp;fértil&nbsp;de&nbsp;los&nbsp;Andes,&nbsp;visitando&nbsp;laboratorios&nbsp;agrícolas&nbsp;y&nbsp;pueblos&nbsp;que&nbsp;mantienen&nbsp;viva&nbsp;la&nbsp;cultura&nbsp;inca.</p>"
        },
        "person": {
          "id": "e2b9f682-8c8b-42fc-90b5-e638263de8e7",
          "full_name": "Mario Maria"
        },
        "cost": 115.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "5f073e6e-6076-4943-afcb-0a35fd4fb99c",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;hacia&nbsp;Chinchero&nbsp;para&nbsp;ver&nbsp;demostraciones&nbsp;textiles.&nbsp;Visita&nbsp;a&nbsp;los&nbsp;laboratorios&nbsp;agrícolas&nbsp;de&nbsp;Moray&nbsp;y&nbsp;las&nbsp;Salineras&nbsp;de&nbsp;Maras.&nbsp;Pernocte&nbsp;en&nbsp;Ollantaytambo&nbsp;o&nbsp;Cusco.</p>"
          },
          {
            "id": "72ea1660-fc41-47bc-ae5a-187409b99c73",
            "title": "Dia 2",
            "description": "<p>Exploración&nbsp;de&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Ollantaytambo&nbsp;y&nbsp;el&nbsp;mercado&nbsp;de&nbsp;Pisac.&nbsp;Almuerzo&nbsp;buffet&nbsp;incluido&nbsp;en&nbsp;el&nbsp;corazón&nbsp;del&nbsp;Valle.&nbsp;Retorno&nbsp;a&nbsp;Cusco&nbsp;por&nbsp;la&nbsp;tarde.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "f06d0787-1856-426f-9d16-8a52f7b96848",
        "departure_date": "2026-03-03",
        "departure_time": "20:16:00",
        "arrive_date": "2026-03-19",
        "arrive_time": "20:17:00",
        "service": {
          "id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "title": "Valle Sagrado de los Incas (Vip)",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;recorrido&nbsp;profundo&nbsp;por&nbsp;el&nbsp;valle&nbsp;más&nbsp;fértil&nbsp;de&nbsp;los&nbsp;Andes,&nbsp;visitando&nbsp;laboratorios&nbsp;agrícolas&nbsp;y&nbsp;pueblos&nbsp;que&nbsp;mantienen&nbsp;viva&nbsp;la&nbsp;cultura&nbsp;inca.</p>"
        },
        "person": {
          "id": "bd8f423d-3422-45ee-bbb7-6f775f9c11c4",
          "full_name": "Jose Maria"
        },
        "cost": 115.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "5f073e6e-6076-4943-afcb-0a35fd4fb99c",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;hacia&nbsp;Chinchero&nbsp;para&nbsp;ver&nbsp;demostraciones&nbsp;textiles.&nbsp;Visita&nbsp;a&nbsp;los&nbsp;laboratorios&nbsp;agrícolas&nbsp;de&nbsp;Moray&nbsp;y&nbsp;las&nbsp;Salineras&nbsp;de&nbsp;Maras.&nbsp;Pernocte&nbsp;en&nbsp;Ollantaytambo&nbsp;o&nbsp;Cusco.</p>"
          },
          {
            "id": "72ea1660-fc41-47bc-ae5a-187409b99c73",
            "title": "Dia 2",
            "description": "<p>Exploración&nbsp;de&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Ollantaytambo&nbsp;y&nbsp;el&nbsp;mercado&nbsp;de&nbsp;Pisac.&nbsp;Almuerzo&nbsp;buffet&nbsp;incluido&nbsp;en&nbsp;el&nbsp;corazón&nbsp;del&nbsp;Valle.&nbsp;Retorno&nbsp;a&nbsp;Cusco&nbsp;por&nbsp;la&nbsp;tarde.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "678ceab6-b874-4013-958a-8597c45aec2f",
        "departure_date": "2026-03-03",
        "departure_time": "20:16:00",
        "arrive_date": "2026-03-19",
        "arrive_time": "20:17:00",
        "service": {
          "id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "title": "Valle Sagrado de los Incas (Vip)",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;recorrido&nbsp;profundo&nbsp;por&nbsp;el&nbsp;valle&nbsp;más&nbsp;fértil&nbsp;de&nbsp;los&nbsp;Andes,&nbsp;visitando&nbsp;laboratorios&nbsp;agrícolas&nbsp;y&nbsp;pueblos&nbsp;que&nbsp;mantienen&nbsp;viva&nbsp;la&nbsp;cultura&nbsp;inca.</p>"
        },
        "person": {
          "id": "2e9a70d4-e9c4-4c59-9f11-4f89acc2d14d",
          "full_name": "Pasajero Temp temp-2"
        },
        "cost": 115.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "5f073e6e-6076-4943-afcb-0a35fd4fb99c",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;hacia&nbsp;Chinchero&nbsp;para&nbsp;ver&nbsp;demostraciones&nbsp;textiles.&nbsp;Visita&nbsp;a&nbsp;los&nbsp;laboratorios&nbsp;agrícolas&nbsp;de&nbsp;Moray&nbsp;y&nbsp;las&nbsp;Salineras&nbsp;de&nbsp;Maras.&nbsp;Pernocte&nbsp;en&nbsp;Ollantaytambo&nbsp;o&nbsp;Cusco.</p>"
          },
          {
            "id": "72ea1660-fc41-47bc-ae5a-187409b99c73",
            "title": "Dia 2",
            "description": "<p>Exploración&nbsp;de&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Ollantaytambo&nbsp;y&nbsp;el&nbsp;mercado&nbsp;de&nbsp;Pisac.&nbsp;Almuerzo&nbsp;buffet&nbsp;incluido&nbsp;en&nbsp;el&nbsp;corazón&nbsp;del&nbsp;Valle.&nbsp;Retorno&nbsp;a&nbsp;Cusco&nbsp;por&nbsp;la&nbsp;tarde.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "2af17790-a042-4951-98fa-bdea56881f2d",
        "departure_date": "2026-03-03",
        "departure_time": "20:16:00",
        "arrive_date": "2026-03-19",
        "arrive_time": "20:17:00",
        "service": {
          "id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "title": "Valle Sagrado de los Incas (Vip)",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;recorrido&nbsp;profundo&nbsp;por&nbsp;el&nbsp;valle&nbsp;más&nbsp;fértil&nbsp;de&nbsp;los&nbsp;Andes,&nbsp;visitando&nbsp;laboratorios&nbsp;agrícolas&nbsp;y&nbsp;pueblos&nbsp;que&nbsp;mantienen&nbsp;viva&nbsp;la&nbsp;cultura&nbsp;inca.</p>"
        },
        "person": {
          "id": "46bbf972-5677-4e46-8f71-0450e729d25a",
          "full_name": "Pasajero Temp temp-1"
        },
        "cost": 115.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "5f073e6e-6076-4943-afcb-0a35fd4fb99c",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;hacia&nbsp;Chinchero&nbsp;para&nbsp;ver&nbsp;demostraciones&nbsp;textiles.&nbsp;Visita&nbsp;a&nbsp;los&nbsp;laboratorios&nbsp;agrícolas&nbsp;de&nbsp;Moray&nbsp;y&nbsp;las&nbsp;Salineras&nbsp;de&nbsp;Maras.&nbsp;Pernocte&nbsp;en&nbsp;Ollantaytambo&nbsp;o&nbsp;Cusco.</p>"
          },
          {
            "id": "72ea1660-fc41-47bc-ae5a-187409b99c73",
            "title": "Dia 2",
            "description": "<p>Exploración&nbsp;de&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Ollantaytambo&nbsp;y&nbsp;el&nbsp;mercado&nbsp;de&nbsp;Pisac.&nbsp;Almuerzo&nbsp;buffet&nbsp;incluido&nbsp;en&nbsp;el&nbsp;corazón&nbsp;del&nbsp;Valle.&nbsp;Retorno&nbsp;a&nbsp;Cusco&nbsp;por&nbsp;la&nbsp;tarde.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "ac2d76e7-6d3f-4b36-a3fe-c156660f2816",
        "departure_date": "2026-03-03",
        "departure_time": "20:16:00",
        "arrive_date": "2026-03-19",
        "arrive_time": "20:17:00",
        "service": {
          "id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "title": "Valle Sagrado de los Incas (Vip)",
          "type": "private",
          "duration_value": 2,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;recorrido&nbsp;profundo&nbsp;por&nbsp;el&nbsp;valle&nbsp;más&nbsp;fértil&nbsp;de&nbsp;los&nbsp;Andes,&nbsp;visitando&nbsp;laboratorios&nbsp;agrícolas&nbsp;y&nbsp;pueblos&nbsp;que&nbsp;mantienen&nbsp;viva&nbsp;la&nbsp;cultura&nbsp;inca.</p>"
        },
        "person": {
          "id": "28497a1f-d82c-4291-8790-7e5a1d9e929d",
          "full_name": "Cristian Monzon Guzman"
        },
        "cost": 115.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "5f073e6e-6076-4943-afcb-0a35fd4fb99c",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;hacia&nbsp;Chinchero&nbsp;para&nbsp;ver&nbsp;demostraciones&nbsp;textiles.&nbsp;Visita&nbsp;a&nbsp;los&nbsp;laboratorios&nbsp;agrícolas&nbsp;de&nbsp;Moray&nbsp;y&nbsp;las&nbsp;Salineras&nbsp;de&nbsp;Maras.&nbsp;Pernocte&nbsp;en&nbsp;Ollantaytambo&nbsp;o&nbsp;Cusco.</p>"
          },
          {
            "id": "72ea1660-fc41-47bc-ae5a-187409b99c73",
            "title": "Dia 2",
            "description": "<p>Exploración&nbsp;de&nbsp;la&nbsp;fortaleza&nbsp;de&nbsp;Ollantaytambo&nbsp;y&nbsp;el&nbsp;mercado&nbsp;de&nbsp;Pisac.&nbsp;Almuerzo&nbsp;buffet&nbsp;incluido&nbsp;en&nbsp;el&nbsp;corazón&nbsp;del&nbsp;Valle.&nbsp;Retorno&nbsp;a&nbsp;Cusco&nbsp;por&nbsp;la&nbsp;tarde.</p>"
          }
        ]
      },
      {
        "service_quote_person_id": "bef465fa-8767-4fbc-ba4a-5e34f16f890a",
        "departure_date": "2026-03-24",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-14",
        "arrive_time": "20:16:00",
        "service": {
          "id": "7da1b512-b886-4471-bf14-f7b295990532",
          "title": "El Camino del Apu Ausangate",
          "type": "group",
          "duration_value": 3,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;tour&nbsp;diseñado&nbsp;para&nbsp;fotógrafos&nbsp;y&nbsp;montañistas&nbsp;que&nbsp;buscan&nbsp;paisajes&nbsp;irreales&nbsp;y&nbsp;la&nbsp;famosa&nbsp;Montaña&nbsp;de&nbsp;Siete&nbsp;Colores.</p>"
        },
        "person": {
          "id": "bd8f423d-3422-45ee-bbb7-6f775f9c11c4",
          "full_name": "Jose Maria"
        },
        "cost": 250.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "88ebb82a-b947-4d82-b8d8-ad993bde6c90",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;de&nbsp;Cusco&nbsp;hacia&nbsp;Upis,&nbsp;camping&nbsp;al&nbsp;pie&nbsp;del&nbsp;nevado&nbsp;Ausangate&nbsp;con&nbsp;baños&nbsp;termales.</p>"
          },
          {
            "id": "bcebb020-0071-44a0-b12b-1d99d9012687",
            "title": "Dia 2",
            "description": "<p>Caminata&nbsp;por&nbsp;pasos&nbsp;de&nbsp;altura&nbsp;rodeando&nbsp;lagunas&nbsp;turquesas&nbsp;(Pucacocha).&nbsp;Campamento&nbsp;cerca&nbsp;de&nbsp;la&nbsp;montaña&nbsp;de&nbsp;colores.</p>"
          },
          {
            "id": "8dd7764f-5342-4e63-921f-7f22726ba4db",
            "title": "Dia 3",
            "description": "<p>Llegada&nbsp;a&nbsp;Vinicunca&nbsp;(Montaña&nbsp;Arcoíris)&nbsp;temprano&nbsp;en&nbsp;la&nbsp;mañana&nbsp;antes&nbsp;de&nbsp;la&nbsp;multitud.&nbsp;Descenso&nbsp;y&nbsp;retorno&nbsp;a&nbsp;la&nbsp;ciudad&nbsp;de&nbsp;Cusco.</p><p></p>"
          }
        ]
      },
      {
        "service_quote_person_id": "23e6cc61-623e-4b48-94b9-503a10acb3ab",
        "departure_date": "2026-03-24",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-14",
        "arrive_time": "20:16:00",
        "service": {
          "id": "7da1b512-b886-4471-bf14-f7b295990532",
          "title": "El Camino del Apu Ausangate",
          "type": "group",
          "duration_value": 3,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;tour&nbsp;diseñado&nbsp;para&nbsp;fotógrafos&nbsp;y&nbsp;montañistas&nbsp;que&nbsp;buscan&nbsp;paisajes&nbsp;irreales&nbsp;y&nbsp;la&nbsp;famosa&nbsp;Montaña&nbsp;de&nbsp;Siete&nbsp;Colores.</p>"
        },
        "person": {
          "id": "e2b9f682-8c8b-42fc-90b5-e638263de8e7",
          "full_name": "Mario Maria"
        },
        "cost": 250.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "88ebb82a-b947-4d82-b8d8-ad993bde6c90",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;de&nbsp;Cusco&nbsp;hacia&nbsp;Upis,&nbsp;camping&nbsp;al&nbsp;pie&nbsp;del&nbsp;nevado&nbsp;Ausangate&nbsp;con&nbsp;baños&nbsp;termales.</p>"
          },
          {
            "id": "bcebb020-0071-44a0-b12b-1d99d9012687",
            "title": "Dia 2",
            "description": "<p>Caminata&nbsp;por&nbsp;pasos&nbsp;de&nbsp;altura&nbsp;rodeando&nbsp;lagunas&nbsp;turquesas&nbsp;(Pucacocha).&nbsp;Campamento&nbsp;cerca&nbsp;de&nbsp;la&nbsp;montaña&nbsp;de&nbsp;colores.</p>"
          },
          {
            "id": "8dd7764f-5342-4e63-921f-7f22726ba4db",
            "title": "Dia 3",
            "description": "<p>Llegada&nbsp;a&nbsp;Vinicunca&nbsp;(Montaña&nbsp;Arcoíris)&nbsp;temprano&nbsp;en&nbsp;la&nbsp;mañana&nbsp;antes&nbsp;de&nbsp;la&nbsp;multitud.&nbsp;Descenso&nbsp;y&nbsp;retorno&nbsp;a&nbsp;la&nbsp;ciudad&nbsp;de&nbsp;Cusco.</p><p></p>"
          }
        ]
      },
      {
        "service_quote_person_id": "f9fb495e-7c65-47b4-bac2-86e932f3a75b",
        "departure_date": "2026-03-24",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-14",
        "arrive_time": "20:16:00",
        "service": {
          "id": "7da1b512-b886-4471-bf14-f7b295990532",
          "title": "El Camino del Apu Ausangate",
          "type": "group",
          "duration_value": 3,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;tour&nbsp;diseñado&nbsp;para&nbsp;fotógrafos&nbsp;y&nbsp;montañistas&nbsp;que&nbsp;buscan&nbsp;paisajes&nbsp;irreales&nbsp;y&nbsp;la&nbsp;famosa&nbsp;Montaña&nbsp;de&nbsp;Siete&nbsp;Colores.</p>"
        },
        "person": {
          "id": "fb4740fc-a415-42aa-a535-497956a3198f",
          "full_name": "Luis Bustamante"
        },
        "cost": 250.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "88ebb82a-b947-4d82-b8d8-ad993bde6c90",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;de&nbsp;Cusco&nbsp;hacia&nbsp;Upis,&nbsp;camping&nbsp;al&nbsp;pie&nbsp;del&nbsp;nevado&nbsp;Ausangate&nbsp;con&nbsp;baños&nbsp;termales.</p>"
          },
          {
            "id": "bcebb020-0071-44a0-b12b-1d99d9012687",
            "title": "Dia 2",
            "description": "<p>Caminata&nbsp;por&nbsp;pasos&nbsp;de&nbsp;altura&nbsp;rodeando&nbsp;lagunas&nbsp;turquesas&nbsp;(Pucacocha).&nbsp;Campamento&nbsp;cerca&nbsp;de&nbsp;la&nbsp;montaña&nbsp;de&nbsp;colores.</p>"
          },
          {
            "id": "8dd7764f-5342-4e63-921f-7f22726ba4db",
            "title": "Dia 3",
            "description": "<p>Llegada&nbsp;a&nbsp;Vinicunca&nbsp;(Montaña&nbsp;Arcoíris)&nbsp;temprano&nbsp;en&nbsp;la&nbsp;mañana&nbsp;antes&nbsp;de&nbsp;la&nbsp;multitud.&nbsp;Descenso&nbsp;y&nbsp;retorno&nbsp;a&nbsp;la&nbsp;ciudad&nbsp;de&nbsp;Cusco.</p><p></p>"
          }
        ]
      },
      {
        "service_quote_person_id": "17f3612b-0d09-4260-86ed-02d4ed9de4eb",
        "departure_date": "2026-03-24",
        "departure_time": "20:15:00",
        "arrive_date": "2026-05-14",
        "arrive_time": "20:16:00",
        "service": {
          "id": "7da1b512-b886-4471-bf14-f7b295990532",
          "title": "El Camino del Apu Ausangate",
          "type": "group",
          "duration_value": 3,
          "duration_unit": "days",
          "summary": "<p>Un&nbsp;tour&nbsp;diseñado&nbsp;para&nbsp;fotógrafos&nbsp;y&nbsp;montañistas&nbsp;que&nbsp;buscan&nbsp;paisajes&nbsp;irreales&nbsp;y&nbsp;la&nbsp;famosa&nbsp;Montaña&nbsp;de&nbsp;Siete&nbsp;Colores.</p>"
        },
        "person": {
          "id": "83aea660-c830-460d-bef9-e0e87f347bd0",
          "full_name": "Pasajero Temp temp-5"
        },
        "cost": 250.0,
        "notes": null,
        "itinerary_details": [
          {
            "id": "88ebb82a-b947-4d82-b8d8-ad993bde6c90",
            "title": "Dia 1",
            "description": "<p>Salida&nbsp;de&nbsp;Cusco&nbsp;hacia&nbsp;Upis,&nbsp;camping&nbsp;al&nbsp;pie&nbsp;del&nbsp;nevado&nbsp;Ausangate&nbsp;con&nbsp;baños&nbsp;termales.</p>"
          },
          {
            "id": "bcebb020-0071-44a0-b12b-1d99d9012687",
            "title": "Dia 2",
            "description": "<p>Caminata&nbsp;por&nbsp;pasos&nbsp;de&nbsp;altura&nbsp;rodeando&nbsp;lagunas&nbsp;turquesas&nbsp;(Pucacocha).&nbsp;Campamento&nbsp;cerca&nbsp;de&nbsp;la&nbsp;montaña&nbsp;de&nbsp;colores.</p>"
          },
          {
            "id": "8dd7764f-5342-4e63-921f-7f22726ba4db",
            "title": "Dia 3",
            "description": "<p>Llegada&nbsp;a&nbsp;Vinicunca&nbsp;(Montaña&nbsp;Arcoíris)&nbsp;temprano&nbsp;en&nbsp;la&nbsp;mañana&nbsp;antes&nbsp;de&nbsp;la&nbsp;multitud.&nbsp;Descenso&nbsp;y&nbsp;retorno&nbsp;a&nbsp;la&nbsp;ciudad&nbsp;de&nbsp;Cusco.</p><p></p>"
          }
        ]
      }
    ],
    "media_gallery": {
      "all_photos": [
        {
          "id": "7bc4356e-d0ff-4b97-bcbe-d9a156726b5d",
          "type": "image",
          "title": "Cover",
          "description": "Service cover image",
          "url": null,
          "file": "/media_files/media/2026/02/24/imagen_1.webp",
          "is_cover": true,
          "source": "service",
          "source_id": "553847c6-44b9-4f18-9870-b462943ab202",
          "source_name": "City Tour Cusco"
        },
        {
          "id": "2fcf28b2-db23-4a75-a854-214623198977",
          "type": "image",
          "title": "Media 4",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/imagen_5.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "553847c6-44b9-4f18-9870-b462943ab202",
          "source_name": "City Tour Cusco"
        },
        {
          "id": "5ef3666c-bf60-48d4-83fc-0a9f51395f55",
          "type": "image",
          "title": "Media 3",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/imagen_4.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "553847c6-44b9-4f18-9870-b462943ab202",
          "source_name": "City Tour Cusco"
        },
        {
          "id": "ffb249c8-8934-4591-8635-d7e00c089f92",
          "type": "image",
          "title": "Media 2",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/imagen_3.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "553847c6-44b9-4f18-9870-b462943ab202",
          "source_name": "City Tour Cusco"
        },
        {
          "id": "a71c6f47-622c-45fa-9bab-f0f8f708b48f",
          "type": "image",
          "title": "Media 1",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/imagen_2.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "553847c6-44b9-4f18-9870-b462943ab202",
          "source_name": "City Tour Cusco"
        },
        {
          "id": "26e40d05-a40e-4e3f-96fc-30270574e3f8",
          "type": "image",
          "title": "Cover",
          "description": "Service cover image",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_3.webp",
          "is_cover": true,
          "source": "service",
          "source_id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "source_name": "Valle Sagrado de los Incas (Vip)"
        },
        {
          "id": "aebe7690-f676-469b-b985-7cf33daa9725",
          "type": "image",
          "title": "Media 4",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_5.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "source_name": "Valle Sagrado de los Incas (Vip)"
        },
        {
          "id": "65087896-57c4-44e7-ba10-5312c11d6345",
          "type": "image",
          "title": "Media 3",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_4.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "source_name": "Valle Sagrado de los Incas (Vip)"
        },
        {
          "id": "d9500639-f8aa-436b-84ff-368ce3d8ea85",
          "type": "image",
          "title": "Media 2",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_2.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "source_name": "Valle Sagrado de los Incas (Vip)"
        },
        {
          "id": "8109ba85-cea3-46de-939b-d56184db732f",
          "type": "image",
          "title": "Media 1",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_1.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "source_name": "Valle Sagrado de los Incas (Vip)"
        },
        {
          "id": "b74c2553-d7e9-46b2-ae73-1dc99dd3af5d",
          "type": "image",
          "title": "Cover",
          "description": "Service cover image",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_5_pLtRPAY.webp",
          "is_cover": true,
          "source": "service",
          "source_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "source_name": "Machu Picchu \"Conexión Amanecer\""
        },
        {
          "id": "b5f9320f-d854-4ddb-8f7a-1dff084acd2a",
          "type": "image",
          "title": "Media 4",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_4_w0i5QEQ.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "source_name": "Machu Picchu \"Conexión Amanecer\""
        },
        {
          "id": "ddb33e03-78b2-4502-adc5-51ab6f3f2e88",
          "type": "image",
          "title": "Media 3",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_3_GVie4xX.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "source_name": "Machu Picchu \"Conexión Amanecer\""
        },
        {
          "id": "0b2258ea-ea06-4567-869d-80010b257a8d",
          "type": "image",
          "title": "Media 2",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_2_CFlfgPt.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "source_name": "Machu Picchu \"Conexión Amanecer\""
        },
        {
          "id": "30e235a7-655b-4c11-b347-a2802abcf269",
          "type": "image",
          "title": "Media 1",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_1_Vlf0mx7.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "source_name": "Machu Picchu \"Conexión Amanecer\""
        },
        {
          "id": "e5ffded8-58e3-432a-a9da-8e8d35df27d2",
          "type": "image",
          "title": "Cover",
          "description": "Service cover image",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_5_0DxFd2F.webp",
          "is_cover": true,
          "source": "service",
          "source_id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "source_name": "Salkantay Trek a Machu Picchu"
        },
        {
          "id": "05eb3e99-2e0a-4184-b128-9ccbfd2b154c",
          "type": "image",
          "title": "Media 4",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_4_COjljnw.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "source_name": "Salkantay Trek a Machu Picchu"
        },
        {
          "id": "9f3a01ac-0ea0-4141-860c-9cb325417c19",
          "type": "image",
          "title": "Media 3",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_3_DFJ1Bqh.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "source_name": "Salkantay Trek a Machu Picchu"
        },
        {
          "id": "28356626-0c72-4381-871b-9f00ad560c23",
          "type": "image",
          "title": "Media 2",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_2_1Tv6HrO.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "source_name": "Salkantay Trek a Machu Picchu"
        },
        {
          "id": "eafed371-7d49-436d-bf1c-74ede9a2e317",
          "type": "image",
          "title": "Media 1",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_1_ffhtWdw.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "source_name": "Salkantay Trek a Machu Picchu"
        },
        {
          "id": "74d46f2b-98ac-4702-8323-35bcafa7a486",
          "type": "image",
          "title": "Cover",
          "description": "Service cover image",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_1_tU5XrRu.webp",
          "is_cover": true,
          "source": "service",
          "source_id": "7da1b512-b886-4471-bf14-f7b295990532",
          "source_name": "El Camino del Apu Ausangate"
        },
        {
          "id": "98dd6362-8364-4c72-92de-bb97885b8616",
          "type": "image",
          "title": "Media 4",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_5_SILSJH1.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "7da1b512-b886-4471-bf14-f7b295990532",
          "source_name": "El Camino del Apu Ausangate"
        },
        {
          "id": "4996695c-ebc5-4603-a12c-2cf5b28a8a0e",
          "type": "image",
          "title": "Media 3",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_4_AtQxst5.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "7da1b512-b886-4471-bf14-f7b295990532",
          "source_name": "El Camino del Apu Ausangate"
        },
        {
          "id": "ea65b2c6-87a7-426c-9063-1ae7247b168e",
          "type": "image",
          "title": "Media 2",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_3_4EP5VZq.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "7da1b512-b886-4471-bf14-f7b295990532",
          "source_name": "El Camino del Apu Ausangate"
        },
        {
          "id": "ecec955c-5e54-4343-9b41-a85055eb7312",
          "type": "image",
          "title": "Media 1",
          "description": "",
          "url": null,
          "file": "/media_files/media/2026/02/24/image_2_UYr4FjO.webp",
          "is_cover": false,
          "source": "service",
          "source_id": "7da1b512-b886-4471-bf14-f7b295990532",
          "source_name": "El Camino del Apu Ausangate"
        }
      ],
      "services_media": [
        {
          "service_id": "553847c6-44b9-4f18-9870-b462943ab202",
          "service_title": "City Tour Cusco",
          "media": [
            {
              "id": "7bc4356e-d0ff-4b97-bcbe-d9a156726b5d",
              "type": "image",
              "title": "Cover",
              "description": "Service cover image",
              "url": null,
              "file": "/media_files/media/2026/02/24/imagen_1.webp",
              "is_cover": true
            },
            {
              "id": "2fcf28b2-db23-4a75-a854-214623198977",
              "type": "image",
              "title": "Media 4",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/imagen_5.webp",
              "is_cover": false
            },
            {
              "id": "5ef3666c-bf60-48d4-83fc-0a9f51395f55",
              "type": "image",
              "title": "Media 3",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/imagen_4.webp",
              "is_cover": false
            },
            {
              "id": "ffb249c8-8934-4591-8635-d7e00c089f92",
              "type": "image",
              "title": "Media 2",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/imagen_3.webp",
              "is_cover": false
            },
            {
              "id": "a71c6f47-622c-45fa-9bab-f0f8f708b48f",
              "type": "image",
              "title": "Media 1",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/imagen_2.webp",
              "is_cover": false
            }
          ]
        },
        {
          "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "service_title": "Valle Sagrado de los Incas (Vip)",
          "media": [
            {
              "id": "26e40d05-a40e-4e3f-96fc-30270574e3f8",
              "type": "image",
              "title": "Cover",
              "description": "Service cover image",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_3.webp",
              "is_cover": true
            },
            {
              "id": "aebe7690-f676-469b-b985-7cf33daa9725",
              "type": "image",
              "title": "Media 4",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_5.webp",
              "is_cover": false
            },
            {
              "id": "65087896-57c4-44e7-ba10-5312c11d6345",
              "type": "image",
              "title": "Media 3",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_4.webp",
              "is_cover": false
            },
            {
              "id": "d9500639-f8aa-436b-84ff-368ce3d8ea85",
              "type": "image",
              "title": "Media 2",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_2.webp",
              "is_cover": false
            },
            {
              "id": "8109ba85-cea3-46de-939b-d56184db732f",
              "type": "image",
              "title": "Media 1",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_1.webp",
              "is_cover": false
            }
          ]
        },
        {
          "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "service_title": "Machu Picchu \"Conexión Amanecer\"",
          "media": [
            {
              "id": "b74c2553-d7e9-46b2-ae73-1dc99dd3af5d",
              "type": "image",
              "title": "Cover",
              "description": "Service cover image",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_5_pLtRPAY.webp",
              "is_cover": true
            },
            {
              "id": "b5f9320f-d854-4ddb-8f7a-1dff084acd2a",
              "type": "image",
              "title": "Media 4",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_4_w0i5QEQ.webp",
              "is_cover": false
            },
            {
              "id": "ddb33e03-78b2-4502-adc5-51ab6f3f2e88",
              "type": "image",
              "title": "Media 3",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_3_GVie4xX.webp",
              "is_cover": false
            },
            {
              "id": "0b2258ea-ea06-4567-869d-80010b257a8d",
              "type": "image",
              "title": "Media 2",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_2_CFlfgPt.webp",
              "is_cover": false
            },
            {
              "id": "30e235a7-655b-4c11-b347-a2802abcf269",
              "type": "image",
              "title": "Media 1",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_1_Vlf0mx7.webp",
              "is_cover": false
            }
          ]
        },
        {
          "service_id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "service_title": "Salkantay Trek a Machu Picchu",
          "media": [
            {
              "id": "e5ffded8-58e3-432a-a9da-8e8d35df27d2",
              "type": "image",
              "title": "Cover",
              "description": "Service cover image",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_5_0DxFd2F.webp",
              "is_cover": true
            },
            {
              "id": "05eb3e99-2e0a-4184-b128-9ccbfd2b154c",
              "type": "image",
              "title": "Media 4",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_4_COjljnw.webp",
              "is_cover": false
            },
            {
              "id": "9f3a01ac-0ea0-4141-860c-9cb325417c19",
              "type": "image",
              "title": "Media 3",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_3_DFJ1Bqh.webp",
              "is_cover": false
            },
            {
              "id": "28356626-0c72-4381-871b-9f00ad560c23",
              "type": "image",
              "title": "Media 2",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_2_1Tv6HrO.webp",
              "is_cover": false
            },
            {
              "id": "eafed371-7d49-436d-bf1c-74ede9a2e317",
              "type": "image",
              "title": "Media 1",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_1_ffhtWdw.webp",
              "is_cover": false
            }
          ]
        },
        {
          "service_id": "7da1b512-b886-4471-bf14-f7b295990532",
          "service_title": "El Camino del Apu Ausangate",
          "media": [
            {
              "id": "74d46f2b-98ac-4702-8323-35bcafa7a486",
              "type": "image",
              "title": "Cover",
              "description": "Service cover image",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_1_tU5XrRu.webp",
              "is_cover": true
            },
            {
              "id": "98dd6362-8364-4c72-92de-bb97885b8616",
              "type": "image",
              "title": "Media 4",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_5_SILSJH1.webp",
              "is_cover": false
            },
            {
              "id": "4996695c-ebc5-4603-a12c-2cf5b28a8a0e",
              "type": "image",
              "title": "Media 3",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_4_AtQxst5.webp",
              "is_cover": false
            },
            {
              "id": "ea65b2c6-87a7-426c-9063-1ae7247b168e",
              "type": "image",
              "title": "Media 2",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_3_4EP5VZq.webp",
              "is_cover": false
            },
            {
              "id": "ecec955c-5e54-4343-9b41-a85055eb7312",
              "type": "image",
              "title": "Media 1",
              "description": "",
              "url": null,
              "file": "/media_files/media/2026/02/24/image_2_UYr4FjO.webp",
              "is_cover": false
            }
          ]
        }
      ],
      "persons_media": []
    },
    "cost_summary": {
      "total_price": 3740.0,
      "currency": "USD",
      "total_services": 5,
      "total_persons": 8,
      "by_service_type": {
        "group": {
          "count": 9,
          "total": 1350.0,
          "services": [
            "El Camino del Apu Ausangate",
            "City Tour Cusco"
          ]
        },
        "private": {
          "count": 14,
          "total": 1890.0,
          "services": [
            "Machu Picchu \"Conexión Amanecer\"",
            "Valle Sagrado de los Incas (Vip)"
          ]
        },
        "arbitrary": {
          "count": 4,
          "total": 500.0,
          "services": [
            "Salkantay Trek a Machu Picchu"
          ]
        }
      },
      "by_person": [
        {
          "person_id": "e2b9f682-8c8b-42fc-90b5-e638263de8e7",
          "person_name": "Mario Maria",
          "total": 540.0,
          "services_count": 4
        },
        {
          "person_id": "2e9a70d4-e9c4-4c59-9f11-4f89acc2d14d",
          "person_name": "Pasajero Temp temp-2",
          "total": 540.0,
          "services_count": 4
        },
        {
          "person_id": "fb4740fc-a415-42aa-a535-497956a3198f",
          "person_name": "Luis Bustamante",
          "total": 525.0,
          "services_count": 3
        },
        {
          "person_id": "83aea660-c830-460d-bef9-e0e87f347bd0",
          "person_name": "Pasajero Temp temp-5",
          "total": 515.0,
          "services_count": 3
        },
        {
          "person_id": "bd8f423d-3422-45ee-bbb7-6f775f9c11c4",
          "person_name": "Jose Maria",
          "total": 515.0,
          "services_count": 3
        },
        {
          "person_id": "28497a1f-d82c-4291-8790-7e5a1d9e929d",
          "person_name": "Cristian Monzon Guzman",
          "total": 415.0,
          "services_count": 4
        },
        {
          "person_id": "46bbf972-5677-4e46-8f71-0450e729d25a",
          "person_name": "Pasajero Temp temp-1",
          "total": 390.0,
          "services_count": 3
        },
        {
          "person_id": "cb5788e3-827d-42bb-ac31-394aabc4a7a4",
          "person_name": "Pepe Pepe",
          "total": 300.0,
          "services_count": 3
        }
      ],
      "by_service": [
        {
          "service_id": "7da1b512-b886-4471-bf14-f7b295990532",
          "service_name": "El Camino del Apu Ausangate",
          "service_type": "group",
          "total": 1250.0,
          "persons_count": 5
        },
        {
          "service_id": "9fa1eb00-803f-42b3-9014-7427369ba624",
          "service_name": "Machu Picchu \"Conexión Amanecer\"",
          "service_type": "private",
          "total": 1200.0,
          "persons_count": 8
        },
        {
          "service_id": "d427b527-1019-4de7-979f-e2f9780af28c",
          "service_name": "Valle Sagrado de los Incas (Vip)",
          "service_type": "private",
          "total": 690.0,
          "persons_count": 6
        },
        {
          "service_id": "0e629236-9d16-449e-9b8c-d05e75918090",
          "service_name": "Salkantay Trek a Machu Picchu",
          "service_type": "arbitrary",
          "total": 500.0,
          "persons_count": 4
        },
        {
          "service_id": "553847c6-44b9-4f18-9870-b462943ab202",
          "service_name": "City Tour Cusco",
          "service_type": "group",
          "total": 100.0,
          "persons_count": 4
        }
      ]
    }
  }
  ```


## ToDo
Este módulo nos permite gestionar las pendientes de cada usuario
### Get Todo by User
Este endpoint nos permite listar el _todo_ de un usuario, este está relacionado con el JWT del usuario autenticado.
- Get Todo: http://localhost:8000/api/todo/

### Filters
- Filtros para _todo_ `http://localhost:8000/api/todo/?q=ar&priority=hard` es un filtro con búsqueda `or` para los siguientes campos:
  - title: Filtrar por título
  - description: Filtrar por descripción
  - Y un filtro por prioridad `http://localhost:8000/api/todo/?priority=hard este es de tipo `and` 

### Post ToDo
Este endpoint nos permite crear un _todo_ pasando en el cuerpo los datos requeridos
- Post ToDo: http://localhost:8000/api/todo/
- Body:
```json
{
  "title": "Creaer Articulo",
  "description": "Se necesita crear el articulo numero 2"
} 
```

### Patch ToDo
Este endpoint nos permite actualizar un _todo_ pasando solo lo que se desea actualizar o todo el cuerpo.
- Patch: http://localhost:8000/api/todo/54e6dcea-be7f-4d67-8f9a-a0e584253792/
- Body: 
```json
{
  "title": "Crear Articulo Actualizado",
  "description": "Se necesita crear el articulo numero 2 con mas detalles"
}
```

### Action
#### Change Status
Este endpoint nos permite cambiar el estado de un _todo_ pasando el id por la url
- change-status: `POST` http://localhost:8000/api/todo/54e6dcea-be7f-4d67-8f9a-a0e584253792/change-status/


## TODO:
1. Hacer las validaciones para los servicios al crear, validar lo siguiente:
   - Validar que el precioRule en caso de los grupales este solo puede tener uno, y el valor que pongas es el mismo de precio referencial, no puede tener pricingTier
   - Validar que el precioRule en caso de los privados este pueden tener varios preciosRules pero no pueden tener pricingTier
   - Validar que el pricingTier solo son para arbitrarios y que no pueden tener priceRules
2. Documentar todo relacionado a auditlog.
3. Eliminar unit_price de ServiceQuotePerson
4. Agregar en ServiceQuotePerson:
   - departure_date
   - arrive_date
   - departure_time
   - arrive_time
5. Se debe poder duplicar las versiones de las cotizaciones
6. Se debe poder versionar las cotizaciones
7. La logica para hacer un calcular la cotización es la siguiente:
   - Los tours (services) que son de tipo grupal se multiplican por la cantidad de personas que se apuntan a ese tour
   - Los tour (services) que son de tipo privado estos tienen una logica de la siguiente, este maneja precios que se dividen y precios que se multiplican
     - Los precios que se dividen es el total de personas que se apuntan a ese tour entre el valor que se divide (Ejemplo: 500 USD dividido entre 5 personas, cada uno paga 100 USD) y todo eso se va sumando entre los diversos items que tenga de este tipo.
     - Los precios que se multiplican es el valor del precio multiplicado por la cantidad de personas (Ejemplo: 100 USD multiplicado por 5 personas, cada uno paga 100 USD pero el total es 500 USD) y todo eso se va sumando entre los diversos items que tenga de este tipo.
   - Los tours (services) que son de tipo arbitrario, estos mantienen un rango de precios _PricingTier_ y el precio final se calcula dependiendo de la cantidad de personas que se apunten a ese tour, se busca el rango que corresponda a esa cantidad de personas y se toma el precio total de ese rango.
   


