const mysql2 = require("mysql2");
const express = require("express"); 

const app = express();

app.use(express.json());


const conn = mysql2.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "szerviz_db"
});


app.get("/", (req, res) => {
    res.send("Mükszik!");
});

app.get("/szolgaltatasok", (req, res) => {
    const query = "SELECT id, megnevezes, alapar, munkaido_perc, aktiv, kategoriak.nev AS 'kategoria_nev' FROM szolgaltatasok INNER JOIN kategoriak ON szolgaltatasok.kategoria_id = kategoriak.id ORDER BY alapar";

    conn.query(query, (err,result) => {
        if(err) res.status(500).send("Hiba a lekérdezés futtatása során: " + err);
        else res.status(200).send(result);
    });
});

app.get("/szolgalatatasok/elerheto", (req, res) => {
   const query = "SELECT id, kategoria_id, megnevezes, alapar, munkaido_perc, aktiv FROM szolgaltatasok WHERE aktiv AND munkaido_perc <= 60";
   
   conn.query(query, (err, result) => {
    if(err) res.status(500).send("Hiba a lekérdezés futtatása során: " + err);
    else res.status(200).send(result);
   });
   
});

app.get("/szolgaltatasok/kereses/:szoveg", (req, res) => {
    const query = "SELECT id, kategoria_id, megnevezes, alapar, munkaido_perc, aktiv FROM szolgaltatasok WHERE megnevezes LIKE '%?%'";
    const {szoveg} = req.params;
    console.log(szoveg);
    console.log(req.params);
   
        conn.execute(query, [szoveg], (err, results) => {
            if(err) res.status(500).send("Hiba a lekérdezés futtatása során: " + err);
            else res.status(200).send(results);
        });
   
    
});

app.get("/szolgaltatasok/statisztika", (req, res) => {
    const query = "SELECT * FROM kategoriak";

    conn.query(query, (err, result) => {
        if(err) res.status(500).send("Hiba a lekérdezés futtatása során: " + err);
        else res.status(200).send(results);
    });
});

app.get("/szolgaltatasok/dragak", (req, res) =>{
    const query = "SELECT * FROM kategoriak";

    conn.query(query, (err, result) => {
        if(err) res.status(500).send("Hiba a lekérdezés futtatása során: " + err);
        else res.status(200).send(results);
    });
})




app.get("/sql", (req, res) => {
    conn.query("SELECT * FROM kategoriak", (err, result) => {
        if(err) res.send(err);
        else res.send(result);
    })
    
});

app.listen(3000, () => {
    console.log("Szerver fut a 3000-es porton");
});