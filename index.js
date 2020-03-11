'use strict'

const express = require('express')
const app = express()
const dotenv = require('dotenv')
const fetch = require('node-fetch')

dotenv.config()

const {
  PORT,
  SPF_CLIENT_ID,
  SPF_CLIENT_SECRET,
  SPF_AUTHORIZE_URL,
  SPF_API_TOKEN_URL,
} = process.env

const redirect_uri = `http://localhost:${PORT || 3500}/callback`

app.get('/callback', (req, res) => {
  const { code } = req.query
  const body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirect_uri)}`
  console.log(body)
  console.log(`Basic ${(new Buffer.from(`${SPF_CLIENT_ID}:${SPF_CLIENT_SECRET}`).toString('base64'))}`)

  return fetch(SPF_API_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${(new Buffer.from(`${SPF_CLIENT_ID}:${SPF_CLIENT_SECRET}`).toString('base64'))}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body
  })
  .then(res => res.json())
  .then(data => res.send(data))
  .catch(err => console.log(err))
})

app.use('/auth', (req, res) => {
  const scope = 'user-read-private%20user-read-email%20playlist-read-private%20playlist-read-collaborative%20user-modify-playback-state'
  const state = '2sd51sd2'

  return res.redirect(`${SPF_AUTHORIZE_URL}?client_id=${SPF_CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`)
})

app.listen(PORT || 3500, () => {
  console.log('api running...')
})