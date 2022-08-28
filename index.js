const db = require('./db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('./public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.post('/database_list', (req, res) => {
    var type = req.body.type, 
        start_date = req.body.start_date,
        end_date = req.body.end_date;

    var sql = 
        'select column_name from information_schema.columns ' +
        'where table_schema = \'public\' and table_name = \'' + type + '\'' +
        '   and column_name not in (\'index\',\'createdDate\',\'modifiedDate\',\'date\'); ';
    var col = "";
    
    db.query(sql, (err1, results1) => {
        if (err1) res.send(returnJson(false, err1.message, null));
        else {
            col += ',date d, to_char(date, \'dd/MM/yyyy\') date, '+
                'to_char("createdDate", \'dd/MM/yyyy HH24:MI:SS\') createdDate, to_char("modifiedDate", \'dd/MM/yyyy HH24:MI:SS\') modifiedDate';
            for (var i in results1.rows) {
                var row = results1.rows[i];
                col += ',"' + row["column_name"] + '"';
                // if (row["column_name"] == "date") 
                //     col += ',date d, to_char(date, \'dd/MM/yyyy\') date';
                // else col += ',"' + row["column_name"] + '"';
             }

            sql = 'select ' + col.substring(1) + ' from ' + type
                + ' where date >= to_date($1,\'yyyy-MM-dd\') and date <= to_date($2,\'yyyy-MM-dd\') order by d ';
            let value = [start_date, end_date];
            
            db.query(sql, value, (err2, results2) => {
                if (err2) res.send(returnJson(false, err2.message, null));
                else res.send(returnJson(true, 'load data success', results2.rows));
            });
        }
    });
});

app.post('/database_update', (req, res) => {
    var data = req.body.data;
    var date = req.body.date;
    let sql = '';

    (JSON.parse(data)).forEach(el => {
        var d = el.date.substr(6,4) + '-' + el.date.substr(3,2) + '-' + el.date.substr(0,2);
        var val = (el.value == '' ? null : '\''+el.value+'\'');
        var type = el.type;
        
        sql += 
            'update '+type+' set "'+el.f_name+'" = '+val+', "modifiedDate" = \''+date+'\' ' +
            'where date = \''+d+'\'; ';
    });
    
    db.query(sql, (err, results) => {
        if (err) res.send(returnJson(false, err.message, null));
        else res.send(returnJson(true, 'update success', results.rows));
    });
});

app.post('/documents_list', (req, res) => {

    sql = 'select * from documents';

    db.query(sql, (err, results) => {
        if (err) res.send(returnJson(false, err.message, null));
        else res.send(returnJson(true, 'load data success', results.rows));
    });
});

app.post('/documents_tes_list', (req, res) => {

    sql = 'select * from emk';

    db.query(sql, (err, results) => {
        if (err) res.send(returnJson(false, err.message, null));
        else res.send(returnJson(true, 'load data success', results.rows));
    });
});


function returnJson (status, message, payload) {
  return JSON.stringify({'status': status, 'message': message, 'payload': payload});
};
app.listen(8080, () => {
  console.log("Server is up and listening on 8080...")
});
