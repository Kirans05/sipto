import React, { useState } from 'react'
import axios from "axios"
import supabase from "../src/Config/supabaseClient"


const DT = () => {

    let [data, setData] = useState({"name":"iShares Ultra Short-Term Bond ETF","ticker":"ICSH","type":"ETF","exchange":"BTQ","description":"The fund seeks to achieve its investment objective by investing, under normal circumstances, at least 80% of its net assets in a portfolio of U.S. dollar-denominated investment-grade fixed- and floating-rate debt securities that are rated BBB- or higher by S&P Global Ratings and/or Fitch Ratings, Inc. (Fitch), or Baa3 or higher by Moody's Investors Service, Inc. (Moody's), or, if unrated, determined by the fund's management team to be of equivalent quality.","price":50.11,"previousClose":50.06,"change":0.05,"changePercent":0.1,"tags":[{"label":"Provider","value":"iShares"},{"label":"Category","value":"Ultrashort Bond"}],"summary":[{"type":"range","label":"52-Week Range","value":{"low":"$49.37","high":"$50.11"},"raw":{"low":49.37,"high":50.11}},{"type":"keyValue","label":"Expense Ratio","value":"0.08%","raw":0.08},{"type":"keyValue","label":"Volume","value":"663.77K","raw":663775},{"type":"keyValue","label":"Avg Volume","value":"1.23M","raw":1226291},{"type":"keyValue","label":"Dividend Yield","value":"1.16%","raw":1.16},{"type":"keyValue","label":"Beta","value":"0.07","raw":0.07}],"tabs":["overview","returns"],"volatility":0.03}
    )
    console.log(data)


    const clickHandler = async () => {
        try{
            let response = await supabase
                .from("new_assests_table")
                .insert([
                    {"name":"iShares Ultra Short-Term Bond ETF","ticker":"ICSH","type":"ETF","exchange":"BTQ","description":"The fund seeks to achieve its investment objective by investing, under normal circumstances, at least 80% of its net assets in a portfolio of U.S. dollar-denominated investment-grade fixed- and floating-rate debt securities that are rated BBB- or higher by S&P Global Ratings and/or Fitch Ratings, Inc. (Fitch), or Baa3 or higher by Moody's Investors Service, Inc. (Moody's), or, if unrated, determined by the fund's management team to be of equivalent quality.","price":50.11,"previousClose":50.06,"change":0.05,"changePercent":0.1,"tags":[{"label":"Provider","value":"iShares"},{"label":"Category","value":"Ultrashort Bond"}],"summary":[{"type":"range","label":"52-Week Range","value":{"low":"$49.37","high":"$50.11"},"raw":{"low":49.37,"high":50.11}},{"type":"keyValue","label":"Expense Ratio","value":"0.08%","raw":0.08},{"type":"keyValue","label":"Volume","value":"663.77K","raw":663775},{"type":"keyValue","label":"Avg Volume","value":"1.23M","raw":1226291},{"type":"keyValue","label":"Dividend Yield","value":"1.16%","raw":1.16},{"type":"keyValue","label":"Beta","value":"0.07","raw":0.07}],"tabs":["overview","returns"],
                    "volatility":0.03,
                    "holdings":[{"name":"Deutsche Bank AG 0.36%","assetsPercent":0.96},{"name":"7-Eleven Inc. 0.61%","assetsPercent":0.91},{"name":"NextEra Energy Capital Holdings Inc 0.42%","assetsPercent":0.8},{"name":"Coca-Cola Europacific Partners plc 0.5%","assetsPercent":0.74},{"name":"DEUTSCHE BK SPEARS/LIFERS TR VAR STS 0.27%","assetsPercent":0.73},{"name":"Duke Energy Progress Inc 0.34%","assetsPercent":0.67},{"name":"Chevron USA Inc 0.36%","assetsPercent":0.66},{"name":"Morgan Stanley 0.05%","assetsPercent":0.57},{"name":"Dominion Energy Inc 0.65%","assetsPercent":0.54},{"name":"Morgan Stanley 0.73%","assetsPercent":0.53}],
                    "returns":{"timeFrames":{"label":"Time Frame","value":[{"key":"1w","label":"1-Week Return"},{"key":"1m","label":"1-Month Return"},{"key":"3m","label":"3-Month Return"},{"key":"6m","label":"6-Month Return"},{"key":"1y","label":"1-Year Return"},{"key":"3y","label":"3-Year Return"},{"key":"5y","label":"5-Year Return"},{"key":"10y","label":"10-Year Return"}]},"current":{"label":"ICSH","raw":{"1w":0.13,"1m":0.49,"3m":0.88,"6m":1.23,"1y":0.86,"3y":2.58,"5y":8.19,"10y":11.84},"value":{"1w":{"profit":true,"value":"0.13%"},"1m":{"profit":true,"value":"0.49%"},"3m":{"profit":true,"value":"0.88%"},"6m":{"profit":true,"value":"1.23%"},"1y":{"profit":true,"value":"0.86%"},"3y":{"profit":true,"value":"2.58%"},"5y":{"profit":true,"value":"8.19%"},"10y":{"profit":true,"value":"11.84%"}}},"sp500":{"label":"S&P500","raw":{"1w":-0.76,"1m":-3.23,"3m":2.15,"6m":-0.13,"1y":-17.57,"3y":23.1,"5y":51.25,"10y":215.03},"value":{"1w":{"profit":false,"value":"-0.76%"},"1m":{"profit":false,"value":"-3.23%"},"3m":{"profit":true,"value":"2.15%"},"6m":{"profit":false,"value":"-0.13%"},"1y":{"profit":false,"value":"-17.57%"},"3y":{"profit":true,"value":"23.1%"},"5y":{"profit":true,"value":"51.25%"},"10y":{"profit":true,"value":"215.03%"}}},"returnsPreviousClose":{"1w":50.04,"1m":49.8619,"3m":49.6676,"6m":49.4981,"1y":49.6783,"3y":48.8439,"5y":46.3108,"10y":44.8011,"max":44.8011}}
                }
                ])


                console.log(response)
        }catch(err){

        }
    }

  return (
    <div>
        <h1>DT</h1>
        <button onClick={clickHandler}>Click</button>
    </div>
  )
}

export default DT