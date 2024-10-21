const app = require("./app");

app.listen(9094, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("listening!");
  }
});
