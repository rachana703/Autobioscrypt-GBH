var http = require('http');
var express = require('express');   //taking module express from node_modules
var bodyParser = require("body-parser");
var app = express();  //var app as object
var path = require('path');
var mysql = require('mysql');
var Web3 = require('web3');
var solc = require('solc');
var sha1 = require('sha1');
var util = require('util');


const driver = require('bigchaindb-driver')
// BigchainDB server instance (e.g. https://test.bigchaindb.com/api/v1/)
//const API_PATH = 'http://localhost:9984/api/v1/'

// Create a new keypair.
const alice = new driver.Ed25519Keypair()
let conn = new driver.Connection('https://test.bigchaindb.com/api/v1/', { 
		    app_id: 'd800db54',
		    app_key: '144d530ba894e7a7c92999b180ea89b7'
		})



//var html= require('html');
var session = require('express-session');
app.use(session({secret: 'ssshhhhh'}));
var username;
var userid;
var bookid;
var chapterid;
var Autobio;

app.set('view engine', 'ejs');

app.use('/views', express.static(__dirname + '/views'));

app.use(express.static('/public'));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
	sess=req.session;
	sess.bookname;
	sess.genre;
  	res.sendfile("index.html");
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'autobioscrypt'
});




connection.connect();
app.set('port', 3000);

app.post('/login',function(req,res){

  username=req.body.username;
  var password=req.body.password;
  sess.username=username;
  


  
  //smart contract
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

  web3.eth.defaultAccount = web3.eth.accounts[0];

  var AutobioContract = web3.eth.contract(JSON.parse('[ { "constant": false, "inputs": [ { "name": "_content", "type": "string" }, { "name": "_userid", "type": "string" } ], "name": "setInstructor", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getInstructor", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" } ]'));

  Autobio = AutobioContract.at('0x6fd5c9f66f4e2a35adc41369fd8a8a2a0e714f55');

  


 //database 
  
  console.log("From html page\n username = "+username+"\n pass:"+password);
  console.log(sess.username);

  //connection.query('INSERT INTO messages (message) VALUES (?)',message);

  connection.query('SELECT * FROM user_detail where username=?',[username],
   function(err, results,fields){
    if(err){
    	console.log(err);

    	res.send({
	      "code":400,
	      "failed":"error ocurred"
	    })
    }
    else
    {
    	 if(results.length >0){
	      if(results[0].password == password){
	       /* res.send({
	          "code":200,
	          "success":"login sucessfull"
	            });*/
	            userid=results[0].id;
	            sess.userid=userid;
	            connection.query('SELECT COUNT(userid) AS id_count FROM book_details where userid=?',[userid],
		            function(error,results,fields){
	  				if (error) {
	  					
					    console.log("error ocurred",error);
					    res.send({
					      "code":400,
					      "failed":"error ocurred"
					    })
	  				}
	  				else{
	  					var count_id=results[0].id_count;
	  					if(count_id>0)
	  					{
	  						
	  						connection.query('SELECT bookname FROM book_details where userid=?',[userid],
		            			function(error,results,fields){
		            				console.log(results);
		            			});
	  							res.sendfile("book_details2.html");
	  					}
	  					else
	  					{
	  						
	  						res.sendfile("book_details.html");
	  					}

	  					
	  				}
  				});



	     


	            
	      }
	      else{
	        res.sendfile("index2.html");
	      }
	  }
	  else{
	      /*res.send({
	        "code":204,
	        "success":"Username or password does not match"
	          });*/

	          res.sendfile("index2.html");
	    }
    }

    //res.render('messages', {messages : recordset});
    //res.send(results);

  });
});


app.post('/loginagain',function(req,res){

  username=req.body.username;
  var password=req.body.password;
  sess.username=username;
 

  


 //database 
  
  console.log("From html page\n username = "+username+"\n pass:"+password);
  console.log(sess.username);

  //connection.query('INSERT INTO messages (message) VALUES (?)',message);

  connection.query('SELECT * FROM user_detail where username=?',[username],
   function(err, results,fields){
    if(err){
    	console.log(err);

    	res.send({
	      "code":400,
	      "failed":"error ocurred"
	    })
    }
    else
    {
    	 if(results.length >0){
	      if(results[0].password == password){
	       /* res.send({
	          "code":200,
	          "success":"login sucessfull"
	            });*/
	            userid=results[0].id;
	            sess.userid=userid;
	            connection.query('SELECT COUNT(userid) AS id_count FROM book_details where userid=?',[userid],
		            function(error,results,fields){
	  				if (error) {
	  					
					    console.log("error ocurred",error);
					    res.send({
					      "code":400,
					      "failed":"error ocurred"
					    })
	  				}
	  				else{
	  					var count_id=results[0].id_count;
	  					if(count_id>0)
	  					{
	  						
	  						connection.query('SELECT bookname FROM book_details where userid=?',[userid],
		            			function(error,results,fields){
		            				console.log(results);
		            			});
	  							res.sendfile("book_details2.html");
	  					}
	  					else
	  					{
	  						
	  						res.sendfile("book_details.html");
	  					}

	  					
	  				}
  				});



	     


	            
	      }
	      else{
	        res.sendfile("index2.html");
	      }
	  }
	  else{
	      /*res.send({
	        "code":204,
	        "success":"Username or password does not match"
	          });*/

	          res.sendfile("index2.html");
	    }
    }

    //res.render('messages', {messages : recordset});
    //res.send(results);

  });
});




app.post('/browse',function(req,res){
		connection.query('Select bookname,bookid from book_details ',
  			function(error, results, fields) {
				  if (error) {
				    console.log("error ocurred",error);
				    res.send({
				      "code":400,
				      "failed":"error ocurred"
				    })
 				 }
 				 else
 				 {
 				 			var name = JSON.stringify(results);
					  		res.render(__dirname+'/views/browse',{bname:name});

 				 }

 			});


});

app.get('/browse',function(req,res){
		connection.query('Select bookname,bookid from book_details ',
  			function(error, results, fields) {
				  if (error) {
				    console.log("error ocurred",error);
				    res.send({
				      "code":400,
				      "failed":"error ocurred"
				    })
 				 }
 				 else
 				 {
 				 			var name = JSON.stringify(results);
					  		res.render(__dirname+'/views/browse',{bname:name});

 				 }

 			});


});

app.post('/continue_browsing',function(req,res){
	 bookid=req.body.bookid;
	 connection.query('SELECT chaptername,chapterid FROM chapter_details where bookid=?',[bookid],
		   function(err, results,fields){
		    if(err){
		    	console.log(err);

		    	res.send({
			      "code":400,
			      "failed":"error ocurred"
			    })
		    }
		    else{

		    		

		    				console.log(results);
					   		var chapter_name = JSON.stringify(results);
					  		res.render(__dirname+'/views/continue_browsing_chp',{chpname:chapter_name});
		    			

		    		


		    }


		});


});

app.post('/continue_browsing_page',function(req,res){
	
		chapterid=req.body.chapterid;
		connection.query('SELECT page_no,pageid FROM page_details where chapterid=?',[chapterid],
		   function(err, results,fields){
		    if(err){
		    	console.log(err);

		    	res.send({
			      "code":400,
			      "failed":"error ocurred"
			    })
		    }
		    else{

		    		

		    				console.log(results);
					   		var page_name = JSON.stringify(results);
					  		res.render(__dirname+'/views/continue_browsing_page',{pagename:page_name});
		    			

		    		


		    }


		});





});

app.post('/page_show',function(req,res){
	
	pageid=req.body.pageid;
	connection.query('SELECT pagecontent,pageid FROM page_details where pageid=?',[pageid],
		   function(err, results,fields){
		    if(err){
		    	console.log(err);

		    	res.send({
			      "code":400,
			      "failed":"error ocurred"
			    })
		    }
		    else{

		    		

		    				console.log(results);
					   		var page_content = JSON.stringify(results);
					  		res.render(__dirname+'/views/content_display',{pagename:page_content});
		    			

		    		


		    }


		});






});


app.post('/link_to_book_details',function(req,res){
	res.sendfile("book_details.html");
});

app.get('/link_to_book_details',function(req,res){
	res.sendfile("book_details.html");
});

app.post('/book_details',function(req,res){

	  	var bookname=req.body.bookname;
  		var genre=req.body.genre;
  		//database
  		sess.bookname=bookname;
  		sess.genre=genre;
	
  
  		//console.log("bookname = "+bookname+"\n genre:"+genre);

  		//bigchaindb

  		// Construct a transaction payload
		const tx = driver.Transaction.makeCreateTransaction(
		    // Define the asset to store, in this example it is the current temperature
		    // (in Celsius) for the city of Berlin.
		    { userid: userid, bookname: bookname, genre: genre},

		    // Metadata contains information about the transaction itself
		    // (can be `null` if not needed)
		    { what: 'My first BigchainDB transaction' },

		    // A transaction needs an output
		    [ driver.Transaction.makeOutput(
		            driver.Transaction.makeEd25519Condition(alice.publicKey))
		    ],
		    alice.publicKey
		)

		// Sign the transaction with private keys
		const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
		console.log(txSigned);
		// Send the transaction off to BigchainDB
		//const conn = new driver.Connection(API_PATH)
		


		conn.postTransactionCommit(txSigned)
		    .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))





  		connection.query('INSERT INTO book_details (userid,bookname,genre) VALUES (?,?,?)',[userid,bookname,genre],
  			function(error, results, fields) {
				  if (error) {
				    console.log("error ocurred",error);
				    res.send({
				      "code":400,
				      "failed":"error ocurred"
				    })
 				 }
				  else{
				    //console.log('The solution is: ', results);
				    connection.query('SELECT * FROM book_details where bookname=?',[bookname],
   					function(err, results,fields){
						 if(err){
						    	console.log(err);

						    	res.send({
							      "code":400,
							      "failed":"error ocurred"
							    })
						    }
						    else
						    {
						    	 if(results.length >0){
							      bookid=results[0].bookid;
							      //console.log("Bookid="+bookid);
							      //you need to convert your res to json
							      //return json to ui 
							      res.sendfile("chapter_details.html");
								  }
								  else{
								      res.send({
								        "code":204,
								        "success":"Bookname does not exits"
								          });
								    }
						    }
	

						  });

				  	}
 		 	});



});


app.post('/book_details2',function(req,res){


		connection.query('SELECT bookname,bookid FROM book_details where userid=?',[userid],
   					function(err, results,fields){
   					if(err){
						console.log(err);

						    	res.send({
							      "code":400,
							      "failed":"error ocurred"
							    })
   					}else{
   							console.log(results);
   							

					   		var name = JSON.stringify(results);
					   		
					  		//res.render(__dirname + "/main.html", {name:name});
					  		res.render(__dirname+'/views/main',{bname:name});
   					}


					




   		});


});




app.post('/continue_book_chapter_dets',function(req,res){

		
		bookid=req.body.bookid;
	  	console.log(bookid);
	  	 connection.query('SELECT chaptername,chapterid FROM chapter_details where bookid=?',[bookid],
		   function(err, results,fields){
		    if(err){
		    	console.log(err);

		    	res.send({
			      "code":400,
			      "failed":"error ocurred"
			    })
		    }
		    else{

		    		

		    				console.log(results);
					   		var chapter_name = JSON.stringify(results);
					  		res.render(__dirname+'/views/continue_chapter',{chpname:chapter_name});
		    			

		    		


		    }


		});

});



app.post('/continue_chapter',function(req,res){

		var chapterid=req.body.chapterid;




});

app.post('/link_to_chapterdetailshtml',function(req,res){
	res.sendfile("chapter_details.html");
});




app.post('/chapter_details',function(req,res){

	  	var chaptername=req.body.chaptername;
	  	var count=0;
  		
  		console.log(bookid);
  		//database 
  
  		//console.log("chaptername = "+chaptername);
  		connection.query('SELECT COUNT(bookid) AS total FROM chapter_details where bookid=?',[bookid],
  			function(error,results,fields){
  				if (error) {
  					console.log("hey");
				    console.log("error ocurred",error);
				    res.send({
				      "code":400,
				      "failed":"error ocurred"
				    })


  				}
  				else{

  					count=results[0].total+1;
			  		
					const tx = driver.Transaction.makeCreateTransaction(
					   
					    { userid: userid, bookid: bookid, chaptername: chaptername,chapter_no:count},

					    
					    { what: 'Chapter details transaction' },

					  
					    [ driver.Transaction.makeOutput(
					            driver.Transaction.makeEd25519Condition(alice.publicKey))
					    ],
					    alice.publicKey
					)

					
					const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
					console.log(txSigned);
					


					conn.postTransactionCommit(txSigned)
					    .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))


  					
  					
  					//chapter_no2=chapter_no;
  					//console.log(count);
  					connection.query('INSERT INTO chapter_details (bookid,chaptername,chapter_no) VALUES (?,?,?)',[bookid,chaptername,count],
  					function(error, results, fields) {
				 		 if (error) {
						    console.log("error ocurred",error);
						    res.send({
						      "code":400,
						      "failed":"error ocurred"
						    })
 						 }
				  		else{
						    console.log('The solution is: ', results);
						    connection.query('SELECT * FROM chapter_details where chaptername=?',[chaptername],
		   					function(err, results,fields){
								 if(err){
								    	console.log(err);

								    	res.send({
									      "code":400,
									      "failed":"error ocurred"
									    })
								    }
								    else
								    {
								    	 if(results.length >0){
										      chapterid=results[0].chapterid;
										      console.log("Chapterid="+chapterid);
										      res.sendfile("page_details.html");
										  }
										  else{
										      res.send({
										        "code":204,
										        "success":"Chaptername does not exits"
										          });
										    }
								    }
	

						  		});

				  			}
 		 				});
  					
  				}


  			});
		console.log(count);

});

app.post('/page_details',function(req,res){

	  	var content=req.body.content;
  		var count=0;
  		//database 
  
  		console.log("content = "+content);

  		connection.query('SELECT COUNT(chapterid) AS total FROM page_details where chapterid=?',[chapterid],
  			function(error,results,fields){
  				if (error) {
				    console.log("error ocurred",error);
				    res.send({
				      "code":400,
				      "failed":"error ocurred"
				    })


  				}
  				else{

  					
  					count=results[0].total+1;
  					//chapter_no2=chapter_no;
  					//console.log(count);


  						const tx = driver.Transaction.makeCreateTransaction(					   
					    { userid: userid, bookid: bookid, chapterid:chapterid ,pagecontent : content ,page_no:count},

					    
					    { what: 'Page details transaction' },

					  
					    [ driver.Transaction.makeOutput(
					            driver.Transaction.makeEd25519Condition(alice.publicKey))
					    ],
					    alice.publicKey
					)

					
					const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
					console.log(txSigned);
					


					conn.postTransactionCommit(txSigned)
					    .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))








  					connection.query('INSERT INTO page_details (chapterid,pagecontent,page_no) VALUES (?,?,?)',[chapterid,content,count],
  					function(error, results, fields) {
				 		 if (error) {
						    console.log("error ocurred",error);
						    res.send({
						      "code":400,
						      "failed":"error ocurred"
						    })
 						 }
				  		else{
						    console.log('The solution is: ', results);
						    	//var hash = sha1(content);
    							Autobio.setInstructor(userid,content);
						     	
												Autobio.getInstructor(function(error, result){
													if(!error)
													{
														     console.log("from smart contract="+result);
														     console.log(content);
													}
													else
														     console.error(error);
												});

						   /* connection.query('SELECT * FROM page_details where pagecontent=?',[content],
		   					function(err, results,fields){
								 if(err){
								    	console.log(err);

								    	res.send({
									      "code":400,
									      "failed":"error ocurred"
									    })
								    }
								    else
								    {
								    	 if(results.length >0){
										      	Autobio.setInstructor(userid,content);

												Autobio.getInstructor(function(error, result){
													if(!error)
													{
														     console.log("from smart contract="+result);
													}
													else
														     console.error(error);
												});
											}
										  else{
										      res.send({
										        "code":204,
										        "success":"Chaptername does not exits"
										          });
										    }
								    }
	

						  		});*/

				  			}
 		 				});
  					
  				}


  			});


	});

app.get('/logout',function(req,res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});













