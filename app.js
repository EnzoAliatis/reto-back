const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 5000



var getSubtitles = require('youtube-captions-scraper').getSubtitles;


app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

function convert(value) {
  return(Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00'))
}

app.get('/subtitles', (req, res) => {
  let fil
  getSubtitles({
    videoID: 'Xgaz7dzyDKU', // youtube video id
    lang: 'es' // default: `en`
  }).then(async function(captions) {
    fil = captions.filter(cap => cap.text.includes('ese tema y ojalá no le impulsen'))
    init = parseFloat(fil[0].start)
    end = parseFloat(fil[0].dur)
    fil[0].Timestamp = `${convert(init)}-${convert(init + end)}`
    await res.send(fil[0])
    // console.log(captions)
  });  
})

app.post('/subtitles', (req, res) => {
  try {
    let fil
    getSubtitles({
      videoID: req.body.code, // youtube video id
      lang: 'es' // default: `en`
    }).then(async function(captions) {
      fil = captions.filter(cap => cap.text.includes(req.body.string))
      init = parseFloat(fil[0].start)
      end = parseFloat(fil[0].dur)
      fil[0].Timestamp = `${convert(init)}-${convert(init + end)}`
      await res.send(fil[0])
      // console.log(captions)
    });  
  } catch (e) {
    res.send('Error, posiblemente no esta bien el codigo o la frase a buscar')
  }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))