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

// creates the data
function data2() {
  var location1 = [];
  var location2 = [];

  for (var i = 0; i < 7; i++) {
    location1.push({x: i, y: 100 * Math.pow(0.5, i)});
    location2.push({x: i, y: 100 * Math.pow(0.25, i)});
  }

  return [
    {
      values: location1,
      key: 'Location 1',
      color: '#ff7f0e'
    },
    {
      values: location2,
      key: 'Location 2',
      color: '#3399FF'
    }
  ];
}