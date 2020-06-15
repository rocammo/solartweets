function setup() {
  noCanvas();

  var button = select("#submit");
  button.mousePressed(query);
}

function query() {
  var dbms = select("#dbms").value();
  var tweet = select("#tweet").value();
  var user = select("#user").value();

  var url = `/${dbms}/add/${tweet}`;
  url += user !== "" ? `/${user}` : "";

  loadJSON(url, getData);
}

function getData(json) {
  var responseStatus = json.status;

  var htmlStatus = responseStatus.includes("200")
    ? '<span style="color:green">Tweet successfully published!</span>'
    : '<span style="color:red">Something went bad :(</span>';

  select("#response_status").html(htmlStatus);
}
