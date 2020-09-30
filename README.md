# api-zro

API criada para o desafio backend do Zro Bank.

### Heroku URL:

> https://api-zro.herokuapp.com

---

## Endpoints:

## - _Create user_

### Request

`POST /api/v1/users`

```bash
curl --location --request POST 'https://api-zro.herokuapp.com/api/v1/users' \
--header 'Content-Type: application/json' \
--data-raw '{
                "email": "test@test.test",
                "password": "testesteste"
            }'
```

### Response

```JSON
{
    "status": "success",
    "message": "User Added!",
    "data": {
        "id": 1,
        "email": "test@test.test",
        "updatedAt": "2020-09-30T10:24:38.816Z",
        "createdAt": "2020-09-30T10:24:38.816Z"
    }
}
```

---

## - _Get all users_

### Request

`GET /api/v1/users`

```bash
curl --location --request GET 'https://api-zro.herokuapp.com/api/v1/users'
```

### Response

```JSON
{
    "status": "success",
    "message": "Users retrieved.",
    "data": [
        {
            "id": 1,
            "email": "test@test.test",
            "createdAt": "2020-09-29T20:52:15.704Z",
            "updatedAt": "2020-09-29T20:52:15.704Z"
        },
        {
            "id": 2,
            "email": "test2@test.test",
            "createdAt": "2020-09-30T10:21:11.279Z",
            "updatedAt": "2020-09-30T10:21:11.279Z"
        }
    ]
}
```

---

## - _Get user by ID._

### Request

`GET /api/v1/users/:id`

```bash
curl --location --request GET 'https://api-zro.herokuapp.com/api/v1/users/:id'
```

### Response

```JSON
{
    "status": "success",
    "message": "User found.",
    "data": {
        "id": 1,
        "email": "test@test.test",
        "createdAt": "2020-09-30T10:21:11.279Z",
        "updatedAt": "2020-09-30T10:21:11.279Z"
    }
}
```

---
