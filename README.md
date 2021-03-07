# :warning: Repo notice
I mainly made this for pesonal use and can therefore not guarantee that I will continue maintaining this project. But feel free to use it or fork and continue development yourself :)

# ExpressX
Express wrapper for even easier usage and built-in authentication trough MongoDB
## Usage
```typescript
import { App } from 'expressx'; // Import App from ExpressX

const app = new App(80); // Create a new ExpressX app that will listen on port 80

app.listen().then((port) => {
    console.log(`Listening on port ${port}`)
}); /* app.listen() returns a promise with the port that the server is listening on
We log a message including this port when the server is started up and ready to recieve requests */
```
If you go to [localhost](http://localhost:80) you'll see the default 404 page. \
Great, now you've got a basic server with on 5 lines of code, but it doesn't serve any content. \
Let's serve some static files. \
Add the following code before the listen line:
```typescript
app.setPublicDir(__dirname + '/public') /* This will make the server staticly serve files in the given directory.
You may need to change public to something else depending on the name of your directory */
```
If you go to [localhost](http://localhost:80) again you'll now see that everything in the public dir is now staticly served. \
If you go to a nonexistant path you'll still get the default 404 page, let's use a costum one instead. \
Add the following code beneath app.setPublicDir:
> :information_source: The order in wich you run any of these methods doesn't matter :)
```typescript
app.setPageNotFound(__dirname + '/public/404.html') /* This will make sure the server serves this file as the 404 page */
```
If you go to a non-existant path on localhost [localhost/thisisveryunlikelytoexist](http://localhost:80/thisisveryunlikelytoexist) you'll see you get presented with the 404 page you just specified. \
You're done, you now have a very simple webserver that serves static files and a costum 404 page!
## Usage with authentication (built-in)
ExpressX provides several utility methods for authentication. \
If you want to use these methods switch out the App class for the AuthenticatedApp class.
### List of authentication utility methods:
name | description
:---: | :---:
`app.requireAuthentication(route: string): void` | Specify a route or glob that requires users to be authenticated
:warning: All below methods require app.listen() to be called and have finished
`app.isAvalable(name: string): Promise<boolean>` | Get wheter a specific username is still available
`app.register(name: string, email: string, password: string): Promise<void>` | Register a specific user by name, email and unhashed password. Throws an error when username is taken
### How to authenticate
A client authenticates using the username and password query parameters. \
username is the plain text username, \
password is the plain text password
## Advanced usage
### List of exposed Express classes/methods on App class:
name | description | reference
:---: | :---: | :---:
app.app | Internal Express.Application instance | [Express docs](https://expressjs.com/en/4x/api.html#app)
app.router | Express.Router the server uses for managing requests, use this for costum request handling and not app.app | [Express docs](https://expressjs.com/en/4x/api.html#router)
app.server | http.Server instance used by the server | [NodeJS docs](https://nodejs.org/api/http.html#http_class_http_server)