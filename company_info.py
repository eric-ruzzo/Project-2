import pandas as pd
import csv
import json
import requests
from config import py_api_key
from flask import Flask, jsonify
import pandas as pd
import csv



def get_profiles_info():
      profiles_url = f"https://www.quandl.com/api/v3/datatables/ZACKS/CP.json?api_key={py_api_key}"
      
      profiles_response = requests.get(profiles_url)
      profiles_json = profiles_response.json()

      profiles_data =profiles_json['datatable']['data']
      profiles_columns =profiles_json['datatable']['columns']

      column_names_0 =  [name for name in profiles_columns]

      col_array=[]
      count = 0
      for x in column_names_0: 
          column_0 = x["name"]
          col_array.append(column_0)
      
      data_0 =  [data for data in profiles_data]
      profiles_df = pd.DataFrame(data_0, columns = col_array)    

      profiles_list = profiles_df.values.tolist()

    return jsonify(profiles_list)



if __name__ == '__main__':
      profiles_jsonified = get_profiles_info()
        
    