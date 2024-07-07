import React, { Component }  from 'react';
class SummaryDisplay extends Component{
    render(){
        const {titles,summaries} = this.props;
        const dataObj = titles.reduce((acc, title, index) => {
            acc[title] = summaries[index];
            return acc;
          }, {});
          var data = Object.keys(dataObj).map((key) => [key, dataObj[key]]);

          
    return(
        <>
        {/* <h1>summary displaying</h1> */}
        {/* {console.log(titles)} */}
        {console.log(data)}
        {/* {data && data.length > 0 && ( // Check for valid array and non-empty
              <> */}
            <ul>
                {data.map((item, index) => (
                  <li key={index}> 
                    <h4>{item[0]}</h4>
                    {console.log(item[0])}
                    <p>{item[1]}</p>
                    <br/><br/>
                  </li>
                
                )) }    
              </ul>
            {/* </>)} */}
        </>
    )}
}
export default SummaryDisplay;