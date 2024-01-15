google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

/**
 * drawChart
 */
function drawChart() {
  const data = google.visualization.arrayToDataTable([
    ['Points', 'Number of votes'],
    ['1 Point', 0],
    ['2 Points', 2],
    ['3 Points', 3],
    ['5 Points', 0],
    ['8 Points', 0],
  ]);

  const options = {
    pieHole: 0.5,
    backgroundColor: '#eaeff6',
    width: 600,
    height: 340,
    pieSliceText: 'value',
    legend: 'right',
  };

  const chartElement = document.getElementById('chart');
  const chart = new google.visualization.PieChart(chartElement);
  chart.draw(data, options);
};
