//import packages, lib, modules
const express = require("express");
const path = require("path");
const { check, validationResult } = require("express-validator");

//create an express applicaiton
var app = express();
const port = 5000;

//set up body pparser
app.use(express.urlencoded({ extended: false }));

//set up static folder (public)

app.use(express.static(path.join(__dirname, "public")));

//set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const prod1 = {
  name: "GR Corolla Shirt",
  cost: 25,
  amount: 0,
};

const prod2 = {
  name: "Oil Cooler",
  cost: 300,
  amount: 0,
};

const prod3 = {
  name: "Track Stickers",
  cost: 5,
  amount: 0,
};

const productList = [prod1, prod2, prod3];

let subTotal = prod1.amount + prod2.amount + prod3.amount;

//routes
app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/order", (req, res) => {
  res.render("pages/order", {
    prod1: prod1,
    prod2: prod2,
    prod3: prod3,
  });
});

app.get("/recipet", (req, res) => {
  res.render("pages/recipet");
});

app.post(
  "/order",
  [
    check("name", "Mandatory Field").not().isEmpty(),
    check("email", "Please Enter Valid Email").isEmail(),
    check("phone", "Mandatory Field")
      .not()
      .isEmpty()
      .matches(/\d{3}-\d{3}-\d{4}/)
      .withMessage("Required Format: 555-555-4444"),
    check("address", "Mandatory Field").not().isEmpty(),
    check("city", "Mandatory Field").not().isEmpty(),
    check("postal_code", "Mandatory Field").not().isEmpty(),
    check("province", "Mandatory Field").not().isEmpty(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    console.log(req.body);

    if (!errors.isEmpty()) {
      res.render("pages/order", {
        errors: errors.array(),
        prod1: prod1,
        prod2: prod2,
        prod3: prod3,
      });
    } else {
      let name = req.body.name;
      let phone = req.body.phone;
      let email = req.body.email;
      let address = req.body.address;
      let city = req.body.city;
      let pCode = req.body.postal_code;
      let province = req.body.province;

      prod1.amount = req.body.product1;
      prod2.amount = req.body.product2;
      prod3.amount = req.body.product3;

      console.log(productList);

      let fullAddress = `${address}, ${city}, ${province}, ${pCode}`;
      let taxRate = checkTax(province);
      let subTotal = financial(products(prod1, prod2, prod3));
      let total = financial(checkTotal(taxRate, subTotal));
      let taxTotal = financial(taxRate * subTotal);

      //display subtotal is less than 10$
      if (parseInt(subTotal) < 10) {
        console.log(subTotal);
        console.log("Subtotal is less that 10$");
      } else {
        res.render("pages/recipet", {
          name: name,
          email: email,
          phone: phone,
          address: fullAddress,
          taxRate: taxRate,
          subTotal: subTotal,
          productList: productList,
          total: total,
          taxTotal: taxTotal,
        });
      }
    }
  }
);

//func takes 3 products
//checks the value to see if product was selected
//if selected  value to corresponding product
// add to products to recipt
function products(prd1, prd2, prd3) {
  prd1Total = prd1.amount * prd1.cost;
  prd2Total = prd2.amount * prd2.cost;
  prd3Total = prd3.amount * prd3.cost;

  return prd1Total + prd2Total + prd3Total;
}

//func takes provice
//does math to the product total
//returns total
function checkTotal(taxRate, subTotal) {
  return (1 + taxRate) * subTotal;
}

//check province
//allocate corresponding tax rate
function checkTax(province) {
  let taxRate = 0;

  switch (province) {
    case "Alberta":
      taxRate = 0.05;
      break;
    case "British Columbia":
      taxRate = 0.12;
      break;
    case "Manitoba":
      taxRate = 0.12;
      break;
    case "New Brunswick":
      taxRate = 0.15;
      break;
    case "Newfoundland and Labrabor":
      taxRate = 0.15;
      break;
    case "Northwest Territories":
      taxRate = 0.05;
      break;
    case "Nova Scotia":
      taxRate = 0.15;
      break;
    case "Prince Edward Island":
      taxRate = 0.15;
      break;
    case "Nunavut":
      taxRate = 0.05;
      break;
    case "Ontario":
      taxRate = 0.13;
      break;
    case "Quebec":
      taxRate = 0.14975;
      break;
    case "Yukon":
      taxRate = 0.05;
      break;
    case "Saskatchewan":
      taxRate = 0.11;
      break;
  }
  return taxRate;
}

function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}

//run the applicaiton
app.listen(port, () => {
  console.log(
    `Connect to the application listening here: http://localhost:${port}/`
  );
});
