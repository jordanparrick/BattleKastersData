(function() {
  'use strict';

  angular
    .module('battleKasterData')
    .controller('GraphController', GraphController);


  /** @ngInject */
  function GraphController($http, data, $q) {
    var vm = this;

    vm.parseQuestData = function(res){
      vm.xyDataByDay[res.startDate] = _.map(res.completedQuestsByOrder, function(item, key){ return {x: parseInt(key), y: item.length}});
    };


    vm.loading = false;

    vm.generateDailyReport = function(startDate, endDate){
      vm.allData = [];
      vm.xyDataByDay = {};
      vm.loading = true;
      vm.startDate = new moment(startDate).startOf('day').toDate();
      vm.endDate = new moment(endDate).toDate();

      var startDate = new moment(vm.startDate);
      var endDate = new moment(vm.endDate);
      var diff = endDate.diff(startDate, 'days');
      console.log("DIFFERENCE = ", diff);
      var promises = [];

      _.each(_.range(diff), function(int){
        var from = new moment(startDate).add(int, 'day');
        var to = new moment(startDate).add(int + 1, 'day');
        promises.push(data.gatherAnalytics(from, to).then(function(res){
          res.startDate = from.toISOString();
          res.endDate = to.toISOString();

          vm.parseQuestData(res);

          vm.allData.push(res);
        }));
      });

      $q.all(promises).then(function(res){
        //DATA GATHER IS OVER!!!!!!!! DRAW CHART NOW:

        vm.drawChart();

        console.log('GATHERED ALL DATA: ', vm.allData);
        console.log("XY DATA BY DAY: ", vm.xyDataByDay);

        vm.loading = false;

      });
    };

    vm.generateDailyReport("2015-08-18T07:00:00.000Z", "2015-08-20T07:00:00.000Z");


    vm.drawChart = function(){
      nv.addGraph(function() {
        var chart = nv.models.lineChart()
            .margin({left: 100, right: 50})
            .useInteractiveGuideline(true)
          ;

        // will be used as the strings for the x axis
        var beacons = ['num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7'];

        chart.xAxis // second x axis would need to be implememted using just d3
          .axisLabel('Active Quest')

          //resposible for making x axis into the 'quests'
          //.tickValues([0, 1, 2, 3, 4, 5, 6]) // not needed at the moment
          // because of the defualt counting
          .tickFormat(function(d){
            return beacons[d];
          })
        ;

        chart.yAxis
          .axisLabel('Users Still Playing (%)')
          .tickFormat(d3.format('.2f'))
        ;

        d3.select('#chart2 svg')
          .datum(data2())
          .transition().duration(500)
          .call(chart)
        ;

        nv.utils.windowResize(chart.update);

        return chart;
      });
    };

// creates the data
    function data2() {

      // RETURN DATA is what we will return for the graph to plot, it is a list of objects

      // The objects have the following properties:
      //  {
      //    values: [an array of objects: {x: int, y: int}],
      //    key: String you want for your label,
      //    color: '#ff7f0e'
      //  },

      var returnData = [];


      // Iterating through each key of the vm.xyDataByDay object and creating chart data;

      _.each(vm.xyDataByDay, function(val, key){
        returnData.push({
          values: val,
          key: key,
          color: '#ff7f0e'
        })
      });

      return returnData;
    }
  }
})();

