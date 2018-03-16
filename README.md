# Ufinity teacher student

## Components used:

1. PostgreSQL on AWS RDS

2. Lambda functions: 4 lambda functions for each 4 use case

3. The 5th lambda function calls other 4 lambda function according to the api called.

4. API gateway to process the request and return response.

5. aws-serverless-express for node on lambda. https://github.com/awslabs/aws-serverless-express/tree/master/example

The whole backend is serverless using lambda functions.

The main node project is in main_node_lambda/. This node project calls other lambda functions internally to do the required job.

Routing in app.js

## APIs

1. Register: functions/ufinity_register_new/index.js

	API: https://8ztgr2h7e2.execute-api.ap-southeast-1.amazonaws.com/prod/register

	Header: Content-type=application/json

	POST: Example

		{
	    "teacher": "ufinityteacherSuper5@gmail.com",
	    "students": [
	      "st15@gmail.com",
	      "st53@gmail.com",
	      "st24@gmail.com",
	      "st32@gmail.com"
	    ]
	  }


2. CommonStudents:  functions/common/index.js

	API: https://8ztgr2h7e2.execute-api.ap-southeast-1.amazonaws.com/prod/common

	Constraint: The key of query param strings should be different.

	Header: Content-type=application/json

	GET:Example

	https://8ztgr2h7e2.execute-api.ap-southeast-1.amazonaws.com/prod/common?teacher1=ufinityteacherSuper5&teacher2=ufinityteacherSuper6	

	Keys here are teacher3 and teacher4. These keys can be any string value.

3. Suspend:	functions/suspend/index.js

	API: https://8ztgr2h7e2.execute-api.ap-southeast-1.amazonaws.com/prod/suspend

	Header: Content-type=apllication/json

	POST: Example

		{
			"student": "st32@gmail.com"
		}

4. Retreive Notifications:  functions/notify/index.js
	API:  https://8ztgr2h7e2.execute-api.ap-southeast-1.amazonaws.com/prod/notify

	Header: Content-type=application/json

	POST: Example

	{
	    "teacher": "postman23@gmail.com",
	    "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com @mbaba@fuchs.com;"
  	}