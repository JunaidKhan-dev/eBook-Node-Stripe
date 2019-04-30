const express = require("express");
const stripe = require("stripe")("sk_test_veNKLVHyiDWtsPK70UFnQA36");
const bodyparser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();
//handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//bodyparser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//static folder setup
app.use(express.static(`${__dirname}/public`));

//routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/charge", (req, res) => {
  const amount = 2500;
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer => {
      stripe.charges.create({
        amount: amount,
        description: "X Box Ebook",
        currency: "gbp",
        customer: customer.id
      });
    })
    .then(charge => {
      res.render("success");
    });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

/* 
  req.body  stripeToken: 'tok_1EV3SqD51smmJvHvXiB3lFDg',
  stripeTokenType: 'card',
  stripeEmail: 'test@demo.com'
*/
