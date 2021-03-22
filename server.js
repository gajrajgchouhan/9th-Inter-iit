const fs = require('fs');
const express = require('express')
const app = express();

const PORT = 8080;
const Dataset = JSON.parse(fs.readFileSync("./data/Dataset.json", 'utf8'));
let astro = [],
    not_astro = [];

for (let d of Dataset.objects) {
    if (d["Astrosat_obs"] == "Yes") {
        astro.push(d);
    } else {
        not_astro.push(d);
    }
}

app.get("/", (req, res) => {
    fs.readFile('index.html', 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/script.js', function(req, res) {
    fs.readFile("script.js", 'utf8', function(err, data) {
        res.end(data);
    });
});

//  apis
app.get('/dataset', function(req, res) {
    if (Object.keys(req.query).length !== 0 ) {
        console.log('received trace and index');
        let {trace, point} =  req.query;
        trace = parseInt(trace);
        point = parseInt(point);
        if (trace === 0)  {
            res.json(astro[point]);
        }
        else if (trace === 1) {
            res.json(not_astro[point]);
        }
        else {
            throw "Invalid trace";
        }
    }
    else {
        console.log(`sent all data`);
        res.json({"astro" : astro, "not_astro" : not_astro});
    }
});

app.get('/astrosat_publications', function(req, res) {
    fs.readFile("./data/Astrosat_Pubs.json", 'utf8', function(err, data) {
        res.end(data);
    });
});

app.get('/astrosat', function(req, res) {
    fs.readFile("./data/Astrosat.json", 'utf8', function(err, data) {
        res.end(data);
    });
});

app.listen(PORT, () => console.log(`App is live at http://127.0.0.1:${PORT}`));