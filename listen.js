const app = require("./app");

app.listen(9094, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("listening on 9094");
  }
});
