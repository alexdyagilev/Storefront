
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "nosskyline",
  database: "Bamazon"
});

var prod = 0;
var quant = 0;

var promptForID = function() {
	
  inquirer.prompt([{
    name: "proctuct_ID",
    type: "input",
    message: "What is the ID of the item you're looking for?"
  }, {
    name: "quantity",
    type: "input",
    message: "How many units are you looking to buy?"
  }]).then(function(answer) {
    prod = answer.proctuct_ID;
    quant = answer.quantity;

 //    connection.connect(function (err) {
 //  // if (err) throw err;
 //  // console.log("connected as id " + connection.threadId);
	// });

    connection.query("SELECT * FROM products", {
      product_id: answer.proctuct_ID,
      quantity: answer.quantity
    }, function(err) {
      if (err) throw err;
      placeOrder(prod,quant);
    });
  });
};

var placeOrder = function(id,quantity) {
	var id = id-1;
	var q = quantity;
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    //console.log("chosen product id: " + id);
    //console.log("current stock of chosen item: " + results[id].stock_quantity);
    //console.log("chosen amount: " + q);
    if(results[id].stock_quantity >= q){
    	var cost = q * results[id].price;
    	var newQuant = results[id].stock_quantity - q;
    	id++;
    	console.log("--------------------------------------------------------------------------");
    	console.log("Order has been placed! " + newQuant + " remaining!");
    	console.log("--------------------------------------------------------------------------");
    	console.log("Total cost of order: $" + cost);
    	console.log("--------------------------------------------------------------------------");

    	connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [newQuant, id] , function(err, result) {});

    	connection.query(
  		'SELECT * FROM products',
  	function (err, res) {
    	if (err) {
      	throw err
    	}
    	console.log(res);
  		});
    	promptForID();

    }
    else{
    	console.log("--------------------------------------------------------------------------");
    	console.log("Sorry! Insufficient quantity!");
    	console.log("--------------------------------------------------------------------------");
    }
    
  });
};


var start = function(){
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});
connection.query(
  'SELECT * FROM products',
  function (err, res) {
    if (err) {
      throw err
    }
    console.log(res);
  });
promptForID();
}

start();


