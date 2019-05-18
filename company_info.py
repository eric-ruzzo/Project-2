import pandas as pd
import csv
import json
import requests
from config import q_api_key
from flask import Flask, jsonify
import pandas as pd
import csv



def get_profiles_info():
      profiles_url = f"https://www.quandl.com/api/v3/datatables/ZACKS/CP.json?api_key={q_api_key}"
      print('profiles_url', profiles_url)
      profiles_response = requests.get(profiles_url)
      profiles_json = profiles_response.json()

      profiles_data =profiles_json['datatable']['data']
      profiles_columns =profiles_json['datatable']['columns']

      column_names_0 =  [name for name in profiles_columns]

      col_array=[]
      for x in column_names_0: 
          column_0 = x["name"]
          col_array.append(column_0)
      
      data_0 =  [data for data in profiles_data]
      profiles_df = pd.DataFrame(data_0, columns = col_array)    
    
#      profile_df = profiles_df[["ticker", "comp_name", "comp_desc", "address_line_1", "city", "state_code", "phone_nbr", "email", "comp_url", "zacks_x_ind_desc", "market_val", "tot_revenue_f0", "net_income_f0","pe_ratio_f1", "div_yield"]]
          
      profile_dict = {"ticker" : profiles_df.ticker.values.tolist(), 
                     "comp_name" : profiles_df.comp_name.values.tolist(), 
                     "comp_desc" : profiles_df.comp_desc.values.tolist(), 
                     "address_line_1" : profiles_df.address_line_1.values.tolist(),
                     "city" : profiles_df.city.values.tolist(),
                     "state_code" : profiles_df.state_code.values.tolist(),
                     "phone_nbr" : profiles_df.phone_nbr.values.tolist(),
                     "email" : profiles_df.email.values.tolist(),
                     "comp_url" : profiles_df.comp_url.values.tolist(),
                     "zacks_x_ind_desc" : profiles_df.zacks_x_ind_desc.values.tolist(),
                     "market_val" : profiles_df.market_val.values.tolist(),
                     "tot_revenue_f0" : profiles_df.tot_revenue_f0.values.tolist(),
                     "net_income_f0" : profiles_df.net_income_f0.values.tolist(),
                     "pe_ratio_f1" : profiles_df.pe_ratio_f1.values.tolist(),
                     "div_yield" : profiles_df.div_yield.values.tolist(),
                     "rating_strong_buys" : profiles_df.rating_cnt_strong_buys.values.tolist(),
                     "rating_strong_sells" : profiles_df.rating_cnt_strong_sells.values.tolist(),
                     "rating_buys" : profiles_df.rating_cnt_buys.values.tolist(),
                     "rating_sells" : profiles_df.rating_cnt_sells.values.tolist(),
                     "rating_holds" : profiles_df.rating_cnt_holds.values.tolist(),
                     }
#     print('company_info.py - profile _dict', profile_dict)  
#      return jsonify(profile_dict)
      return profile_dict

def get_company_info(ticker):
    
      company_url=f'https://www.quandl.com/api/v3/datatables/ZACKS/AR?m_ticker={ticker}&ticker={ticker}&api_key={q_api_key}'
      print('company_url', company_url)
      ticker_response = requests.get(company_url)
      ticker_json = ticker_response.json()

      company_data = ticker_json['datatable']['data']
      company_columns = ticker_json['datatable']['columns']

      column_names_0 =  [name for name in company_columns]

      col_array=[]
      for x in column_names_0: 
          column_0 = x["name"]
          col_array.append(column_0)
      
      data_0 =  [data for data in company_data]
      ticker_df = pd.DataFrame(data_0, columns = col_array)    
      
      ticker_dict = ticker_df.to_dict()

      return jsonify(ticker_dict)



if __name__ == '__main__':
#      profiles_jsonified = get_profiles_info()
      print(profiles_list)
        
    