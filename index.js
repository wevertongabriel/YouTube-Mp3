require('dotenv').config()

//importações
const express = require('express')
const bodyParser = require('body-parser')
const expressHandlebars = require('express-handlebars')
const path = require('path')
const fetch = require('node-fetch')

//definindo porta
const port = process.env.PORT || '3000'

//variaveis
const app = express()

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//template
app.set('view engine', 'ejs');

//arquivos estaticos
app.use(express.static("public"))

//rotas
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/convert', async (req, res) => {
  var url = req.body.videoLink
  const formClass = 'formClass'
  var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
  if(videoid != null) {
    videoid = videoid[1]
    var link_video = `https://www.youtube.com/embed/${videoid}`
    console.log(`o id e: ${videoid} o link e: ${link_video}`)
    const fetchAPI = await fetch(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${videoid}`,{
      "method":"GET",
      "headers":{
        "x-rapidapi-key":process.env.API_KEY,
        "x-rapidapi-host": process.env.API_HOST
      }
      })

      const fetchResponseApi = await fetchAPI.json()
      if(fetchResponseApi.status === "ok")
        return res.render("download", {success: true, classForm: formClass, video_link: link_video, song_title: fetchResponseApi.title, song_link: fetchResponseApi.link})
      else
        return res.render("index", {success: false, message: fetchResponseApi.msg})
  }else{
    return res.render("index", {success: false, message: 'Adicione um link valido'})
    }
})

//servidor
app.listen(port, () => {
    console.log(`site ligado na porta: ${port}`)
})