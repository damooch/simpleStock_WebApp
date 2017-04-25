window.onload = () => {

    //used for moneymanagement graph///////////////////////////////////////////////////////////////////////
    
    var dict = stockdict;
    
    var startingReserveFunds = 0;
    for(var i=0; i < dict.length-1; i++)
    {
            startingReserveFunds += dict[i]['y'];
 
    }
    startingReserveFunds = 100-startingReserveFunds;
    dict[dict.length-1]['y'] = startingReserveFunds;

    dict[dict.length-1]['sliced']='true';
    dict[dict.length-1]['selected']='true';

    //defining a function
    function makeChartMoney(mydict){
        Highcharts.chart('container', {
        chart: {
            plotBackgroundColor: '#8cd9b3',
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: '#ffffff',
            type: 'pie',
            margin: [0, 0, 0, 0],
            spacingTop: 20,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0
        },
        title: {
            text: 'Percentages of Money Placed In Stocks'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: false, //true
                slicedOffset: 50,
                size:'70%',
                cursor: 'pointer',
                dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                //colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#FFF263', '#FFF263', '#FFF263', '#6AF9C4']
            }
        
                },
                
                showInLegend: true,

                point:
                {
                    events : 
                    {
                        legendItemClick: function(e)
                        {
                            e.preventDefault();
                        }
                    }
                }
            },
            
                
            
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: mydict
            }]
        });


    }
    Highcharts.setOptions({
        colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#000000", 
        "#800000", "#008000", "#000080", "#808000", "#800080", "#008080", "#808080", 
        "#C00000", "#00C000", "#0000C0", "#C0C000", "#C000C0", "#00C0C0", "#C0C0C0", 
        "#400000", "#004000", "#000040", "#404000", "#400040", "#004040", "#404040", 
        "#200000", "#002000", "#000020", "#202000", "#200020", "#002020", "#202020", 
        "#600000", "#006000", "#000060", "#606000", "#600060", "#006060", "#606060", 
        "#A00000", "#00A000", "#0000A0", "#A0A000", "#A000A0", "#00A0A0", "#A0A0A0", 
        "#E00000", "#00E000", "#0000E0", "#E0E000", "#E000E0", "#00E0E0", "#E0E0E0"]
        //colors: ['#009973', '#ff0000', '#0000e6', '#cccc00', '#9900cc', '#00e6e6', '#3d5c5c', '#4d2600', '#ffff00', '#ff00aa', '#ff8000']
    });

    makeChartMoney(dict);


    /////////////////////////////////////////////////////////////////////////////////////////////////
    $(function () {
        //var dict = stockDict;
        var value = 0;
    });

    var instaData = [{ y: 43934, indexChange: '+1.5' }, { y: 52503, indexChange: '-1.2' }, 57177, 69658, 97031, 119931, 137133, 154175];
    var cDate = [];

    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    function makeChartContainers() {
        var stockList = document.getElementById("stockCharts");
        stockCharts.innerHTML += finalHtml;

        // ******** QUERY YAHOO FINANCE HISTORICAL DATA *****************
        for (var key in histDict) {
            var symbol = "";
            var highs = [];
            var lows = [];
            var opens = [];
            var closes = [];
            var volumes = [];
            var adjCloses = [];
            var dates = [];
            //console.log("\nkey: " + key + "\n");
            var x = 0;
            for (var i = 0; i < histDict[key].length; i++) {
                //console.log(" values:");
                symbol = histDict[key][i].symbol;
                opens.push(histDict[key][i].open);
                highs.push(histDict[key][i].high);
                lows.push(histDict[key][i].low);
                closes.push(histDict[key][i].close);
                volumes.push(histDict[key][i].volume);
                adjCloses.push(histDict[key][i].adjClose);
                var date = histDict[key][i].date + "";
                //console.log("Raw Date: " +date);
                date = date.substring(5, 7) + "/" + date.substring(8, 10) + "/" + date.substring(2, 4);
                //console.log("Formatted Date: " +date);
                dates.push(date);
            }
            // console.log("\nOpens: " + opens);
            // console.log("Highs: " + highs);
            // console.log("Lows: " + lows);
            // console.log("Closes: " + closes);
            // console.log("Volumes: " + volumes);
            // console.log("adjCloses: " + adjCloses);
            // console.log("dates: " + dates);
            makeChart(symbol, opens, highs, lows, closes, volumes, adjCloses, dates);
        }
    }

    makeChartContainers();


    function makeChart(symbol, opens, highs, lows, closes, volumes, adjCloses, dates) {
        var chart = Highcharts.chart(symbol, {
            title: {
                text: symbol
            },
            /*subtitle: {
                text: 'Source: thesolarfoundation.com'
            },
            */
            series: [{
                showInLegend: false,
                name: 'Dates',
                data: dates
            }, {
                name: 'Open',
                data: opens
            }, {
                name: 'High',
                data: highs
            }, {
                name: 'Low',
                data: lows
            }, {
                name: 'Close',
                data: closes
            }, {
                name: 'Volume',
                data: volumes
            }],
            yAxis: {
                title: {
                    text: 'Growth index'
                }
            },
            xAxis: {
                type: 'category',
                categories: dates,
                labels: {
                    enabled: true,
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            tooltip: {
                shared: false,
                crosshairs: true,
                formatter: function () {
                    var value = this.x;
                    value += "<br> " + this.y;

                    if (this.point.indexChange) {
                        value += " <br>Index Change:(" + this.point.indexChange + ")";
                    }

                    return value;
                }
            }
        });
        chart.series[0].hide();
        chart.series[5].hide();
    };

    // Displays modal error with timeout in it
    function modalDisplay() {
        var modal = document.getElementById('myModal');
        var delayMillis = 2000;
        //open the modal 
        modal.style.display = "block";
        setTimeout(function () { modal.style.display = "none"; }, delayMillis);
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    $(document).ready(function () {
        $("button").click(function () {
            let inputData = $("#formData").serializeArray();
            document.getElementById('error').innerHTML = "";

            if (inputData == null || inputData[0] == null) {
                document.getElementById('error').innerHTML = "Period Must Be Selected";
                modalDisplay();
            } else {
                //console.log("Input Data [0] : "+inputData[0].value);
                if (inputData[0].value != "d") {
                    // call JSON post function to dynamically update charts
                    $.post("/stock/queryData",
                        {
                            //symbols:
                            period: inputData[0].value
                            // dateTo: inputData[1].value,
                            // period: inputData[2].value
                        },
                        function (data, status) {
                            var chartData = data.chartData;
                            for (var key in chartData) {
                                var symbol = "";
                                var highs = [];
                                var lows = [];
                                var opens = [];
                                var closes = [];
                                var volumes = [];
                                var adjCloses = [];
                                var dates = [];
                                //console.log("\nkey: " + key + "\n");
                                for (var i = 0; i < chartData[key].length; i++) {
                                    symbol = chartData[key][i].symbol;
                                    opens.push(chartData[key][i].open);
                                    highs.push(chartData[key][i].high);
                                    lows.push(chartData[key][i].low);
                                    closes.push(chartData[key][i].close);
                                    volumes.push(chartData[key][i].volume);
                                    adjCloses.push(chartData[key][i].adjClose);
                                    var date = chartData[key][i].date + "";
                                    date = date.substring(5, 7) + "/" + date.substring(8, 10) + "/" + date.substring(2, 4);
                                    dates.push(date);
                                    //console.log("Date key @ index"+i+": "+date);
                                }
                                // console.log("\nOpens: " + opens);
                                // console.log("Highs: " + highs);
                                // console.log("Lows: " + lows);
                                // console.log("Closes: " + closes);
                                // console.log("Volumes: " + volumes);
                                // console.log("adjCloses: " + adjCloses);
                                // console.log("dates: " + dates);
                                makeChart(symbol, opens, highs, lows, closes, volumes, adjCloses, dates);
                            }
                        });
                }
                else {
                    for (var key in histDict) {
                        var symbol = "";
                        console.log("How many loops = " + key.length);
                        symbol = key;
                        console.log("On ticker : " + symbol + "\n");
                        var url = "https://chartapi.finance.yahoo.com/instrument/1.0/" + symbol + "/chartdata;type=quote;range=1d/json/"

                        getFile(url, "html")
                            .then(function (response, statusText, xhrObj) {
                                //console.log(response, statusText, xhrObj);
                                if (response.results.length == 1) {
                                    var rspnd = response.results[0];
                                    //console.log(rspnd);
                                    var filt = "{" + rspnd.match(/(?=\"series\")(.*?\n*)*(?=\} \))/igm) + "}";
                                    //console.log("Filtered:\n" + filt);
                                    var myArr = JSON.parse(filt);
                                    //console.log("My array:\n" + myArr);
                                    var filt2 = "{" + rspnd.match(/(?=\"ticker\")(.*?)(?=\,)/ig) + "}";
                                    //console.log("filt2: " + filt2);
                                    var tarray = JSON.parse(filt2);
                                    var ticker = "";
                                    for (val in tarray) {
                                        ticker = tarray[val].toUpperCase();
                                    }
                                    //console.log("Ticker: " +ticker);
                                    for (var key in myArr) {
                                        var highs = [];
                                        var lows = [];
                                        var opens = [];
                                        var closes = [];
                                        var volumes = [];
                                        var adjCloses = [];
                                        var dates = [];
                                        //console.log("\nkey: " + key + "\n");
                                        for (var i = 0; i < myArr[key].length; i++) {
                                            var unixTime = myArr[key][i].Timestamp;
                                            //console.log("Timestamp unix: "+unixTime);
                                            var date = new Date(unixTime * 1000);
                                            //console.log("unixtime: "+date);
                                            // Hours part from the timestamp
                                            var hours = date.getHours();
                                            // Minutes part from the timestamp
                                            var minutes = "0" + date.getMinutes();
                                            // Seconds part from the timestamp
                                            var seconds = "0" + date.getSeconds();
                                            // Will display time in 10:30:23 format
                                            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                                            console.log("Formatted time: " + formattedTime);
                                            dates.push(formattedTime);
                                            opens.push(myArr[key][i].open);
                                            highs.push(myArr[key][i].high);
                                            lows.push(myArr[key][i].low);
                                            closes.push(myArr[key][i].close);
                                            volumes.push(myArr[key][i].volume);
                                        }
                                        console.log("\n\n");
                                        // console.log("\nOpens: " + opens);
                                        // console.log("Highs: " + highs);
                                        // console.log("Lows: " + lows);
                                        // console.log("Closes: " + closes);
                                        // console.log("Volumes: " + volumes);
                                        // console.log("adjCloses: " + adjCloses);
                                        // console.log("dates: " + dates);
                                        makeChart(ticker, opens, highs, lows, closes, volumes, adjCloses, dates);
                                    }
                                }
                            })
                            .catch(function (xhrObj, textStatus, err) {
                                console.log("error", xhrObj, textStatus, err);
                            });
                    }
                }
            }
        });
    });

    function getFile(theURL, type, callback) {

        jQuery.ajax = (function (_ajax) {
            var protocol = location.protocol,
                hostname = location.hostname,
                exRegex = RegExp(protocol + '//' + hostname),
                YQL = 'http' + (/^https/.test(protocol) ? 's' : '') + '://query.yahooapis.com/v1/public/yql?callback=?',
                query = 'select * from html where url="{URL}" and xpath="*"';

            function isExternal(url) {
                return !exRegex.test(url) && /:\/\//.test(url);
            }

            return function (o) {
                var url = o.url;
                if (o.dataType == 'xml')   
                    query = 'select * from xml where url="{URL}"';	// XML
                if (/get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url)) {
                    // Manipulate options so that JSONP-x request is made to YQL
                    o.url = YQL;
                    o.dataType = 'json';
                    o.data = {
                        q: query.replace('{URL}', url + (o.data ? (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data) : '')),
                        format: 'xml'
                    };

                    // Since it's a JSONP request
                    // complete === success
                    if (!o.success && o.complete) {
                        o.success = o.complete;
                        delete o.complete;
                    }

                    o.success = (function (_success) {
                        return function (data) {
                            if (_success) {
                                // Fake XHR callback.
                                _success.call(this, {
                                    // YQL screws with <script>s, Get rid of them
                                    responseText: (data.results[0] || '').replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                                }, 'success');
                            }
                        };
                    })(o.success);
                }
                return _ajax.apply(this, arguments); // not special, use base Jquery ajax
            };
        })(jQuery.ajax);


        return $.ajax({
            url: theURL,
            type: 'GET',
            dataType: type,
            success: function (res) {
                // var text = res.responseText;
                // .. then you can manipulate your text as you wish
                callback ? callback(res) : undefined;
            }
        })
    };
};