/* eslint-disable no-var */
/* eslint-disable max-len */
google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

/**
 * drawChart
 */
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Player', 'Vote', {role: 'style'}],
    ['Luiz', 8, '#b87333'],
    ['Edson', 2, '#e5e4e2'],
    ['João', 5, 'gold'],
    ['Average', 8, 'color: green'],
  ]);

  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1,
    {calc: 'stringify',
      sourceColumn: 1,
      type: 'string',
      role: 'annotation'},
    2]);

  var options = {
    width: 700,
    height: 340,
    bar: {groupWidth: '90%'},
    legend: {position: 'none'},
    backgroundColor: '#0d1117',
  };
  var chart = new google.visualization.ColumnChart(document.getElementById('chart'));
  chart.draw(view, options);
}
