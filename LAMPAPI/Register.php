<?php

	$inData = getRequestInfo();

	$Login = $inData["Login"];
	$Password = $inData["Password"];
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	
	$searchCount = 0;

	$conn = new mysqli("localhost", "EatSand", "yurt", "COP4331");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("select * from Users where Login like ?");
		$stmt->bind_param("s", $Login);
		$stmt->execute();
		$result = $stmt->get_result();

		while ($row = $result->fetch_assoc())
		{
			$searchCount++;
		}		
		

		if ($searchCount == 0)
		{
			$stmt = $conn->prepare("insert into Users (FirstName,LastName,Login,Password) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("ssss", $FirstName, $LastName, $Login, $Password);

			if ($stmt->execute())
			{
				returnWithInfo( $FirstName, $LastName, $Login, $Password );
			}
			else
			{
				returnWithError("Failed to add User");
			}
		}
		else
		{
			returnWithError("User Already Exists");
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $login, $password)
	{
		$retValue = '{"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","Login":"' . $login . '","Password":"' . $password . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>