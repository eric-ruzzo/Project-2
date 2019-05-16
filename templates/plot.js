const api_key = "QIT4B3LLKYRYT48J";
const q_api_key ='LvDnxyb5x2sY2-YHy76Y';
var ticker= " ";
var comp_name= " ";
var tickers = [];
var comp_name = [];
var comp_url = [];
var comp_desc = [];
var address = [];
var city = [];
var state = [];
var market_val = [];
var market_sector = [];
var total_rev = [];
var net_income = [];
var pe_ratio = [];
var div_yield = [];
var phone = [];
var email = [];
var strong_buys = [];
var strong_sells = [];
var rating_buys = [];
var rating_sells = [];
var rating_holds = [];

        


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


function profile_retrieval(ticker) {

      var ind = tickers.indexOf(ticker);
      console.log('market value ', market_val[ind]);
      console.log('market value/1000 ', market_val[ind]/1000);
    
      var marketValue = (parseFloat(market_val[ind])/1000).toFixed(2);
      console.log('market value ', marketValue); 
      var netIncome = (parseFloat(net_income[ind])/1000).toFixed(2);
      var totalRevenue = (parseFloat(total_rev[ind])/1000).toFixed(2);

      if (!email[ind]) {
          email[ind] = "N/A";
      }
    
      console.log('ind :', ind);
      document.getElementById("company-name").innerHTML = comp_name[ind];
      document.getElementById("company-desc").innerHTML = comp_desc[ind];
      document.getElementById("sector").innerHTML = 'Industry Sector : ' + sector[ind];
      document.getElementById("company-website").innerHTML = 'Company website : ' + comp_url[ind];
      document.getElementById("company-addr").innerHTML = 'Headoffice : ' + address[ind] + ', ' + city[ind] + ', ' + state[ind];
      document.getElementById("market-val").innerHTML = 'Market value : ' + marketValue + ' billion USD' + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' +  '  Total revenue : ' + totalRevenue + ' billion USD' + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + ' Net income : ' + netIncome + ' billion USD';
      document.getElementById("phone-nbr").innerHTML = 'Contact info : ' + phone[ind] +  '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + ' email : ' + email[ind];
      document.getElementById("div-yield").innerHTML = 'Dividend yield : ' + div_yield[ind] + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + ' PE ratio : ' + pe_ratio[ind];
    
    
    
      d3.json(`/company/${ticker}`).then((tickerInfo) =>{
 
          console.log('tickerInfo', tickerInfo);
          console.log('strong rating', tickerInfo['rating_cnt_strong_buys'][0]);

          if (tickerInfo['rating_cnt_strong_buys'][0] == undefined) {
              var strong_buys_rating = '<strong>Strong buys rating : </strong>' + strong_buys[ind];
              var strong_sells_rating = '<strong>Strong sells rating : </strong>' + strong_sells[ind];
              var buys_rating = '<strong>Buys rating : </strong>' + rating_buys[ind];
              var sells_rating = '<strong>Sells rating : </strong>' + rating_sells[ind];
              var holds_rating = '<strong>Holds rating : </strong>' + rating_holds[ind];
              
              var strong_buys_1m = " ";
              var strong_buys_2m = " ";
              var strong_buys_3m = " ";
              var strong_sells_1m = " ";
              var strong_sells_2m = " ";
              var strong_sells_3m = " ";
              var buys_1m = " ";
              var buys_2m = " ";
              var buys_3m = " ";
              var sells_1m = " ";
              var sells_2m = " ";
              var sells_3m = "";
              var holds_1m = " ";
              var holds_2m = " ";
              var holds_3m = " ";
              var rating_mean = " ";
              var rating_mean_1m = " ";
              var rating_mean_2m = " ";
              var rating_mean_3m = " ";
              console.log('rating......', rating_mean, rating_mean_1m, sells_rating,holds_rating)
          }     
          else {   
              
              strong_buys_rating = '<strong>Strong buys rating : </strong>' + tickerInfo['rating_cnt_strong_buys'][0];
              strong_buys_1m = '** a month ago : ' + tickerInfo['rating_cnt_strong_buys_1m_ago'][0];
              strong_buys_2m = '** two months ago : ' + tickerInfo['rating_cnt_strong_buys_2m_ago'][0];
              strong_buys_3m = '** three months ago : ' + tickerInfo['rating_cnt_strong_buys_3m_ago'][0];
          
              strong_sells_rating = '<strong>Strong sells rating : </strong>' + tickerInfo['rating_cnt_strong_sells'][0];
              strong_sells_1m = '** a month ago : ' + tickerInfo['rating_cnt_strong_sells_1m_ago'][0];
              strong_sells_2m = '** two months ago : ' + tickerInfo['rating_cnt_strong_sells_2m_ago'][0];
              strong_sells_3m = '** three months ago : ' + tickerInfo['rating_cnt_strong_sells_3m_ago'][0];
          
              buys_rating = '<strong>Buys rating : </strong>' + tickerInfo['rating_cnt_buys'][0];
              buys_1m = '** a month ago : ' + tickerInfo['rating_cnt_buys_1m_ago'][0];
              buys_2m = '** two months ago : ' + tickerInfo['rating_cnt_buys_2m_ago'][0];
              buys_3m = '** three months ago : ' + tickerInfo['rating_cnt_buys_3m_ago'][0];
          
              sells_rating = '<strong>Sells rating : </strong>' + tickerInfo['rating_cnt_sells'][0];
              sells_1m = '** a month ago : ' + tickerInfo['rating_cnt_sells_1m_ago'][0];
              sells_2m = '** two months ago : ' + tickerInfo['rating_cnt_sells_2m_ago'][0];
              sells_3m = '** three months ago : ' + tickerInfo['rating_cnt_sells_3m_ago'][0];
          
              rating_mean = '<strong>Rating mean : </strong>' + tickerInfo['rating_mean'][0];
              rating_mean_1m = '** a month ago : ' + tickerInfo['rating_mean_1m_ago'][0];
              rating_mean_2m = '** two months ago : ' + tickerInfo['rating_mean_2m_ago'][0];
              rating_mean_3m = '** three months ago : ' + tickerInfo['rating_mean_3m_ago'][0];
          
          
              holds_rating = '<strong>Holds rating : </strong>' + tickerInfo['rating_cnt_holds'][0];
              holds_1m = '** a month ago : ' + tickerInfo['rating_cnt_holds_1m_ago'][0];
              holds_2m = '** two months ago : ' + tickerInfo['rating_cnt_holds_2m_ago'][0];
              holds_3m = '** three months ago : ' + tickerInfo['rating_cnt_holds_3m_ago'][0];
              console.log('rating......else', rating_mean, rating_mean_1m, sells_rating,holds_rating)

          }    

//          document.querySelector("#ratings").innerHTML = [
//             "<h6>" + strong_buys_rating + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + strong_sells_rating + "</h6> <br>",
//             "<h6>" + strong_buys_1m + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' +  strong_sells_1m + "</h6> <br>",
//             "<h6>" + strong_buys_2m + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' +  strong_sells_2m + "</h6> <br>",
//             "<h6>" + strong_buys_3m + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' +  strong_sells_3m + "</h6> <br>",
//             "<h6>" + buys_rating + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + sells_rating + "</h6> <br>",
//             "<h6>" + buys_1m + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + sells_1m + "<br>" + sells_2m + "<br>" + sells_3m + "</h6> <br>",
//             "<h6>" + holds_rating + "<br>" + holds_1m + "<br>" + holds_2m + "<br>" + holds_3m + "</h6> <hr>",
//             "<h6>" + rating_mean + "<br>" + rating_mean_1m + "<br>" + rating_mean_2m + "<br>" + rating_mean_3m + "</h6>"].join("");

          console.log('rating -- ', rating_mean_1m, rating_mean, holds_rating, holds_1m);
          
          document.querySelector("#ratings-1").innerHTML = [
             "<h6>" + strong_buys_rating + "<br>" +  strong_buys_1m + "<br>" + strong_buys_2m + "<br>" + strong_buys_3m + "</h6> <br>",
             "<h6>" + buys_rating + "<br>" + buys_1m + "<br>" + buys_2m + "<br>" + buys_3m + "</h6> <br>",
             "<h6>" + holds_rating + "<br>" + holds_1m + "<br>" + holds_2m + "<br>" + holds_3m + "</h6>"].join("");
          
          document.querySelector("#ratings-2").innerHTML = [
             "<h6>" + strong_sells_rating + "<br>" + strong_sells_1m + "<br>" + strong_sells_2m + "<br>" + strong_sells_3m + "</h6> <br>",
             "<h6>" + sells_rating + "<br>" + sells_1m + "<br>" + sells_2m + "<br>" + sells_3m + "</h6> <br>",
             "<h6>" + rating_mean + "<br>" + rating_mean_1m + "<br>" + rating_mean_2m + "<br>" + rating_mean_3m + "</h6>"].join("");

          console.log('rating -- ', rating_mean_1m, rating_mean, holds_rating, holds_1m);
          
              //    buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
  });   
}   




function init() {
    
    console.log('beginning')
    var monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    d3.select("#report-date").text(date);
    console.log(date);
    
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

var exp_charts = d3.select("#exp-charts");

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