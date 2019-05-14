const api_key = "QIT4B3LLKYRYT48J";
var ticker= " ";
var tickers = [];
var companies = [];


var today = new Date();
//var date = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

var parseTime = d3.timeParse("%Y-%m-%d");
var today_d = parseTime(today);
console.log('today', today);
console.log('today_d', today_d);

var formatDate = d3.timeFormat("%Y-%m-%d");
var today_f = formatDate(today);
console.log('today_f', today_f);
var formatYYYY = d3.timeFormat("%Y");
var formatMM = d3.timeFormat("%m");
var formatDD = d3.timeFormat("%d");

var yyyy = formatYYYY(today);
var five_yrs_ago= parseInt(yyyy, 10)-5;
var mm = formatMM(today);
var dd = formatDD(today);

var start_date = `${five_yrs_ago}-${mm}-${dd}`;
console.log('start date', start_date);
var start_ym = `${five_yrs_ago}-${mm}`;



function unpack_dates(rows) {
    var stock_0={};
    var dates_0 =[];
    var open_0 =[];
    var close_0 =[];
    var low_0 =[];
    var high_0 =[];
    var vol_0 =[];
    Object.entries(rows).forEach(([key, value]) => {
        if (key >= start_date) {
          dates_0.push(key);
            Object.entries(value).forEach(([key_1, value_1]) => {
                switch(key_1) {
                    case('1. open'):
                        open_0.push(value_1);
                        break;
                    case('2. high'):
                        high_0.push(value_1);
                        break;
                    case('3. low'):
                        low_0.push(value_1);
                        break;
                    case('4. close'):
                        close_0.push(value_1);
                    case('6. volume'):
                        vol_0.push(value_1);
                        break;
                        break;
                }    
                     
        });
      }
  });
  stock_0={'dates' : dates_0,
           'open' : open_0,
           'high' : high_0,
           'low' : low_0,
           'volume' : vol_0,
           'close' : close_0 };
  return stock_0;  
    
}



function getMonthlyData(nbr_shares, initial_cost) {

  var queryUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${api_key}`;
  console.log(queryUrl);
  
  d3.json(queryUrl).then(function(data) {
    var meta_data = data["Meta Data"];
//    console.log('meta_data', data);  
    var time_series = data["Monthly Adjusted Time Series"];
    var stock_details = unpack_dates(data["Monthly Adjusted Time Series"]);
    var dates = stock_details.dates;  
    var openPrices = stock_details.open;  
    var lowPrices = stock_details.low;  
    var highPrices = stock_details.high;  
    var closingPrices = stock_details.close;  
    var volume = stock_details.volume;  
      

    var total_value = nbr_shares * closingPrices[0];
    var unrealized_profit = total_value - initial_cost;
    total_value = total_value.toFixed(2);
    unrealized_profit = unrealized_profit.toFixed(2);
    var cost_value = `Total value : $${total_value};   Unrealized P&L $${unrealized_profit}`;
    var cost_value_p = d3.select("#cost-value");
    cost_value_p.text(cost_value);
      
      
      
      
    buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
  });
}





function buildCharts(symbol) {

    daily_url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${api_key}`
    console.log('daily_url :', daily_url); 
   
      d3.json(daily_url).then(function(data) {

        var metadata_info = data["Meta Data"];

        var time_series = data["Time Series (Daily)"];
//        console.log('meta data daily', metadata_info);

        console.log('timeseries daily', time_series);
        var stock_details = unpack_dates(data["Time Series (Daily)"]);
        var dates = stock_details.dates;  
        var openPrices = stock_details.open;  
        var lowPrices = stock_details.low;  
        var highPrices = stock_details.high;  
        var closingPrices = stock_details.close;  
        var volume = stock_details.volume;  
//        console.log('dates:', dates);
//        console.log('open:', openPrices);
//        console.log('close:', closingPrices);

          
          
        var trace1 = {
          type: "scatter",
          mode: "lines",
          name: symbol,
          x: dates,
          y: closingPrices,
          line: {
            color: "#17BECF"
          }
        };

    // Candlestick Trace
        var trace2 = {
          type: "candlestick",
          x: dates,
          high: highPrices,
          low: lowPrices,
          open: openPrices,
          close: closingPrices
        };
        console.log('closePrices', closingPrices);
        console.log('min', Math.min(...closingPrices));
        console.log('max', Math.max(...closingPrices));
        
        var data = [trace1, trace2];
//        console.log(start_date, today_f);  
        var layout = {
          title: `${symbol} closing prices - 5 years`,
          xaxis: {
            range: [start_date, today_f],
            type: "date"
          },
      yaxis: {
        autorange: [Math.min(...closingPrices) * 0.8, Math.max(...closingPrices) * 1.1],
        type: "linear"
      },
      showlegend: false
    };

    Plotly.newPlot("plot", data, layout);
    console.log('plot!!!');

     });        
         
}


function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
    
  var tbody_info = tbody.html(); 
    
  if (tbody_info != ''){
        var all_tr = d3.select("tbody").selectAll("tr").remove();
        var all_td = d3.select("tbody").selectAll("td").remove();
  }  
    
  console.log('buildTable', symbol)
  var trow;
  for (var i = 0; i < 60; i++) {
//    console.log('i', i); 
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(openPrices[i]);
    trow.append("td").text(highPrices[i]);
    trow.append("td").text(lowPrices[i]);
    trow.append("td").text(closingPrices[i]);
    trow.append("td").text(volume[i]);
  }
}







function init() {
    
    console.log('beginning')
    var monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    d3.select("#report-date").text(date);
    console.log(date);
    
    var selector = d3.select("#selDataset");

   
    
    d3.json("/profiles").then((profileInfo) =>{
    console.log('console.log', profileInfo);
    profileInfo.forEach((p_info) => {        
       ticker.push(p_info[0]);
       companies.push(p_info[1]);
       nbr_of_shares.push(s_info[2]);
       total_cost.push(s_info[3]);
        
    });


    
    symbols.forEach((symbol) => {
      selector
        .append("option")
        .text(symbol)
        .property("value", symbol);
      });
    
    // Use the first symbol on the list
      const firstSymbol = symbols[0];
      symbol = firstSymbol;
        
      var company_h4 = d3.select("#company-name");
      company_h4.text(companies[0]);
 
      var total_cost_num = total_cost[0];  
      total_cost_num = total_cost_num.toFixed(2);

      var nbr_of_shares_num = nbr_of_shares[0];  
      nbr_of_shares_num = nbr_of_shares_num.toFixed(2);
  
   
        
      var cost_shares = `Total cost : $${total_cost_num};   Number of shares ${nbr_of_shares_num}`;
      var initial_cost = total_cost[0];  
        
      var cost_shares_p = d3.select("#cost-shares");
      cost_shares_p.text(cost_shares);
        
//      buildCharts(firstSymbol);
//      buildTable(firstSymbol);
      getMonthlyData(nbr_of_shares[0], initial_cost);
      console.log('buildcharts');
      buildCharts(firstSymbol);
  
    
    });

}    
                             

function optionChanged(newTicker) {
  // Fetch new data each time a new sample is selected
  ticker = newTicker;
  console.log(newTicker);
  var ind = tickers.indexOf(newTicker);
  var initial_cost = total_cost[ind];  

  var company_h4 = d3.select("#company-name");
  company_h4.text(companies[ind]);
    
  var total_cost_num = total_cost[ind];  
  total_cost_num = total_cost_num.toFixed(2);

  var nbr_of_shares_num = nbr_of_shares[ind];  
  nbr_of_shares_num = nbr_of_shares_num.toFixed(2);
  
  var cost_shares = `Total cost : $${total_cost_num};   Number of shares ${nbr_of_shares_num}`;
  var initial_cost = total_cost[ind];  
  var cost_shares_p = d3.select("#cost-shares");
  cost_shares_p.text(cost_shares);
  getMonthlyData(nbr_of_shares[ind], initial_cost);

  buildCharts(newStock);
}


init();


//analyst recommendation - data = quandl.get_table("ZACKS/AR", paginate=True)

// company profile - data = quandl.get_table("ZACKS/CP", paginate=True)