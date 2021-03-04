import { AuthenticatedApp } from "../src";

const app = new AuthenticatedApp(80, 'mongodb://192.168.1.82:27017/ExpressX') // Create a new server at port 80 with a mongodb database at specified uri

app.setPageNotFound(__dirname + '/html/404.html') // Set the 404 page to html/404.html
app.setPublicDir(__dirname + '/public') // Staticly server everything in the public dir

app.requireAuthentication('admin/*') // Require authentication for all requests starting with /admin

app.listen().then((port) => {
    console.log(`Online on port ${port}`) // Log the port when up

    // !!!Note that user related operations like app.isAvailable() or app.register() can only be called after app.listen() is resolved
    app.isAvailable('John Doe').then((available) /* Check wheter the username John Doe is still available */  => {
        if(available) { // Only register or user when the username is still available
            app.register('John Doe', 'john.doe@example.com', '123456').then(() => {
                console.log('Registered John Doe') // Log a message when registering is complete
            }) // Register a user
        }
    })
}) // Start listening