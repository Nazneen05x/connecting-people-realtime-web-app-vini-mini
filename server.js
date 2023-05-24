
import express from 'express'

const url = 'https://api.vinimini.fdnd.nl/api/v1'

// Maak een nieuwe express app
const app = express()

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





// Stel het poortnummer in en start express
app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

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