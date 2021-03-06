var pg = require("pg")
exports.handle = function (event, context, callback) {
    // console.log("event.path: " + event.path);
    
    // let body = JSON.parse(event.body);
    // for invocation from another lambda
    let body = event;
    let student_id = body["student"];

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
    console.log("env: " + JSON.stringify(conn));
    var client = new pg.Client(conn)
    client.connect();
    console.log("pg connected");
    
    var query = {
        name: 'register',        
        text: 'DELETE FROM class WHERE studentid = $1 RETURNING *;',
        values: [student_id]

    }    
    
    console.log("query.text:" + query.text)

    client.query(query, function(err, res){
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            //context.succeed(JSON.stringify(err, null, 2))
            context.succeed(err)
            callback(null, {"statusCode": 500, "body": JSON.stringify(err, null, 2),"isBase64Encoded": false, "headers": {}})
        } else {
            if( 0 == res['rowCount'] ){
                //context.succeed(JSON.stringify({"status": "Doesnt exist"}, null, 2))
                context.succeed({"status": "Doesnt exist"})
                callback(null, {"statusCode": 200, "body": JSON.stringify({"status": "Doesnt exist"}, null, 2),"isBase64Encoded": false, "headers": {}})
            }
            //console.log("GetItem succeeded:", JSON.stringify(res, null, 2));
        client.end()
        }
        //context.succeed(JSON.stringify({"status": "success"}, null, 2))
        context.succeed({"status": "success"})
        callback(null, {"statusCode": 200, "body": JSON.stringify({"status": "success"}, null, 2),"isBase64Encoded": false, "headers": {}})
    });
}