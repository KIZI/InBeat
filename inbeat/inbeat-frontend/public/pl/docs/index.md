$title: RS API Documentation
$markdown: false

<script type="text/javascript" src="/js/docs-api-ctrl.js"></script>
<script type="text/javascript" src="/js/apiary-blueprint-parser-0.4.4.js"></script>
<script type="text/javascript" src="/js/markdown.js"></script>

<div ng-app="docsapiapp" ng-controller="DocsApiCtrl" id="apidoc">

<h1 ng-bind="data.name"></h1>
<h3 ng-bind="'API: '+data.location"></h3>
<p ng-bind-html-unsafe="data.description | mFilter"></p>

<div ng-repeat="section in data.sections">
	<h3 ng-bind="section.name"></h3>
	<em ng-bind="section.description"></em>

	<div class="panel-group" id="accordion2">
    <div class="panel panel-default" ng-repeat="resource in section.resources">
		<div class="panel-heading">
		    <h4 class="panel-title">
			    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse{{$parent.$index+'-'+$index}}"><span class="label label-info" ng-bind="resource.method"></span>&nbsp;<strong ng-bind="resource.url"></strong></a>
			</h4>
			<br />
            <div style="margin-left: 2em;" ng-bind-html-unsafe="resource.description | mFilter"></div>
        </div>
		<div id="collapse{{$parent.$index+'-'+$index}}" class="panel-collapse collapse">
      		<div class="panel-body">
				<strong>Request:</strong>
				<ul class="unstyled">
					<li ng-repeat="header in resource.request.headers">{{header}}</li>
				</ul>
				<pre ng-bind="resource.request.body"></pre>
				<strong>Responses:</strong>
				<div ng-repeat="response in resource.responses">
					<strong ng-bind="response.status"></strong>
					<ul class="unstyled">
						<li ng-repeat="header in response.headers">{{header}}</li>
					</ul>
					<pre ng-bind="response.body"></pre>
				</div>
				<strong>cURL example:</strong>
				<pre>{{resource.curl}}</pre>

			</div>
		</div>
	</div>
	</div>

</div>
</div>