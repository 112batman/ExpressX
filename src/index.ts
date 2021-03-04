import * as express from 'express'
import * as http from 'http'
import * as fs from 'fs'
import * as mongoose from 'mongoose'
import * as g2r from 'glob-to-regexp'

class BaseApp {
    /**
     * The port the server is set to listen to
     */
    public readonly port: number
    /**
     * Internal Express app
     */
    public readonly app: express.Application
    /**
     * Internal http server
     */
    public readonly server: http.Server
    /**
     * Internal router
     */
    public readonly router: express.Router

    /**
     * Create a new ExpressX app
     * @param port The port for the server to listen on
     */
    constructor(port: number) {
        this.port = port

        this.app = express()
        this.server = http.createServer(this.app)
        this.router = express.Router()

        this.app.use(this.router)

        this.lateInit()
    }

    protected lateInit() {

    }

    /**
     * Start listening on specified port
     */
    public listen(): Promise<number> {
        return new Promise(res => {
            this.server.listen(this.port, () => {
                res(this.port)
            })
        })
    }
}

export class App extends BaseApp {
    /**
     * Html data for the 404 page
     */
    private pageNotFound: string = '<h1>404: Page not found</h1>'
    
    protected lateInit() {
        super.lateInit()

        this.app.use((req, res, next) => {
            res.send(this.pageNotFound)
            next()
        })
    }

    /**
     * Set the html file to respond with when a client requests a non-existing page
     * @param path Path to the html file to respond with
     */
    public setPageNotFound(path: string) {
        if(fs.existsSync(path)) {
            this.pageNotFound = fs.readFileSync(path, {
                encoding: 'utf-8'
            })
        }else {
            throw new Error('No file exists at specified path')
        }
    }

    /**
     * Set the "public" dir, everything in the public dir is staticly served by the server
     * @param path The path to the public directory
     * @param index The name of the main file of the website, defaults to index.html
     */
    public setPublicDir(path: string, index: string = 'index.html') {
        if(fs.existsSync(path)) {
            if(fs.statSync(path).isDirectory) {
                this.router.use(express.static(path, {
                    extensions: ['html', 'htm'],
                    index
                }))
            }else {
                throw new Error('The specified path is not a directory')
            }
        }else {
            throw new Error('Nothing exists at specified path')
        }
    }
}

export class AuthenticatedApp extends App {
    /**
     * Matched routes require authentication
     */
    private authenticated: string[] = []
    /**
     * The mongodb uri
     */
    private dbUri: string = ''
    /**
     * The mongoose connection
     */
    private db: typeof mongoose

    private uDb: { [key: string]: string } = {
        'yee': 'wif'
    }

    /**
     * Create a new ExpressX instance with support for authenticated routes
     * @param port The port for the server to listen on
     * @param dbUri A mongodb uri for the database to use for authentication
     */
    constructor(port: number, dbUri: string) {
        super(port)

        this.dbUri = dbUri
    }

    protected lateInit() {
        super.lateInit()

        this.router.use((req, res, next) => {
            for(let i = 0; i < this.authenticated.length; i++) {
                const route = this.authenticated[i]

                if((g2r(route, {
                    globstar: false
                }).test(req.url))) {
                    if(!req.query.username || !req.query.password) {
                        res.send('You are not allowed to visit this page')
                    }else {
                        if(this.uDb[<string>req.query.username] && this.uDb[<string>req.query.username] === req.query.password) {
                            break
                        }else {
                            res.send('You are not allowed to visit this page')
                        }
                    }
                    return
                }else continue
            }

            next()
        })
    }

    public async listen(): Promise<number> {
        this.db = await mongoose.connect(this.dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        return super.listen()
    }

    public requireAuthentication(route: string) {
        if(!this.authenticated.includes(route)) {
            let r = route
            if(!r.startsWith('/')) r = `/${r}`

            this.authenticated.push(r)
        }
    }
}