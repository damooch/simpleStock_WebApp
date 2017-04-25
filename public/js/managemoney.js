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
