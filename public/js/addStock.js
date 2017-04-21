function init() {

    function checkInput() {

        var errors = [];
        var stock = document.getElementById("mySearch");
        var submitOk = true;

        if (stock.value.trim() === "") {
            submitOk = false;
            
            stock.style = "background-color:lightyellow";
            stock.placeholder = "Required";
            errors.push("No stock entered");
        }

        else if (!symbolExists(stock.value)) {
            submitOk = false;

            stock.value = "";
            stock.style = "background-color:lightyellow";
            stock.placeholder = "Please enter a valid stock";
            errors.push("Not a valid stock");
        }

        if (submitOk) {
            console.log(errors);
            addStock();
        }
        else {
            console.log(errors);
        }

    }

    function symbolExists(id){
        return (symbols[id] !== undefined);     
    }

    function modalDisplay(){
        var modal = document.getElementById('myModal');
        //var span = document.getElementsByClassName("close")[0];
        var delayMillis = 1000; //1 second
        
        //open the modal 
        modal.style.display = "block";
        setTimeout(function(){window.location = '../stock/addStock'}, delayMillis);    

        // // When the user clicks on <span> (x), close the modal
        // span.onclick = function() {
        //     modal.style.display = "none";
        // }

        // // When the user clicks anywhere outside of the modal, close it
        // window.onclick = function(event) {
        //     if (event.target == modal) {
        //         modal.style.display = "none";
        //     }
        // }
    }

    function addStock(event) {

        //var categoryInput = $('#category').val();
        //var questionInput = $('#question').val();
        //var answerInput = $('#answer').val();
        var stockInput = document.getElementById("mySearch").value.trim();

        var patchData = {
                name: stockInput,
            };

        console.log(patchData);

        $.ajax({
            url: '../stock/stocks',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(patchData),
            success: function(data, textStatus, jqXHR) {
                modalDisplay();
                console.log("created");
                //window.location = '../stock/addStock';
            },
            error: function(err) { //On Error will need to popup banner that there was an error.
                    document.getElementById("mySearch").value = "";
                    document.getElementById("mySearch").style = "background-color:lightyellow";
                    document.getElementById("mySearch").placeholder = "You already follow this stock";
            }
        });
    }

    $('#addStockFinal').on('click', checkInput);
}
$(document).on('ready', init);