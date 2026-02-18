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

### Filters
  - Filtros para _person_ `http://localhost:8000/api/person/summary/?q=Cris` es un filtro con busqueda `or` para los siguientes campos:
  - first_name: Filtrar por nombre
  - last_name: Filtrar por apellido
  - email: Filtrar por email
  - phone_number: Filtrar por número de teléfono q
- Y un filtro por nacionalidad `http://localhost:8000/api/person/summary/?nationality=US` este es de tipo `and`

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

### Delete Person
Este endpoint nos permite eliminar un _person_ pasando el id
- Delete: http://127.0.0.1:8000/api/person/f5c80b3f-efe7-4fd9-a1d8-0429035b5567/

### Actions
#### Upload Document
Este endpoint nos permite subir un documento y relacionarlo al _person_ pasado por la url, todo lo que se sube aqui esta en categoria _document_.
- upload-document: `POST` http://127.0.0.1:8000/api/person/f5c80b3f-efe7-4fd9-a1d8-0429035b5567/upload-document/
- Body: Form-Data
    - title: Documento del cliente
    - description: Este es un documento del cliente
    - file: (Seleccionar archivo de documento)

#### Upload Image
Este endpoint nos permite subir una imagen y relacionarla al _person_ pasado por la url, todo lo que se sube aqui esta en categoria _image.
- upload-image: `POST` http://127.0.0.1:8000/api/person/f5c80b3f-efe7-4fd9-a1d8-0429035b5567/upload-media/
- Body: Form-Data
    - title: Imagen del cliente
    - description: Esta es una imagen del cliente
    - file: (Seleccionar archivo de imagen)

#### Get Summary Person
Este endpoint nos permite obtener un resumen de todos los _person_ con los siguientes campos:
- Get Summary Person: http://127.0.0.1:8000/api/person/summary
- Campos:
  - id
  - first_name
  - last_name
  - email
  - phone_number
  - nationality
  - created_at
  - updated_at

### Countries
Este endpoint nos permite obtener la lista de países disponibles para asignar a la nacionalidad de un cliente.
- Get Countries: http://localhost:8000/api/countries/
- Response:
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
   


