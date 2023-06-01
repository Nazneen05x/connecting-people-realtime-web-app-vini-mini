let ioServer = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')
let Gebruikersnaam = document.querySelector('#Gebruikersnaam')
let Bericht = document.querySelector('#Bericht')





// Luister naar het submit event
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()

  // Als er überhaupt iets getypt is
  if (input.value) {
    // Stuur het bericht naar de server
    ioServer.emit('message',{ 
      Gebruikersnaam: Gebruikersnaam.value,
      Bericht: Bericht.value
    })

    // Leeg het form field
    Bericht.value = ''
  }
})




// Luister naar berichten van de server
ioServer.on('message', (message) => {
  addMessage(`${message.Gebruikersnaam}: ${message.Bericht}`)

})



/**
 * Impure function that appends a new li item holding the passed message to the
 * global messages object and then scrolls the list to the last message.
 * @param {*} message the message to append
 */
function addMessage(message) {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  messages.scrollTop = messages.scrollHeight
}