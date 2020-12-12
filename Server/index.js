const express = require('express');
const https = require('https');

const DataMortFr = require('./Data mort fr.json');

const server = express();
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    server.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//-- renvoie un JSON issu de wikidata avec la présence ou non de la propriété Pcode/Qcode et la valeur si c'est une date au callback
function requestDate(codeP, codeQ, callback) {
  let url = 'https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&props=&entity='
  url += codeQ
  url += '&property='
  url += codeP

  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      res.resume();
      return null;
    }

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('close', () => {
      let jsondata = JSON.parse(data);
      if (!(jsondata && jsondata.claims)) {
        return callback(null);
      }

      if (jsondata.claims[codeP]) {
        return callback({
          'value': true,
          'info': jsondata.claims[codeP][0].mainsnak.datavalue.value.time
        });
      } else {
        return callback({
          'value': false
        })
      }
    });
  });
}

//requete http entrante pour avoir une réponse (/reponse?topic=quelle question&value=quelcodeQ)
server.get('/reponseAPI', (req, res) => {
  if (req.query.topic && req.query.value) {
    if (req.query.topic == 'mort') {
      requestDate('P570', req.query.value, answer => {
        res.status(200).json(answer)
      });
    } else {
      res.status(403).send('mauvaise requête')
    }
  } else {
    res.status(403).send('mauvaise requête')
  }
});


server.get('/questionAPI', (req, res) => {
  if (req.query.topic) {
    if (req.query.topic == 'mort') {//P570
      res.json(DataMortFr[getRandomInt(0,DataMortFr.length)])
    } else {
      res.status(403).send('mauvaise requête')
    }
  } else {
    res.status(403).send('mauvaise requête')
  }
});

//ouverture du serveur
server.listen(3000, () => { });