var pg = require("pg")
exports.handle = function (event, context, callback) {
    // console.log("event.path: " + event.path);
    let body = JSON.parse(event.body);
    let teacher = body["teacher"];
    let statement = body["notification"]
    var emails = statement.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    console.log("Emails: ", JSON.stringify(emails,null,2))
    console.log("Teacher: ", teacher)
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
        text: 'SELECT studentid FROM class WHERE teacherid in ($1)',
        values: [teacher]

    }    
    
    console.log("query.text:" + query.text)

    client.query(query, function(err, res){
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            callback(null, {"statusCode": 500, "body": JSON.stringify(err, null, 2),"isBase64Encoded": false, "headers": {}});
            client.end()
            return 1
        } else {
            console.log("GetItem succeeded:", JSON.stringify(res, null, 2));
        }
        var response = function(email_list, index){
            // Add all student under teacher to list
            if ( (index) == res['rowCount']){
                callback(null, {"statusCode": 200, "body": JSON.stringify(email_list, null, 2),"isBase64Encoded": false, "headers": {}})
                return email_list;
            }
            email_list.push(res['rows'][index]['studentid'])
            response(email_list, index+1)
            return email_list
        }
        var dummy = response(emails,0)
        //callback(null, {"statusCode": 200, "body": JSON.stringify(res, null, 2)})
        client.end()
    })
};