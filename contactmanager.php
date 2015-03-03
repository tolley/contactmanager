<!DOCTYPE html>
<html lang="en" ng-app="contactListApp">

<head>
	<meta charset="utf-8">
	
	<title>Sample Contact Manager in AngularJS</title>
	
	<script src="js/angular.js"></script>
	<script src="js/contact_manager.js"></script>

	<link rel="stylesheet" type="text/css" href="css/contactmanager.css" media="screen, projection">
</head>

<body ng-controller="contactListCtrl">

<b>Display: </b>
<select ng-model="template" ng-options="t.name for t in templates">
</select>
<br />

<ng-include src="template.url"></ng-include>

</body>

</html>