'use strict';

var async = require('async');
var fs = require('fs');
var request = require('request');
var _ = require('lodash');

var results;
var allResults = [];
var page = 0;

async.doWhilst(
  function (cbWhile) {
    request.get({
      url: 'https://www.producthunt.com/frontend/topics',
      qs: {
        page: ++page
      },
      json: true
    }, function (err, response, body) {
      console.log(`got page ${page}`);

      results = body.topics;
      allResults = allResults.concat(results);

      cbWhile(err);
    });
  },
  function () {
    return results && results.length > 0;
  },
  function (err) {
    if (err) {
      throw err;
    }

    allResults = _.sortBy(allResults, 'name');

    fs.writeFileSync(`./topics/${new Date().valueOf()}.json`,
      JSON.stringify(allResults, null, 2));
  });
