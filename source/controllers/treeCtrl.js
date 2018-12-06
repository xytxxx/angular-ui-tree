(function () {
  'use strict';

  angular.module('ui.tree')

    .controller('TreeController', ['$scope', '$element',
      function ($scope, $element) {
        this.scope = $scope;

        $scope.$element = $element;
        $scope.$nodesScope = null; // root nodes
        $scope.$type = 'uiTree';
        $scope.$emptyElm = null;
        $scope.$dropzoneElm = null;
        $scope.$callbacks = null;

        $scope.dragEnabled = true;
        $scope.emptyPlaceholderEnabled = true;
        $scope.maxDepth = 0;
        $scope.dragDelay = 0;
        $scope.cloneEnabled = false;
        $scope.nodropEnabled = false;
        $scope.dropzoneEnabled = false;
        $scope.multiSelectMode = false;

        // Check if it's a empty tree
        $scope.isEmpty = function () {
          return ($scope.$nodesScope && $scope.$nodesScope.$modelValue
          && $scope.$nodesScope.$modelValue.length === 0);
        };

        // add placeholder to empty tree
        $scope.place = function (placeElm) {
          $scope.$nodesScope.$element.append(placeElm);
          $scope.$emptyElm.remove();
        };

        this.resetEmptyElement = function () {
          if ((!$scope.$nodesScope.$modelValue || $scope.$nodesScope.$modelValue.length === 0) &&
            $scope.emptyPlaceholderEnabled) {
            $element.append($scope.$emptyElm);
          } else {
            $scope.$emptyElm.remove();
          }
        };

        this.resetDropzoneElement = function () {
          if ((!$scope.$nodesScope.$modelValue || $scope.$nodesScope.$modelValue.length !== 0) &&
            $scope.dropzoneEnabled) {
            $element.append($scope.$dropzoneElm);
          } else {
            $scope.$dropzoneElm.remove();
          }
        };

        function isChildOfNodes (nodesScope, id, path) {
          let lengthWhenHere = path.length;
          for (var nodeScope of nodesScope.childNodes()) {
            path.length = lengthWhenHere;
            let result = isChildOfNode(nodeScope, id, path);
            if (result != '') return result;
          }        
          return '';
        }

        function isChildOfNode (nodeScope, id, path) {
          let node = nodeScope.$modelValue;
          path.push(node);
          if (node.id === id) return path;
          return isChildOfNodes (nodeScope.$childNodesScope, id, path);
        }

        $scope.findPathToNodeById = function (nodeId) {
          return isChildOfNodes($scope.$nodesScope, nodeId, []);
        }

        $scope.toggleMultiSelectMode = function () {
          $scope.multiSelectMode = !$scope.multiSelectMode;
        }

        $scope.resetEmptyElement = this.resetEmptyElement;
        $scope.resetDropzoneElement = this.resetDropzoneElement;
      }
    ]);
})();
