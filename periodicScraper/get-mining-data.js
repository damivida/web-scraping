const express = require('express');
require('./db/mongoose');
const MiningProf = require('./models/mining-prof');

const app = express();
const port = process.env.PORT || 3000;

//convert incoming JSON into an JS object
app.use(express.json());


app.get('/mining-data/:pool/:coin', async(req, res) => {

    const pool = req.params.pool;
    const coin = req.params.coin;
    //coin = 'ETH';
   // const date = req.params.date;

    //const _id = req.params.id;

    //res.send({_id});

    try {
        const profCoin = await MiningProf.find({miningPoolName:pool, coinName:coin});
        res.send(profCoin)
      
        
           // res.send(profCoin);
    }catch(e) {
        res.status(500).send(e);
    } 

})


app.listen(port, () => {
    console.log('Server is on port ' + port);
});