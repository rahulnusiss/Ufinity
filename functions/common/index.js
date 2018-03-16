var pg = require("pg")
exports.handle = function (event, context, callback) {
    // console.log("event.path: " + event.path);
    
    //let body = JSON.parse(event.body);
    //var teachers = []
    //let body = JSON.parse(event.queryStringParameters);
    // let body = event.queryStringParameters;
    // Invocation from another lambda
    let body = event;
    var keys = Object.keys(body);
    var teachers = keys.map(function(v) { return body[v]; });
    //let teachers = body["teachers"];
    console.log("Query strings: ", JSON.stringify(teachers, null, 2))
    

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
        text: 'SELECT studentid FROM class WHERE teachername in ($1)',
        values: [teachers[0]]
    }    
    
    console.log("query.text:" + query.text)
    var common_list = [];
    var new_list = [];
    client.query(query, function(err, res){
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            context.succeed(JSON.stringify(err, null, 2));
            callback(null, {"statusCode": 500, "body": JSON.stringify(err, null, 2),"isBase64Encoded": false, "headers": {}})
            client.end()
            return 1
        } else {
            
            var arr = res['rows'];
            for (var i = 0; i < arr.length; ++i){
                console.log(" Item at i: ", arr[i])
                common_list.push(arr[i]['studentid'])
            }
            if(1 == teachers.length){
                context.succeed(JSON.stringify(common_list, null, 2));
                callback(null, {"statusCode": 200, "body": JSON.stringify(common_list, null, 2),"isBase64Encoded": false, "headers": {}})
                client.end()
                return 1
            }
            console.log("GetItem succeeded:", JSON.stringify(res, null, 2));
        }
        console.log("common list ", common_list[1])
        client.end()
        var compare_common = function(index, list_common, new_list){
            var client2 = new pg.Client(conn)
            client2.connect();
            console.log("Other queries: ", index, teachers[index])
            var query2 = {
                name: 'register',  
                text: 'SELECT studentid FROM class WHERE teachername=$1',
                values: [teachers[index]]
            }
            client2.query(query2, function(err2, res2){
                if (err2) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err2, null, 2));
                } else {
                    console.log("GetItem succeeded:", JSON.stringify(res2, null, 2));
                    for (var k = 0; k < res2['rows'].length; ++k){
                        var str = res2['rows'][k]['studentid']
                        console.log('str', str)
                        if ( -1 == list_common.indexOf(str)){
                            // remove str from list_common
                            list_common = list_common.filter(e => e !== str);
                        }
                        else{
                            // Add the common to new list
                            new_list.push((list_common.filter(e=> e===str))[0]);
                        }
                    }
                    console.log("list common: ", JSON.stringify(list_common, null,2))
                    client2.end()
                    if( index == teachers.length){
                        context.succeed(JSON.stringify(new_list, null, 2));
                        callback(null, {"statusCode": 200, "body": JSON.stringify(new_list, null, 2),"isBase64Encoded": false, "headers": {}})
                        return list_common
                    }
                    compare_common(index+1, list_common, new_list)
                    return new_list
                }
            });
        }
        //for ( var idx = 1; idx < teachers.length; ++idx){
            //console.log("Common list at idx: ", JSON.stringify(common_list, null,2))
        var dummy = compare_common(1, common_list, new_list)
            //console.log("Common list at idx: ", JSON.stringify(common_list, null,2))
        //}
        //callback(null, {"statusCode": 200, "body": JSON.stringify(common_list, null, 2)})
        client.end()
    })
    //console.log("common list ", common_list[0])
};