function setup() {
  noCanvas();

  var button = select("#submit");
  button.mousePressed(query);
}

function query() {
  var dbms = select("#dbms").value();
  console.log(dbms);

  loadJSON(dbms + "/all", getData);
}

function getData(json) {
  var tweets = select("#tweets");
  console.log(json);

  for (var i = 0; i < json.length; i++) {
    var data = json[i];

    var li = createElement("li", data.tweet);
    li.parent("tweets");
  }
}
