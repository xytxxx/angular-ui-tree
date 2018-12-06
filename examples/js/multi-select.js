(function () {
  'use strict';

  angular.module('demoApp')
    .controller('MultiSelectCtrl', ['$scope', function ($scope) {
      $scope.remove = function (scope) {
        scope.remove();
      };

      $scope.multiSelectMode = false;
      $scope.selectedNodeIds = [];
      $scope.multiSelectNodeEnds = [];
      $scope.multiSelectNodeEndIds = [];


      function siblingsOfNormalNode (node) {
        var path = findPathToNode(node.id);
        return path[path.length - 2].nodes;
      }

      function canMultiSelect (node, index) {
        if (index == null || node.phase) return false; // cannot select no-drags or read-only 
        if ($scope.multiSelectNodeEnds.length === 0) return true;
        var siblings = _.pluck(siblingsOfNormalNode(node), 'nodeid'); 
        for (var end of $scope.multiSelectNodeEnds) {
          if (!siblings.includes(end.id)) return false;  //not one of the siblings 
        }
        return true;
      }

      function multiSelectClick (node, index) {

        if (!canMultiSelect(node, index)) return;

        var i = indexOfMultiSelectEnds(node);
        if (i >= 0) { //already selected
          $scope.multiSelectNodeEnds.splice(i,1);
        } else {    //clicking some node new
          var toInsert = {
            id: node.nodeid,
            index: index
          }
          $scope.multiSelectNodeEnds.push(toInsert);
          if ($scope.multiSelectNodeEnds.length > 2) {
            $scope.multiSelectNodeEnds.splice(0,1);
          } 
        }
        $scope.multiSelectNodeEndIds = _.pluck($scope.multiSelectNodeEnds, 'id').sort();
      }

      function indexOfMultiSelectEnds (node) {
        for (var i = 0; i < $scope.multiSelectNodeEnds.length; i++) {
          if (node.nodeid === $scope.multiSelectNodeEnds[i].id) {
            return i;
          } 
        }
        return -1;
      }

      function updateMultiSelected () {
        var sortedEnds = _.sortBy($scope.multiSelectNodeEnds, 'index');
        $scope.selectedNodeIds = [];
        if (sortedEnds.length === 0) {
          return;
        } else if (sortedEnds.length === 1) {
          $scope.selectedNodeIds = [sortedEnds[0].id];
        } else {
          var selectedNodes = siblingsOfNormalNode({nodeid: sortedEnds[0].id}).slice(sortedEnds[0].index, sortedEnds[1].index+1);
          var addToSelectedNodeIds = function (node) {
            $scope.selectedNodeIds.push(node.nodeid);
            if (!node.nodes || node.nodes.length === 0) return; 
            node.nodes.forEach(addToSelectedNodeIds);
          }

          selectedNodes.forEach(addToSelectedNodeIds);
        }
      }

      function clearMultiSelect () {
        $scope.selectedNodeIds = [];
        $scope.multiSelectNodeEnds = [];
        $scope.multiSelectNodeEndIds = [];
      }

      $scope.toggle = function (scope) {
        scope.toggle();
      };

      $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
      };

      $scope.newSubItem = function (scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
          id: nodeData.id * 10 + nodeData.nodes.length,
          title: nodeData.title + '.' + (nodeData.nodes.length + 1),
          nodes: []
        });
      };

      $scope.collapseAll = function () {
        $scope.$broadcast('angular-ui-tree:collapse-all');
      };

      $scope.expandAll = function () {
        console.log($scope);
        $scope.$broadcast('angular-ui-tree:expand-all');
      };

      $scope.data = [{
        'id': 1,
        'title': 'node1',
        'nodes': [
          {
            'id': 11,
            'title': 'node1.1',
            'nodes': [
              {
                'id': 111,
                'title': 'node1.1.1',
                'nodes': []
              }
            ]
          },
          {
            'id': 12,
            'title': 'node1.2',
            'nodes': []
          }
        ]
      }, {
        'id': 2,
        'title': 'node2',
        'nodrop': true, // An arbitrary property to check in custom template for nodrop-enabled
        'nodes': [
          {
            'id': 21,
            'title': 'node2.1',
            'nodes': []
          },
          {
            'id': 22,
            'title': 'node2.2',
            'nodes': []
          }
        ]
      }, {
        'id': 3,
        'title': 'node3',
        'nodes': [
          {
            'id': 31,
            'title': 'node3.1',
            'nodes': []
          }
        ]
      }];
    }]);

}());
