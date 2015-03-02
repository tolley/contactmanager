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

<ul class="contact_list">
	<li class="contact" ng-repeat="contact in contacts">
		<div>
			<span class="propername">{{contact.firstname + ' ' + contact.lastname}}</span><br />
			<span class="propername">{{contact.street}}</span><br />
			<span class="propername">{{contact.street2}}</span><br ng-if="contact.street2" />
			<span class="propername">{{contact.city + ' ' + contact.state.toUpperCase() + '. ' + contact.zip}}</span><br />
			<span class="propername">{{contact.street}}</span><br />
			<span>{{contact.phone}}</span>
		</div><br />
	</li>
</ul>

</body>

</html>