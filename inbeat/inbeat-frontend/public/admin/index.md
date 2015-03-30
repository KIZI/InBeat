$markdown: false
$title: InBeat - Admin

<script type="text/javascript" src="controller.js"></script>
<script type="text/javascript" src="ngStorage.min.js"></script>

<link rel="stylesheet" type="text/css" href="style.css">

<div ng-app="InBeatDocs" ng-controller="MainCtrl">

<div id="spinner" class="overlay" style="display:none;">
<img  ng-src="ajax-loader.gif" />
</div>

<div class="row">
<div class="col-lg-3">
    <ul class="list-group">
      <li class="list-group-item"><a href="#main">Main</a></li>
      <li class="list-group-item"><a href="#gain-adminAccount">GAIN - Admin Account</a></li>
      <li class="list-group-item"><a href="#gain-account">GAIN - Account</a></li>
      <li class="list-group-item"><a href="#gain-aggregation-rules">GAIN - Aggregation Rules</a></li>
      <li class="list-group-item"><a href="#gain-aggregation-taxonomy">GAIN - Aggregation Taxonomy</a></li>
    </ul>
    <ul class="list-group">
      <li class="list-group-item"><a href="#gain-listener">GAIN - Listener</a></li>
      <li class="list-group-item"><a href="#gain-interaction">GAIN - Interaction</a></li>
      <li class="list-group-item"><a href="#gain-session">GAIN - Session</a></li>
      <li class="list-group-item"><a href="#gain-export">GAIN - Export</a></li>
      <li class="list-group-item"><a href="#gain-description">GAIN - Description</a></li>
    </ul>
    <ul class="list-group">
        <li class="list-group-item"><a href="#pl-data">PL - Data</a></li>
        <li class="list-group-item"><a href="#pl-rule">PL - Rules</a></li>
    </ul>
    <ul class="list-group">
        <li class="list-group-item"><a href="#rs-rule">RS - Rules</a></li>
        <li class="list-group-item"><a href="#rs-classification">RS - Classification</a></li>
    </ul>
</div>
<div class="col-lg-9">
    <form class="form-inline" role="form">
        <div class="form-group">
            <label class="sr-only" for="accountId">AccountId</label>
            <input type="text" class="form-control" id="accountId" placeholder="Enter accountId" ng-model="accountId">
        </div>
        <div class="form-group">
            <label class="sr-only" for="username">Username</label>
            <input type="text" class="form-control" id="username" placeholder="Enter username" ng-model="username">
        </div>
        <div class="form-group">
            <label class="sr-only" for="password">Password</label>
            <input type="text" class="form-control" id="password" placeholder="Enter password" ng-model="password">
        </div>
    </form>
    <hr />
    <div ng-view></div>
</div>
</div>

</div>