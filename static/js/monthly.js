const api_key = "QIT4B3LLKYRYT48J";
const q_api_key ='LvDnxyb5x2sY2-YHy76Y';
var ticker= localStorage.getItem("ticker");
var comp_name= sessionStorage.getItem("comp_name");
var today_date= sessionStorage.getItem("today_date");

var date = "";
sessionStorage.getItem("today_date", date);
d3.select("#report-date").text(date);



var company_line = d3.select("#company");
company_line.text(ticker + comp_name);
      
      
        


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
var one_yr_ago= parseInt(yyyy, 10)-1;
var mm = formatMM(today);
var dd = formatDD(today);

var start_date = `${five_yrs_ago}-${mm}-${dd}`;
console.log('start date', start_date);
var start_ym = `${five_yrs_ago}-${mm}`;
var one_yr_start_date = `${one_yr_ago}-${mm}-${dd}`;


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



function getMonthlyData() {

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

    var selector = d3.select("#selDataset");

   
    console.log('processing profiles'); 
    d3.json("/profiles").then((p_info) =>{
           console.log('p_info :', p_info);
   
           tickers = p_info.ticker;
           console.log('tickers', tickers); 
           comp_name = p_info.comp_name;
           comp_desc = p_info.comp_desc;
           sector = p_info.zacks_x_ind_desc;
           comp_url = p_info.comp_url;
           address = p_info.address_line_1;
           city = p_info.city;
           email = p_info.email;
           phone = p_info.phone_nbr;
           state = p_info.state_code;
           market_sector = p_info.zacks_x_ind_descl;
           market_val = p_info.market_val;
           total_rev = p_info.tot_revenue_f0;
           net_income = p_info.net_income_f0;
           pe_ratio = p_info.pe_ratio_f1;
           div_yield = p_info.div_yield;
           strong_buys = p_info.rating_strong_buys;
           strong_sells = p_info.rating_strong_sells;
           rating_buys = p_info.rating_buys;
           rating_sells = p_info.rating_sells;
           rating_holds = p_info.rating_holds;


    
          tickers.forEach((ticker) => {
              selector
                .append("option")
                .text(ticker)
                .property("value", ticker);
              });
    
        // Use the first symbol on the list
          ticker = tickers[0];
          profile_retrieval(ticker);
          console.log('firstTicker', ticker);
      
 
        
//      buildCharts(firstSymbol);
//      buildTable(firstSymbol);
//      getMonthlyData(firstTicker);
//      console.log('buildcharts');
//      buildCharts(firstTicker);
  
    
    });

}    
                             


function optionChanged(newTicker) {
  // Fetch new data each time a new sample is selected
      ticker = newTicker;
      console.log(newTicker);
      profile_retrieval(newTicker);

    
//  getMonthlyData(newTicker);
//  buildCharts(newTicker);
}

var charts = d3.select("#charts");
var comp_profiles = d3.select("#comp_profiles");

exp_charts.on("click", function() {

  // Prevent the page from refreshing
      d3.event.preventDefault();
 
      localStorage.setItem("ticker", ticker);    
    
      console.log('exp_charts executing');
//      d3.json(`/exp_charts/${ticker}`).then((ticker) => {
//          console.log(ticker);
//        });
    
})


init();


//analyst recommendation - data = quandl.get_table("ZACKS/AR", paginate=True)

// company profile - data = quandl.get_table("ZACKS/CP", paginate=True)