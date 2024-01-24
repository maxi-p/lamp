<?php

	$inData = getRequestInfo();

    $FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
    $UserId = $inData["UserId"];
	
	$searchCount = 0;

	$conn = new mysqli("localhost", "EatSand", "yurt", "COP4331");

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select * from Contacts where (FirstName like ? AND LastName like ?) and UserID=?");
		$stmt->bind_param("sss", $FirstName, $LastName, $UserId);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$searchCount++;
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "Contact Doesn't Exist" );
		}
		else
		{
			$stmt = $conn->prepare("DELETE FROM Contacts where (FirstName like ? and LastName like ?) and UserID=?");
            $stmt->bind_param("sss", $FirstName, $LastName, $UserId);
            $stmt->execute();
            returnSuccessfully();
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
	
	function returnSuccessfully()
	{
		$retValue = '{"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>