
import * as path from 'path'

import { Server } from 'socket.io'
import { createServer } from 'http'
import express from 'express'



const url = 'https://api.vinimini.fdnd.nl/api/v1'

// Maak een nieuwe express app
const app = express()
const http = createServer(app)
const ioServer = new Server(http, {
  connectionStateRecovery: {
    // De tijdsduur voor recovery bij disconnect
    maxDisconnectionDuration: 2 * 60 * 1000,
    // Of middlewares geskipped moeten worden bij recovery (ivm login)
    skipMiddlewares: true,
  },
})

// Serveer client-side bestanden
app.use(express.static(path.resolve('public')))


// Start de socket.io server op
ioServer.on('connection', (client) => {
  // Log de connectie naar console
  console.log(`user ${client.id} connected`)

})

// Start de socket.io server op
ioServer.on('connection', (client) => {
  // Log de connectie naar console
  console.log(`user ${client.id} connected`)

  // Luister naar een message van een gebruiker
  client.on('message', (message) => {
    // Log het ontvangen bericht
    console.log(`user ${client.id} sent message: ${message}`)

    // Verstuur het bericht naar alle clients
    ioServer.emit('message', message)
  }) 

  // Luister naar een disconnect van een gebruiker
  client.on('disconnect', () => {
    // Log de disconnect
    console.log(`user ${client.id} disconnected`)
  })
})


// Stel in hoe we express gebruiken
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

// Maak een route voor de index
app.get('/', (request, response) => {
  let categoriesUrl = url + '/categories'

  fetchJson(categoriesUrl).then((data) => {
    response.render('index', data)
  })
})


// Route voor de producten
app.get('/categorie', (request, response) => {
  let query = request.query.categorieId

  let productenUrl = url + `/producten?categorieId=${query}`

  fetchJson(productenUrl).then((data) => {
    response.render('pinda-ei-producten', {producten: data});
  });
})


app.get('/product', (request, response) => {
  let query = request.query.id

  let productenUrl = url + `/product?id=${query}`
  console.log(productenUrl)
  fetchJson(productenUrl).then((data) => {
    console.log(data)
    response.render('pinda-product', data);
  });
})

app.get('/forum', (request, response) => {

  let forumUrl = url + '/forum'

  fetchJson(forumUrl).then((data) => {
    response.render('forum', data);
  });
})

app.post('/forum', (request, response) => {
  const url = 'https://api.vinimini.fdnd.nl/api/v1'
  const forumUrl = 'url + /forum'

  request.body.afgerond = false
  request.body.persoonId = 'clemozv3c3eod0bunahh71sx7'
  request.body.datum = request.body.datum + ':00Z'
  request.body.herinnering = [request.body.herinnering + ':00Z']

  postJson(url + '/forum', request.body).then((data) => {
    let newForum = { ... request.body }
    console.log(newForum);

    if (data.success) {
      response.redirect('/') 
      console.log("werkt!")
      console.log(data);
    }

    else {
      const errormessage = `${data.message}: Mogelijk komt dit door de slug die al bestaat.`
      const newdata = { error: errormessage, values: newForum }
      console.log(data)
      console.log(JSON.stringify(data))
      response.render('index', newdata)
    }
  })
})



// Stel het poortnummer in en start express
// app.set('port', process.env.PORT || 8000)
// app.listen(app.get('port'), function () {
//   console.log(`Application started on http://localhost:${app.get('port')}`)
// })

const port = process.env.PORT || 4242

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}


// Start een http server op het ingestelde poortnummer en log de url
http.listen(port, () => {
  console.log('listening on http://localhost:' + port)
})