const express = require('express')
const axios = require('axios')
require('dotenv').config()

const app = express()
const port = 3000
const apiKey = process.env.YOUTUBE_API_KEY

app.use(express.static('public'))

app.get('/api/videos', async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'snippet,statistics,contentDetails',
          chart: 'mostPopular',
          regionCode: 'BR',
          maxResults: 11,
          key: apiKey,
        },
      }
    )
    res.json(response.data)
  } catch (error) {
    res.status(500).send('Erro ao buscar vídeos do YouTube')
  }
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
