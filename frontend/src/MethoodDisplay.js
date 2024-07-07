import React, { Component }  from 'react';
class MethodDisplay extends Component{
    render(){
        const {titles,summaries} = this.props;
        const dataObj = titles.reduce((acc, title, index) => {
            acc[title] = summaries[index];
            return acc;
          }, {});
          var data = Object.keys(dataObj).map((key) => [key, dataObj[key]]);

          
    return(
        <>
        {console.log(data)}
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
        </>
    )}
}
export default MethodDisplay;