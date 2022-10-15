const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { response } = require('express');
const PORT = 8000;
const MongoClient = require("mongodb").MongoClient;
const connectionString = "mongodb+srv://luisbetancourt:Wygns_3LEERxRXPZ-roF@cluster0.bi7pbo4.mongodb.net/?retryWrites=true&w=majority"

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
      console.log('Connected to Database')
      const db = client.db('star-wars-quotes')
      const quotesCollection = db.collection('quotes')
      app.set('view engine', 'ejs')
      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(express.static('public'))
      app.use(bodyParser.json())

      // Getting Info from DataBase and print it out to index.ejs
      app.get('/', (request, response) => {
        quotesCollection.find().toArray()
          .then(results => {
            console.log(results)
            response.render('index.ejs', {quotes: results})
          })
          .catch(error => console.error(error))
        
      })

      // Posting from Form
      app.post("/quotes",(request, response) => {
        quotesCollection.insertOne(request.body)
        .then(result => {
          response.redirect('/');
        })
        .catch(error => console.error(error))
      
      })

      app.put('/quotes', (request, response) => {
        quotesCollection.findOneAndUpdate(
          {name: 'Yoda'},
          {
            $set: {
              name: request.body.name,
              quote: request.body.quote
            }
          },
          {
            upsert: true
          }
        )
        .then(result => {
          console.log(result)
          response.json('Success')
        })
        .catch(error => console.error(error))
        
      })

      app.delete('/quotes', (request, response) => {
       quotesCollection.deleteOne(
        {name: request.body.name}
       )

       .then(result => {
        if (result.deletedCount === 0){
          return response.json('No quote to delete')
        }
        response.json(`Deleted Darth Vader's quote`)
      })
      .catch(error => console.error(error))
      })


      // Local Host Port
      app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}, better go catch it!`);
})
   })
  .catch(error => console.error(error))


