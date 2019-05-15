from company_info import get_profiles_info
from company_info import get_company_info
from alpha_vantage.timeseries import TimeSeries


from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo

# Create an instance of Flask
app = Flask(__name__,
            static_url_path='',
           static_folder='static')



# Route to render index.html template using data from Mongo
@app.route("/")
def home():

    # Return template and data
    return render_template("index.html")


@app.route("/profiles")
def profiles():
#    """Return a list of tickers"""

    profiles_list = get_profiles_info()
    print('profile_list', profiles_list)
    return profiles_list
#

@app.route("/company/<ticker>")
def company(ticker):
#    """Return a companies profile"""


    company = get_company_info(ticker)
    print(company)
#     
    return company
#
#@app.route("/nbr_of_shares")
#def nbr_of_shares():
#    """Return a list of nbr of shares per stock"""
#
#    nbr_of_shares = get_nbr_of_shares()
#     
#    return nbr_of_shares
#
#
#@app.route("/total_cost")
#def total_cost():
#    """Return a list of nbr of shares per stock"""
#
#    total_cost = get_total_cost()
#     
#    return total_cost
#
#
#@app.route("/stock_info")
#def stock_info():
#    """Return a list of stocks"""
#
#    stock_list = get_stock_info()
#     
#    return stock_list





if __name__ == "__main__":
    app.run(debug=True)
