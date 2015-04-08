<!DOCTYPE html>
<html lang="en" ng-app="contactListApp">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="device-width, initial-scale=1">
	
	<title>Sample Contact Manager in AngularJS</title>
	
	<script src="js/angular.js"></script>
	<script src="js/angular-route.js"></script>
	<script src="js/contact_manager.js"></script>

	<link rel="stylesheet" type="text/css" href="css/bootstrap.css" media="screen, projection">
	<link rel="stylesheet" type="text/css" href="css/contactmanager.css" media="screen, projection">
</head>

<body ng-controller="contactListCtrl">

<div ng-view>
</div>

</body>

</html>