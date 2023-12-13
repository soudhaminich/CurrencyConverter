const express = require('express');
const app = express();
const { Pool } = require('pg');
const PORT = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'npci',
    password: 'mini123',
    port: 5432,
  });

const rates = {
    'USD':{
        'USD' : 1,
        'EUR' : 0.92,
        'INR' : 82.16,
        
    },
    'EUR' : {
        'USD' : 1.09,
        'EUR' : 1,
        'INR' : 90.47
    },
    'INR' :{
        'USD' : 0.012,
        'EUR' : 0.011,
        'INR' : 1
    },
    'SKW' :{
        'USD' : 0.00076,
        'EUR' : 0.00070,
        'INR' : 0.063,
        'SKW' : 1
    }
};

app.use(express.static('frontend'));
app.use(express.json());

app.get('/convert', async (req, res) =>{
    const sourceCurrency = req.query.source;
    const targetCurrency = req.query.target;
    const amount = parseFloat(req.query.amount);

    if(!rates[sourceCurrency] || !rates[sourceCurrency][targetCurrency]){
        return res.status(400).json({error: 'Invalid currency combination' });
    }

    const convertedAmount = amount* rates[sourceCurrency][targetCurrency];

    try{
        await pool.query(`
                INSERT INTO currency_converter(source_currency, target_currency, source_amount, converted_amount)
                VALUES ($1, $2, $3, $4)
        `, [sourceCurrency, targetCurrency, amount, convertedAmount]);
    }catch(err){
        console.error("Error logging conversion", err);
    }

    res.json({ convertedAmount: convertedAmount.toFixed(2) });

});

app.get('/gethistory', async (req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM currency_converter ORDER BY id DESC LIMIT 20');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error: 'Failed to fetch history of currency conversion'});
    }
});


app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});




