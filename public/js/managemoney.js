window.onload = () => {
    var form = document.getElementById("myForm");
    
    var dict = stockdict;
    
    //var value = 0;

    //used to find unused funds percentage on page load.
    var startingReserveFunds = 0;
    for(var i=0; i < dict.length-1; i++)
    {
            startingReserveFunds += dict[i]['y'];
 
    }
    startingReserveFunds = 100-startingReserveFunds;
    dict[dict.length-1]['y'] = startingReserveFunds;

    dict[dict.length-1]['sliced']='true';
    dict[dict.length-1]['selected']='true';

    $(function(){
        var value = 0;

        document.getElementById('sliders').innerHTML = "";
    
        for(var i=0; i < dict.length-1; i++){
            //$("#sliders").innerHTML($('div', { id: 'slider' + i, 'class' : 'ansbox'}))

            console.log("<div id = \"slider" + i + "\" >  </div>");


            document.getElementById('sliders').innerHTML += "<h1> "+dict[i]['name']+ "</h1><div id = \"" + i + "\", value = \"" + dict[i]['name'] + "\">  </div> </br>";

        }

        for(var i=0; i < dict.length-1; i++){

            var myslider = "#" + i;

            $(myslider).slider({
                value: dict[i]['y'],
                text: dict[i]['y'],
                
                change:function( event, ui) 
                {   
                    var myTotal = 0;
                    var value = $(this).slider( "option", "value" );
                    for(var i=0; i < dict.length-1; i++)
                    {
                        var myslider = "#" + i;

                        
                        if (dict[parseInt($(this).attr('id'))]['name'] != dict[i]['name'])
                        {
                            myTotal += dict[i]['y'];
                        }
                        else
                        {
                            myTotal += value;
                        }
                    }

                    console.log("myTotal is: " + myTotal);

                    if (myTotal <= 100)
                    {
                        dict[dict.length-1]['y'] = 100 - myTotal;

                        console.log(dict[dict.length-1]['name'] +" : " +dict[dict.length-1]['y']);
                        
                        dict[parseInt($(this).attr('id'))]['y'] = $(this).slider( "option", "value" ); 
                        console.log("Your value was: " + value);
                        makeChart(dict);
                        console.log(dict[parseInt($(this).attr('id'))]['name']);

                        
                        dict[parseInt($(this).attr('id'))]['y'] = $(this).slider( "option", "value" );

                        $(this).find(".ui-slider-handle").text(value);
                    } 
                    else
                    {

                        $(this).slider("option", "value", value- (myTotal-100));
                        modalDisplay();
                        console.log("You went over 100, chart will not be changed.");
                        console.log("You're total was: " + myTotal);
                    }
                    
                    
                },
                slide: function(event, ui) {
                    var value = $(this).slider("option","value");
                    
                    $(this).find(".ui-slider-handle").text(ui.value);
                },
            });

            $(myslider).find(".ui-slider-handle").text(dict[i]['y']);
        }
        

        //defining a function
        function makeChart(mydict){
            Highcharts.chart('container', {
            chart: {
                plotBackgroundColor: '#8cd9b3',
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor: '#ffffff',
                type: 'pie'
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
                    slicedOffset: 30,
                    cursor: 'pointer',
                    dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
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

        makeChart(dict);
    });

    function modalDisplay(){
        var modal = document.getElementById('myModal');
        //var span = document.getElementsByClassName("close")[0];
        var delayMillis = 3000; //1 second
        
        //open the modal 
        modal.style.display = "block";
        setTimeout(function(){modal.style.display = "none"}, delayMillis);    

    }
    

    form.addEventListener('submit', function(evt)
    {
        var myDict = JSON.stringify(dict);

        console.log('dict being passed: ', myDict);

        document.getElementById('hiddenDict').value = myDict;
    })
}
