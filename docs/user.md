# user API Spec

## Register User API

Endpoint : POST/api/

Request Body :

```Json
{
 "username":"hakim",
 "passowrd":"anwar",
 "name":"anwarhakim"
}
```

Response Body Success :

```Json
   "data":{
    "username":"hakim",
    "name":"anwarhakim"
   },
```

Response Body Error :

```Json
{
  "error":"username already register"
}
```

## Login User API

Endpoint : POST api/users/login

Request Body :

```Json
{
 "username":"hakim",
 "passowrd":"anwar",
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body error :

```json
{
  "error": "username or password wrong"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Header:
-Authorization : token

Request Body :

```Json
{
 "name":"Anwarhakim", //optional
 "passowrd":"new password", //optional
}
```

```json
{
  "data": {
    "username": "hakim",
    "name": "anwarhakim"
  }
}
```

## Get User APi

Endpoint: GET api/users/current

Header :

-Authorization : token

Response Body Succes

```json
{
  "data": {
    "username": "hakim",
    "name": "hakim"
  }
}
```

Response Body Succes

```json
{
  "error": "Unauthorized"
}
```

## Logout User API

Endpoint: DELETE api/users/logout

Header :

-Authorization : token

Response Body Succes

```json
{
  "data": "OK"
}
```

Response Body Error

```json
{
  "error": "Unauthorized"
}
```
