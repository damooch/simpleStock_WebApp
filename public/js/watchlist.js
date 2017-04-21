window.onload = () => {

    // var inputForm = document.getElementById("stockInput-form");
    var removeForm = document.getElementById("stockRemove-form");
    // var myFlag = JSON.stringify(sflag);
    var myTicker = JSON.stringify(tick);
    // document.getElementById("hiddenInStatus").value = myFlag;
    // document.getElementById("hiddenInTicker").value = myTicker;
    // document.getElementById("hiddenRemStatus").value = myFlag;
    document.getElementById("hiddenTicker").value = myTicker;

    // console.log('Initial Status: ', myFlag);
    console.log('Initial Ticker: ', myTicker);


    // inputForm.addEventListener('submit', function(evt)
    // {
    //     var theFlag = "input";
    //     myFlag = JSON.stringify(theFlag);
    //     var theTicker = document.getElementById("mySearch").value
    //     myTicker = JSON.stringify(theTicker);

    //     console.log('Status being passed: ', myFlag);
    //     document.getElementById('hiddenInStatus').value = myFlag;
    //     console.log(document.getElementById('hiddenInStatus').value);

    //     console.log('Ticker being passed: ', myTicker);        
    //     document.getElementById('hiddenInTicker').value = myTicker;
    //     console.log(document.getElementById('hiddenInTicker').value);

    //     location.reload();
    // })

    function removeStock() {
        // var theFlag = "remove";
        // myFlag = JSON.stringify(theFlag);
        var theTicker = $(this).attr("data-id");
        myTicker = JSON.stringify(theTicker);
        // console.log('Status being passed: ', myFlag);
        console.log('Ticker being passed: ', myTicker);

        // document.getElementById("hiddenRemStatus").value = myFlag;
        document.getElementById("hiddenTicker").value = myTicker;
        console.log('Ticker in document: ' + document.getElementById("hiddenTicker").value);
        removeForm.submit();
        return false;
        // .then(
        //     function(){
        //         return false;
        //     });
    }

    function displayWatchList(finalHtml) {
        var stockList = document.getElementById("stocklist");  //get div to insert html
        stockList.innerHTML += "<div style='padding-top:15px'>";
        stockList.innerHTML += finalHtml;  // add inner html
        stockList.innerHTML += "</div>";
        setEventListeners();   // add event listener to each button
    }

    function setEventListeners() {
        var classname = document.getElementsByClassName("btn btn-red");
        for (var i = 0; i < classname.length; i++) {
            classname[i].addEventListener('click', removeStock);
        }
        // sort the table
        var table = document.getElementById("stocktable");  // get table to sort
        sortTable(table, 0, false); // sort function sortTable(table, col, reverse=boolean) 
    }

    function sortTable(table, col, reverse) {
        var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
            tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
            i;
        reverse = -((+reverse) || -1);
        tr = tr.sort(function (a, b) { // sort rows
            if (a.cells[col].textContent.trim() != "Stock Name") {
                return reverse // `-1 *` if want opposite order
                    * (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
                        .localeCompare(b.cells[col].textContent.trim())
                    );
            }
        });
        for (i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
    }

    displayWatchList(finalHtml);    
}