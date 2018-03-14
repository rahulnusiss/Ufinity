var pg = require("pg")
exports.handle = function (event, context, callback) {
    //console.log("event.path: " + event.path);
    
    // For api gateway JSON.parse
    let body = JSON.parse(event.body);
    // let body = event.body;
    let teacher_id = body["teacher"];
    let student_id = body["students"];
    let teacher_split = teacher_id.split("@");
    
    student_id.forEach(function(value){
        
        var conn = {
            // host: process.env.DB_HOST,
            // port: process.env.DB_PORT,
            // database: process.env.DB_DATABASE,
            // user: process.env.DB_USER,
            // password: process.env.DB_PASSWORD,
    
            host: "ufinity2.cfmi80qyo1r7.ap-southeast-1.rds.amazonaws.com",
            port: "5432",
            database: "ufinity",
            user: "postgres",
            password: "postgresql",
        }
        // console.log("env: " + JSON.stringify(conn));
        let client = new pg.Client(conn)
        client.connect();
        // console.log("pg connected");
        
        var student_split = value.split("@");
        
        console.log("teacher id: " + teacher_id);
        console.log("teacher name: " + teacher_split[0]);
        console.log("student id: " + value);
        console.log("student name: " + student_split[0]);
        
        var q = {
            name: 'check',        
            text: 'SELECT * FROM class WHERE studentid=$1 AND teacherid=$2',
            values: [value, teacher_id]
        }
        client.query(q, function(err, res){
            if(err){
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                callback(null, {"statusCode": 500, "body": JSON.stringify(err, null, 2),"isBase64Encoded": false, "headers": {}});
                client.end()
                return 1
            }
        else{
            console.log("Error1: ",JSON.stringify(res, null, 2))
            if(res.rowCount != 0){
                console.log("Already Exits:", JSON.stringify(err, null, 2));
                callback(null, {"statusCode": 500, "body": JSON.stringify(["One or more relation Already Exist"], null, 2),"isBase64Encoded": false, "headers": {}});
                client.end()
                return;
            }
            // If the relation does not exist then only insert. We dont want duplicate relation
            client.end()
            let client2 = new pg.Client(conn)
            client2.connect();
            var query = {
            name: 'register',        
            text: 'INSERT INTO class(studentid, teacherid, studentname, teachername) VALUES($1, $2, $3, $4)',
            values: [value, teacher_id, student_split[0] , teacher_split[0]]
            }
            
            console.log("query.text:" + query.text);
            client2.query(query, function(err, res){
                if (err) {
                    console.error("Unable to insert item. Error JSON:", JSON.stringify(err, null, 2));
                    callback(null, {"statusCode": 504,"body": JSON.stringify(err, null, 2), "isBase64Encoded": false, "headers": {}})
                    client2.end()
                    return 1
                } else {
                    console.log("GetItem succeeded:", JSON.stringify(res, null, 2));
                    callback(null, {"statusCode": 200,"body": JSON.stringify(["Success"], null, 2), "isBase64Encoded": false, "headers": {}})
                    client2.end()
            }
            });
        }
        });
    //callback(null, {"statusCode": 200,"body": JSON.stringify({}, null, 2), "isBase64Encoded": false, "headers": {}})
    });
}