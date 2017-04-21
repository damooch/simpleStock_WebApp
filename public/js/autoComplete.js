var input = document.getElementById("mySearch");

var symbolNames = [];
var symbols = {};

for (var key in nasdaq) {
    if (nasdaq.hasOwnProperty(key)) {
        symbols[key] = {};
    }
}

for (var key in nyse) {
    if (nyse.hasOwnProperty(key)) {
        symbols[key] = {};
    }
}

for (var key in symbols) {
    if (symbols.hasOwnProperty(key)) {
        symbolNames.push(key);
    }
}

var awesomplete = new Awesomplete(input, {
    list: symbolNames,
	//list: ["Ada", "Java", "JavaScript", "LOLCODE", "Node.js", "Ruby on Rails"],
    minChars: 1
});