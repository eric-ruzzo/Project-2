from company_info import get_profiles_info
from company_info import get_company_info


from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo

# Create an instance of Flask
app = Flask(__name__,
            static_url_path='',
           static_folder='static')

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/project_2_app")



# Route to render index.html template using data from Mongo
@app.route("/")
def home():

    # Return template and data
    return render_template("index.html")

@app.route("/comp_profiles")
def comp_profiles():

    profiles_data = mongo.db.comp_profiles.find_one()  
    print('profiles_data', profiles_data)
    
        
    # Return template and data
    return render_template("comp_profiles.html", profiles_data = profiles_data)


@app.route("/plots")
def plots():

    # Return template and data
    return render_template("plots.html")


@app.route("/charts")
def charts():

    # Return template and data
    return render_template("charts.html")



@app.route("/profiles")
def profiles():
#    """Return a list of tickers"""

    profiles_list = get_profiles_info()
    print('profile_list', profiles_list)
    return profiles_list
#

@app.route("/company/<ticker>")
def company(ticker):
#    """Return a company's profile"""

    company = get_company_info(ticker)

    return company



@app.route("/exp_charts/<ticker>")
def exp_charts(ticker):
    
    """Return the current ticker"""
    ticker_info = {"ticker" : ticker}
    
    return render_template("charts.html", ticker=ticker)





if __name__ == "__main__":
    app.run(debug=True)
