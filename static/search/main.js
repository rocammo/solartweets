function setup() {
  noCanvas();

  var button = select("#submit");
  button.mousePressed(query);
}

function query() {
  var dbms = select("#dbms").value();
  var search = select("#search").value();
  var query = select("#query").value();

  var endpoints = {
    tweet: `/${dbms}/search/t/`,
    user: `/${dbms}/search/u/`,
  };

  loadJSON(endpoints[search] + query, getData);
}

function getData(json) {
  var tweets = select("#tweets").html("");

  for (var i = 0; i < json.length; i++) {
    var data = json[i];

    var li = createElement("li", data.tweet);
    li.parent("tweets");
  }
}
