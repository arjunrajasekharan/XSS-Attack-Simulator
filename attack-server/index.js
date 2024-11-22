var express = require("express");
var app = express();
var PORT = 3000;

app.get("/", function (request, response) {
  console.log(request.query.data);
  response.send("GET Request Called");
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
