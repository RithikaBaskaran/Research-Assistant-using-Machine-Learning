import React, { Component } from "react";
import linkstyles from "./css/SinglePage.module.css";

class ResourceList extends Component{
    render(){
        const {activeLink} = this.props;
        const activeArray = Object.entries(activeLink).map(([title, url]) => {
          return { title, url };
        });
        
        console.log(activeArray);
        return(<>
            {console.log('list')}
            {console.log(activeLink)}<br/><br/>
            
            {activeArray && activeArray.length > 0 && ( // Check for valid array and non-empty
              <>
            <ul>
                {activeArray.map((item, index) => (
                  <li key={index}> 
                   {/* onClick={()=>goToSinglePdf(item)} */}
                   
                    {/* {item[0].toString()} */}
                    <h4>{item['title']}</h4>
                    <a className={linkstyles.resource} href={item['url']} target="_blank" rel="noopener noreferrer">{item['url']}</a>
                    <br/><br/>
                  </li>
                
                )) }    
              </ul>
            </>)}
            </>
        )
    }
}

export default ResourceList;