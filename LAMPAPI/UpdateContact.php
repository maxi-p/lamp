<?php // Not finished yet

	$inData = getRequestInfo();
	
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
    $UserId = $inData["UserId"];
    
    $NewFirstName = $inData["NewFirstName"];
	$NewLastName = $inData["NewLastName"];
	$NewPhone = $inData["NewPhone"];
	$NewEmail = $inData["NewEmail"];
    
	$searchCount = 0;

	$conn = new mysqli("localhost", "EatSand", "yurt", "COP4331");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("select * from Contacts where (FirstName like ? AND LastName like ?) and UserID=?");
		$stmt->bind_param("sss", $FirstName, $LastName, $UserId);
		$stmt->execute();

		while ($row = $result->fetch_assoc())
		{
			$searchCount++;
		}		
		

		if ($searchCount > 0)
		{
			$stmt = $conn->prepare("insert into Users (FirstName,LastName,Login,Password) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("ssss", $inData["FirstName"], $inData["LastName"], $inData["Login"], $inData["Password"]);

			if ($stmt->execute())
			{
				returnWithInfo( $inData['FirstName'], $inData['LastName'], $inData["Login"], $inData["Password"] );
			}
			else
			{
				returnWithError("Failed to add User");
			}
		}
		else
		{
			returnWithError("Contact Not Found");
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