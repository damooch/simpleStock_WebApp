// This file is executed in the browser, when people visit /stock/<random id>

var express = require('express');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var router = express.Router();
var User = require('../models/user.js');
var yahooFinance = require('yahoo-finance');
var Highcharts = require('Highcharts');
var request = require('request');


var Highcharts = require('highcharts'); // Since 4.2.0

router.all('*', (req, res, next) => {
  //check if token exists
  var sess = req.session;
  //if no token redirect to login
  // TODO: check valid token before next()
  if (!sess.token) {
    res.redirect('/users/login');
  } else {
    //if yes call next      
    next();
  }
});


/****************** ADD STOCK ROUTER/CONTROLLER ***********************/


router.get('/addStock', function (req, res, next) {

  var sess = req.session;
  var decodedToken = jwt.verify(sess.token, 'secret');

  res.render('stock');
});
/*var yahooFinance = require('yahoo-finance');

yahooFinance.historical({
  symbol: 'AAPL',
  from: '2012-01-01',
  to: '2012-01-05',
  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
}, function (err, quotes) {
  //...
  console.log(quotes);
  var fs = require('fs');
  var readline = require('readline');

  res.render('stock', {quotesList: quotes});
});
});*/


/****************** STOCKS ROUTER/CONTROLLER ***********************/

router.post('/stocks', function (req, res, next) {

  var sess = req.session;
  var userId = sess.userId;
  var newStock = req.body.name;

  var sess = req.session;
  var decodedToken = jwt.verify(sess.token, 'secret');
  var myUser = decodedToken.username.replace(" ", "");

  var s = { name: newStock, y: 0 };
  User.findOne({
    username: myUser,
    stockPercentages: { $elemMatch: { name: newStock } }
  }).then(function (stock, err) {
    console.log(stock);
    if (stock === null) {
      console.log("Stock does not exist.  We can add stock now.")
      User.findOne({
        username: myUser,
      }, function (err, user) {
        if (err) next(err);//return res.status(500).json(err);//


        if (!user) {
        }
        else if (user) {
          var dict = user.stockPercentages;

          //used for adding an item to the beginning of the array
          user.stockPercentages.unshift({ name: newStock, y: 0 });// = dict.unshift({name: 'Microsoft Internet Explorer',y: 10});

          user.save(function (err, brady) {
            if (err) return console.error(err);
          });


        }
      }).then(function (stock) {
        console.log(stock);
        res.status(200).json(stock);
      })
        .catch(function (err) {
          console.log(err);
          return res.status(500).json(err);
        });
    }
    else {
      console.log("Stock already exists.")
      console.log(err);
      res.status(405).json(err);
    }
  })
    .catch(function (err) {
      console.log(err);
      return res.status(405).json(err);
    })


  /*
      User.findOneAndUpdate({_id: userId },{$push: { stockPercentages : s }},{upsert:true, safe:true})
          .then(function(stock) { 
              res.status(200).json(stock);
          })
          .catch(function(err){
              console.log(err);
              return res.status(500).json(err);
          })
          */
});


/*User.update({_id: userId },
        {$push: { stocks : s }}, function(err, stock) {
          if (err) {
              return res.status(500).json(err);
          } else {
              res.status(200).json(stock);
          }
}); */

//});   


/****************************    STOCK LIST ROUTER / CONTROLLER ********************8****/

router.get('/stocklist', function (req, res, next) {
  var sess = req.session;
  var decodedToken = jwt.verify(sess.token, 'secret');
  var name = decodedToken.username.replace(" ", "");      // THIS IS HOW WE HAVE TO GET THE USERNAME, NOTE: MUST USE THE REPLACE CASUE WHITESPACE
  User.findOne({
    username: name
  }, function (err, user) {
    if (err) next(err);

    if (!user) {
      res.render('error.jade', { error: "Didnt find the user" });
    } else {
      // start of html string to concatonate and pass as final html string
      var finalHtml = "<Table id='stocktable' class='stocktable'><tr><th class='stockLabel'>Stock Name</th><th class='stockLabel'>Ticker</th><th class='stockLabel'>Open Price</th><th class='stockLabel'>Current Price</th><th class='stockLabel'>Status</th><th class='stockLabel'></th></tr>"
      var tempHtml = "";
      var status = "";
      var math = 0;
      count = 0;
      var tick = "";
      // gets the users tickers and puts them in an array or if empty renders page
      var n = user.stockPercentages.length;
      var tickers = [];
      console.log("\nSize of sockPercentages: " + n);
      if (n < 2) {
        console.log("Rendering empty page\n");
        res.render('stocklist', { stockHtml: finalHtml, tick: tick });
      }
      else {
        user.stockPercentages.forEach(function (ticker) {
          if (ticker.name != 'UnAllocated Stocks') {
            tickers.push(ticker.name);
          }
        });
        console.log("\nFound tickers: " + tickers + "\n");
        // this is where the functions above actually start getting called, did it last so their vars are declared and instantiated
        yahooFunct(finalHtml, tempHtml, tickers, status, tick, math, count, n, res);
      }
      // function queries yahoo for financial data and appends to html variables to pass through the render and use on users page
      function yahooFunct(finalHtml, tempHtml, tickers, status, tick, math, count, n, res) {
        console.log("Tickers:" + tickers);
        console.log("Length Tickers: " + tickers.length);
        for (var i = 0; i < tickers.length; i++) {
          console.log("Current Ticker:" + tickers[i]);
          yahooFinance.snapshot({
            symbol: tickers[i],
            fields: ['s', 'n', 'o', 'l1']
          }, function (err, snapshot) {
            if (err) {
              console.log(err);
              next(err);
            }
            if (!snapshot) {
              // change it so renders error on page
              res.render('stocklist', { error: "Didnt find the users stock: " + ticker[i], stockHtml: finalHtml, tick: tick });
            }
            else {
              math = Number(snapshot.open) - Number(snapshot.lastTradePriceOnly);
              if (math > 0) {
                status = "DOWN";
              }
              else if (math == 0) {
                status = "NO CHANGE";
              }
              else {
                status = "UP";
              }

              tempHtml += "<tr class='stockListRow'>";
              tempHtml += "<td class='stockColumn'>" + snapshot.name + "</td><td class='stockColumn'>" + snapshot.symbol + "</td><td class='stockColumn'>$" + snapshot.open + "</td><td class='stockColumn'>$"
                + snapshot.lastTradePriceOnly + "</td><td class='stockColumn'>" + status + "</td><td class='stockColumn'><a href='#' id='" + snapshot.symbol + "' data-id='" + snapshot.symbol + "' name='removebtn' class='btn btn-red'>Remove</a></td>";
              tempHtml += "</tr>";
              console.log("\n" + tempHtml);
              count += 1;
              console.log("\nCount : " + count);
              // The query isnt syncing well so this is sort of a work around to wait to render the page
              // We may want a better solution
              if (count == tickers.length) {
                finishHtml(count, tempHtml, finalHtml, tick, res);
              }
            }
          });
        }
      }
      // made this function to delay rendering page because the query for financial data needs a promise, crude workaround
      function finishHtml(count, tempHtml, finalHtml, tick, res) {
        console.log("-- In finishHtml");
        console.log("Final Count : " + count + "\n");
        finalHtml += tempHtml;
        finalHtml += "</table>";

        res.render('stocklist', { stockHtml: finalHtml, tick: tick });
      }
    }
  });
});



router.post('/stocklist', function (req, res, next) {
  // Delete the selected ticker from watchlist in user
  // redirect to /stock/stocklist
  var sess = req.session;
  var decodedToken = jwt.verify(sess.token, 'secret');
  var name = decodedToken.username.replace(" ", "");      // THIS IS HOW WE HAVE TO GET THE USERNAME, NOTE: MUST USE THE REPLACE CASUE WHITESPACE
  console.log("\nI'm in stockview post");
  var ticker = "";
  ticker = JSON.parse(req.body.hiddenTicker).replace(" ", "").toUpperCase();
  User.findOne({
    username: name
  }, function (err, user) {
    if (err) next(err);
    if (!user) {
      res.render('error.jade', { error: "Didnt find the user" });
    } else {
      console.log("Ticker: " + ticker);
      console.log("\nIn stocklist post status = remove\n");
      User.findOneAndUpdate({ username: name }, { $pull: { stockPercentages: { name: ticker } } }, { upsert: true, safe: true })
        .then(function (stock) {
          res.redirect('stocklist');
          //res.status(200).json(stock);
        })
        .catch(function (err) {
          console.log(err);
          if (err) next(err);
          //return res.status(500).json(err);
        })
    }

  });
});


/****************** STOCK VIEW ROUTER/CONTROLLER ***********************/

router.get('/stockview', function (req, res, next) {
  console.log("\nIn stockview get");
  var sess = req.session;
  var decodedToken = jwt.verify(sess.token, 'secret');
  var name = decodedToken.username.replace(" ", "");      // THIS IS HOW WE HAVE TO GET THE USERNAME, NOTE: MUST USE THE REPLACE CASUE WHITESPACE
  User.findOne({
    username: name
  }, function (err, user) {
    if (err) next(err);

    if (!user) {
      res.render('error.jade', { error: "Didnt find the user" });
    } else {
      // start of html string to concatonate and pass as final html string
      var finalHtml = ""
      var tempHtml = "";
      count = 0;
      var tick = "";
      // default begin and end dates
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      var endDate = yyyy + '-' + mm + '-' + dd;
      // default is set to 6 month span
      mm = today.getMonth() + 1;
      if (mm > 6) {
        mm = mm - 6;
        if (mm < 10) {
          mm = '0' + mm;
        }
      } else if (mm < 6) {
        mm = 12 - (6 - mm);
        if (mm < 10) {
          mm = '0' + mm;
        }
        yyyy = yyyy - 1;
      }
      var beginDate = yyyy + '-' + mm + '-' + dd;
      console.log("\nBegin Date: " + beginDate);
      console.log("End Date: " + endDate);
      // gets the users tickers and puts them in an array or if empty renders page
      var n = user.stockPercentages.length;
      // build array of tickers
      var tickers = [];
      // array to contain each dictionary of yahoo historical data for each ticker
      var historicalDict = [];

      console.log("Size of sockPercentages: " + n);
      if (n < 2) {
        console.log("Rendering empty page\n");
        res.render('stockview', { stockHtml: finalHtml, histDict: historicalDict });
      }
      else {
        user.stockPercentages.forEach(function (ticker) {
          if (ticker.name != 'UnAllocated Stocks') {
            tickers.push(ticker.name);
          }
        });
        // this is where the functions above actually start getting called, did it last so their vars are declared and instantiated
        yahooFunct();
      }
      // function queries yahoo for financial data and appends to html variables to pass through the render and use on users page
      function yahooFunct() {
        console.log("\nTickers:" + tickers);
        console.log("Length Tickers: " + tickers.length);

        yahooFinance.historical({
          symbols: tickers,
          from: beginDate,
          to: endDate,
          period: 'w'   //default period is weekly
        }, function (err, quotes) {
          if (err) {
            console.log("\n" + err);
            next(err);
          }
          if (!quotes) {
            // change it so renders error on page
            res.render('error.pug', { error: "Didnt find the users stock: " + quotes.symbol });
          }
          else {
            historicalDict = quotes;

            // ******** HOW TO QUERY YAHOO FINANCE HISTORICAL DATA EXAMPLE *****************
            for (var key in historicalDict) {
              console.log("\nHistorical Dict Data " + count + ":\n" + "key: " + key + "\n");
              for (var i = 0; i < historicalDict[key].length; i++) {
                console.log(" values:");
                for (var val in historicalDict[key][i]) {
                  console.log("   " + val + ": " + historicalDict[key][i][val]);
                }
              }
              //******** HOW TO QUERY YAHOO FINANCE HISTORICAL DATA EXAMPLE *****************

              tempHtml += '<br/><div id="' + key + '" style="width:100%; height:400px; padding-top:1%; padding-bottom:1%"></div>';
              console.log("\n" + tempHtml);
              count += 1;
              console.log("\nCount : " + count);
              // The query isnt syncing well so this is sort of a work around to wait to render the page
              // We may want a better solution
              if (count == tickers.length) {
                finishHtml();
              }
            }
            // END OF FOR LOOP 
          }
        });
      }
      // made this function to delay rendering page because the query for financial data needs a promise, crude workaround
      function finishHtml() {
        console.log("-- In finishHtml");
        console.log("Final Count : " + count + "\n");
        finalHtml += tempHtml;
        res.render('stockview', { stockHtml: finalHtml, histDict: historicalDict });
      }
    }
  });
  //res.render('stockview');
});



/****************** MANAGE MONEY ROUTER/CONTROLLER ***********************/

router.get('/managemoney', function (req, res, next) {

  var sess = req.session;
  var decodedToken = jwt.verify(sess.token, 'secret');
  var myUser = decodedToken.username.replace(" ", "");

  /*
      var dict = [{
                      name: 'Microsoft Internet Explorer',
                      y: 10
                  }, {
                      name: 'Chrome',
                      y: 20,
                      //sliced: true,
                      //selected: true
                  }, {
                      name: 'Firefox',
                      y: 30
                  }, {
                      name: 'Safari',
                      y: 0
                  }, {
                      name: 'Opera',
                      y: 0
                  }, {
                      name: 'UnAllocated Stocks',
                      y: 40
                  }];
           */


  User.findOne({
    username: myUser
  }, function (err, user) {
    if (err) next(err);

    if (!user) {
    }
    else if (user) {
      dict = user.stockPercentages;

      /*
                //used for deleting a specific item from the array
                for (var i = 0; i<dict.length; i++)
                {
                  if (dict[i]['name'] == 'Microsoft Internet Explorer')
                  {
                    dict.splice(i, 1);
                  }
                }
                */

      //used for adding an item to the beginning of the array
      //dict.unshift({name: 'Microsoft Internet Explorer',y: 10});
      //dict.unshift({name: 'Walmart',y: 10});


      res.render('managemoney', { dict: dict });
    }
  });



  //res.render('managemoney', {dict:dict});



});


router.post('/managemoney', function (req, res, next) {

  var sess = req.session;
  var decodedToken = jwt.verify(sess.token, 'secret');
  var myUser = decodedToken.username.replace(" ", "");

  console.log("i'm in managemoney post");
  console.log(req.body.hiddenDict);

  var dict = JSON.parse(req.body.hiddenDict);

  console.log("here's my dict after parsed: " + dict);

  User.findOne(
    {
      username: myUser
    }, function (err, user) {
      if (err) next(err);
      if (user) {


        console.log("here's my dict after parsed: " + dict);

        user.stockPercentages = dict;


        console.log("here's my stock percentages before I save");
        console.log(user.stockPercentages);
        user.save(function (err, brady) {
          if (err) return console.error(err);
        });
      }
    });


  res.render('managemoney', { dict: dict });
});


/****************** STOCK VIEW AJAX POST ROUTER/CONTROLLER ***********************/

// stockview ajax post
router.post('/queryData', function (req, res) {
  request('http://localhost:3000/stock/stockview', function (error, resAjax, body) {
    console.log("\n In queryData");
    //console.log(error);
    //console.log(resAjax.statusCode);
    if (!error && resAjax.statusCode == 200) {

      let dateFrom = req.body.dateFrom;
      let dateTo = req.body.dateTo;
      let period = req.body.period;
      console.log("Date from: " + dateFrom);
      console.log("Date to: " + dateTo);
      var instaData = [];
      var tickers = [];
      var sess = req.session;
      var decodedToken = jwt.verify(sess.token, 'secret');
      var name = decodedToken.username.replace(" ", "");      // THIS IS HOW WE HAVE TO GET THE USERNAME, NOTE: MUST USE THE REPLACE CASUE WHITESPACE

      function querryData() {
        return new Promise(
          function (resolve, reject) {
            User.findOne({
              username: name
            }, function (err, user) {
              if (err) next(err);

              if (!user) {
                res.render('error.jade', { error: "Didnt find the user" });
              } else {
                var n = user.stockPercentages.length;
                console.log("Size of sockPercentages: " + n);
                user.stockPercentages.forEach(function (ticker) {
                  if (ticker.name != 'UnAllocated Stocks') {
                    tickers.push(ticker.name);
                  }
                });

                yahooFinance.historical({
                  symbols: tickers,
                  from: dateFrom,
                  to: dateTo,
                  period: period   //default period is weekly
                }, function (err, quotes) {
                  if (err) {
                    console.log("\n" + err);
                    next(err);
                    return reject(err);
                  }
                  if (quotes) {

                    console.log("quotes: \n"+quotes);

                  }
                  else {
                    // change it so renders error on page
                    res.render('error.pug', { error: "Didnt find the users stock: " + quotes.symbol });
                  }
                })
                .then(
                  function(quotes){
                    instaData = quotes;
                    resolve(instaData);
                  }
                )

              }
            });
          }
        )

      }

      querryData().then(
        function (instaData) {
          console.log("\nFinished with query returning now");
          res.json({ chartData: instaData });
        }).catch((err) => { throw err; });
    }
  });
});

module.exports = router;
