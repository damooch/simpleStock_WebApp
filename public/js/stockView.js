window.onload = () => {
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
        setTimeout(function(){modal.style.display = "none";},delayMillis);
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

            if (inputData == null || inputData[2] == null) {
                document.getElementById('error').innerHTML = "Period Must Be Selected";
                modalDisplay();
            } else if (inputData[0].value == "" || inputData[1].value == "") {
                document.getElementById('error').innerHTML = "Beginning And End Date Must Be Selected";
                modalDisplay();
            } else {
                // call JSON post function to dynamically update charts
                $.post("/stock/queryData",
                    {
                        //symbols:
                        dateFrom: inputData[0].value,
                        dateTo: inputData[1].value,
                        period: inputData[2].value
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
                            var flag = 0;
                            console.log("\nkey: " + key + "\n");
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
        });
    });
};