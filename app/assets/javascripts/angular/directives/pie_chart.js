angular.module("Prometheus.directives").directive('pieChart', ["$location", "WidgetHeightCalculator", "VariableInterpolator", "YAxisUtilities", function($location, WidgetHeightCalculator, VariableInterpolator, YAxisUtilities) {
  return {
    restrict: "A",
    scope: {
      graphSettings: '=',
      aspectRatio: '=',
      data: '=',
      vars: '='
    },
    link: function(scope, element, attrs) {
      var $el = $(element[0]);
      var pieGraph;

      function redrawGraph() {
        // Graph height is being set irrespective of legend.
        var graphHeight = WidgetHeightCalculator(element[0], scope.aspectRatio);
        $el.css('height', graphHeight);

        if (pieGraph) {
          $el.html('<div class="graph_chart"></div>');
          pieGraph = null;
        }

        if (scope.data == null) {
          return;
        }

        if (scope.data.Value) {
          scope.data = Array.prototype.slice.call(scope.data.Value);
          scope.data.forEach(function(e) {
            e.Instance = e.Metric.instance;
            e.Value = parseFloat(e.Value);
          });
        }
        // figure out how to scope this to $el...
        var svg = dimple.newSvg(".graph_chart", 590, 400);
        pieGraph = new dimple.chart(svg, scope.data);
        pieGraph.setBounds(20, 20, 460, 360)
        pieGraph.addMeasureAxis("p", "Value");
        pieGraph.addSeries("Instance", dimple.plot.pie);
        pieGraph.addLegend(500, 20, 90, 300, "left");
        pieGraph.draw();
      }

      function calculateGraphHeight($legend) {
        var graphHeight = WidgetHeightCalculator(element[0], scope.aspectRatio);
        var height = graphHeight - elementHeight($legend);
        if (height < 1) height = 1;
        return height;
      }

      scope.$watch('graphSettings.expressions', redrawGraph, true);
      scope.$watch('data', redrawGraph, true);
      scope.$on('redrawGraphs', function() {
        redrawGraph();
      });
    },
  };
}]);
