# Ufinity teacher student

## Components used:

1. PostgreSQL on AWS RDS

2. Lambda functions: 4 lambda functions for each 4 use case

3. API gateway to process the request and return response.

The whole backend is serverless using lambda functions.

## APIs

1. Register: functions/ufinity_register_new/index.js

	API: https://ifv63bdiv1.execute-api.ap-southeast-1.amazonaws.com/dev/api/register

	Header: Content-type=application/json

	POST: Example

		{
	    "teacher": "postman23@gmail.com",
	    "students": [
	      "st15@gmail.com",
	      "st53@gmail.com",
	      "st24@gmail.com",
	      "st32@gmail.com"
	    ]
	  }


2. CommonStudents:  functions/common/index.js

	API:https://ifv63bdiv1.execute-api.ap-southeast-1.amazonaws.com/dev/api/commonstudents

	Constraint: The key of query param strings should be different.

	Header: Content-type=application/json

	GET:Example

	https://ifv63bdiv1.execute-api.ap-southeast-1.amazonaws.com/dev/api/commonstudents?teacher3=postman22&teacher4=lambdateacher9

	Keys here are teacher3 and teacher4. These keys can be any string value.

3. Suspend:	functions/suspend/index.js

	API: https://ifv63bdiv1.execute-api.ap-southeast-1.amazonaws.com/dev/api/suspend

	Header: Content-type=apllication/json

	POST: Example

		{
			"student": "st32@gmail.com"
		}

4. Retreive Notifications:  functions/notify/index.js
	API:  https://ifv63bdiv1.execute-api.ap-southeast-1.amazonaws.com/dev/api/retrievefornotifications

	Header: Content-type=application/json

	POST: Example

	{
	    "teacher": "postman23@gmail.com",
	    "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com @mbaba@fuchs.com;"
  	}