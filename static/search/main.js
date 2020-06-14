function setup() {
  loadJSON("all", getData);

  var button = select("#submit");
  button.mousePressed(query);
}

function query() {
  var search = select("#search").value();
  console.log(search);
}

function getData(data) {
  console.log(data);
}
