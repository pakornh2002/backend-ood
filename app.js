const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const moment = require("moment");
// const Blob = require('blob');

const mysql = require("mysql");

const cors = require("cors");
const { request, response } = require("express");
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
app.use(bodyParser.json());

// Connect database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "webuythebuaydb",
});

app.get('/buycourse', function (req, res) {
    let stuid = req.query.id
    console.log(stuid);
    connection.query(
        "select b.OrderID, b.Total_price, b.Course_buyID, c.Course_name from course as c, buycourse as b where b.Student_buyID='" + stuid + "' and b.Course_buyID = c.CourseID and b.Buy_status = 'Waiting'",
        function (err, result) {
            if (err) {
                throw err;
            }else{
                let dataresult = []
                for(let i=0; i<result.length;i++){
                    let body = {
                        orderid:result[i].OrderID,
                        totalprice:result[i].Total_price,
                        courseid:result[i].Course_buyID,
                        coursename:result[i].Course_name,

                    }
                    dataresult.push(body)
                }
                res.send(dataresult)
                res.end()
            }
        },
    )
},)

app.post('/insertqr', function (req, res) {
    let image = req.body.image
    let orderid = req.body.orderid
    console.log(orderid);

    connection.query(
        "update buycourse set orderqr='"+image+"' where OrderID="+orderid,
        function (err) {
            if (err) {
                throw err;
            }else{
                let body = {
                    status: "success",
                }
                res.send(body)
                res.end()
            }
        },
    )
},)

//add the router
app.use("/", router);
app.listen(process.env.port || 3001);

console.log("Running at Port 3001");