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

<header>
	Create, edit, and manage your contact information

	<span class="display_options">
		<b>Display: </b>
		<select ng-model="template" ng-options="t.name for t in templates">
		</select>
	</span>

	<span class="search">
		<input placeholder="Enter filter" type="search" ng-model="filter_text" />

		<button ng-click="clearFilter()">
			Clear
		</button>
	</span>
	<br />
</header>

<br />

<ng-include src="template.url"></ng-include>

</body>

</html>