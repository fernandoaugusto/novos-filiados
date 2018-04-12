var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
const querystring = require('querystring');
var app = express();

var emailController  = require('./email');
require('./config');

app.get('/requests', async (req, res) => {

  url = 'https://novo.org.br/app/Solicitacoes';

  var cities = [];
  var emails = [];
  if (req.query.cities && req.query.emails) {
    cities = req.query.cities.split(',');
    emails = req.query.emails;
  } else {
    res.status(400).send('No parameters');
  }

  request(url, function(error, response, html) {
    var data;
    var members_raw = [];
    var members = [];
    if(!error) {
      var $ = cheerio.load(html);

      var name, city, elector_id;
      var json = [];

      $('#fbody').filter(function() {
        data = $(this).children().each(function(i, elem) {
          var content = $(this).contents().toString();
          if (!content.includes('<td></td>')) {
            members_raw[i] = $(this).contents().text().trim();
          }
        });
      })

      members_raw.forEach((member) => {
        var name_json = member.substring(0, member.search("\n"));
        var split1 = member.substring(member.search(name_json) + name_json.length, 1000).trim();
        var state_json = split1.substring(0, split1.search("\n"));
        var split2 = split1.substring(split1.search(state_json) + state_json.length, 1000).trim();
        var city_json = split2.substring(0, split2.search("\n")).trim();
        members.push({
            "name": name_json.trim(),
            "city": city_json.trim(),
            "state": state_json.trim()
        });
      });
    }

    var local_members = [];
    members.forEach((member) => {
      if (cities.includes(member.city)) {
        local_members.push(member);
      }
    });

    /*fs.writeFile('output_content.json', JSON.stringify(contents_raw), function(err){
      console.log('File successfully written! - Check your project directory for the output_content.json file');
    })*/

    try {
      emailController.sendEmail(local_members, emails);
      res.status(200).send(local_members);
    } catch(e) {
      console.log(e);
      res.status(400).send(e);
    }

  });
})

app.listen('8081')
console.log('Magic happens on port 8081');
module.exports = app;
