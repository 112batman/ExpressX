import { AuthenticatedApp } from "../src";

const app = new AuthenticatedApp(80, 'mongodb://192.168.1.82:27017/ExpressX') // Create a new server at port 80 with a mongodb database at specified uri

app.setPageNotFound(__dirname + '/html/404.html') // Set the 404 page to html/404.html
app.setPublicDir(__dirname + '/public') // Staticly server everything in the public dir

app.requireAuthentication('admin/*') // Require authentication for all requests starting with /admin

app.listen().then(console.log) // Start listening and log the port when up