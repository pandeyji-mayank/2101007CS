const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { v4: uuid } = require("uuid");
const { access } = require("fs");
dotenv.config();
app.use(express.json());

const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
const categories = [
  "Phone",
  "Computer",
  "TV",
  "Earphone",
  "Tablet",
  "Charger",
  "Mouse",
  "Keypad",
  "Bluetooth",
  "Pendrive",
  "Remote",
  "Speaker",
  "Headset",
  "Laptop",
  "PC",
];

const check = (expire) => {
  if (expires_in == "") return false;
  if (expire < Date.now()) {
    return true;
  }
};

var access_token = "";
var expires_in = "";
const getAuthToken = async () => {
  if (check(expires_in)) {
    return { access_token, expires_in };
  }
  const auth = await fetch("http://20.244.56.144/test/auth", {
    method: "POST",
    body: JSON.stringify({
      companyName: process.env.companyName,
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      ownerName: process.env.ownerName,
      ownerEmail: process.env.ownerEmail,
      rollNo: process.env.rollNo,
    }),
  });
  const data = await auth.json();
  expires_in = data.expires_in;
  return data;
};

const products = [
  {
    id: uuid(),
    productName: "Laptop 0",
    price: 0,
    rating: 1,
    discount: 0,
    availability: "yes",
  },
];

app.get("/categories/:categoryname/products", async (req, res) => {
  //   let { n } = req.query();
  let { categoryname } = req.params;
  //   if (!n) {
  //     n = 10;
  //   }
  if (!categories.includes(categoryname)) {
    {
      res.status(404).send("Category not found");
    }
  }
  const auth = await getAuthToken();
  console.log(auth);
  const data = await fetch(
    `http://20.244.56.144/test/companies/AMV/categories/${categoryname}/products?top=n&minPrice=1&maxPrice=10000`,
    {
      method: "GET",
      headers: {
        Authorization: Bearer `${auth.access_token}`,
      },
    }
  );
  let product = await data.json();
  console.log(data);
  if (product.length > 10) {
    res.json({ data, page: product.length });
  } else {
    res.json(data);
  }
});
app.get("/categories/:categoryname/products/:productid", (req, res) => {});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// http://20.244.56.144/test/companies/:companyname/categories/:categoryname/products?top=n&minPrice=p&maxPrice=q