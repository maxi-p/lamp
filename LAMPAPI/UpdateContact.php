<?php

	$inData = getRequestInfo();

	$ID = $inData["ID"];

	$NewFirstName = $inData["NewFirstName"];
	$NewLastName = $inData["NewLastName"];
	$NewPhone = $inData["NewPhone"];
	$NewEmail = $inData["NewEmail"];
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "EatSand", "yurt", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select * from Contacts where ID=?");
		$stmt->bind_param("s", $ID);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$searchCount++;
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else if ($searchCount == 1)
		{
			$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
			$stmt->bind_param("sssss", $NewFirstName, $NewLastName, $NewPhone, $NewEmail, $ID);

			if ($stmt->execute())
			{
				returnWithInfo($NewFirstName, $NewLastName, $NewPhone, $NewEmail, $ID);
			}
			else
			{
				returnWithError("Failed to Update Contact");
			}
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
	
	function returnWithInfo( $firstName, $lastName, $phone, $email, $ID)
	{
		$retValue = '{"ID":"' . $ID . '","FirstName":"' . $firstName . '","LastName":"' . $lastName . '","Phone":"' . $phone . '","Email":"' . $email . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>