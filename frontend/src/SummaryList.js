import React, { Component }  from 'react';
import axios from 'axios';
import SummaryDisplay from './SummaryDisplay';

class SummaryList extends Component{
    constructor(){
        super();
        this.state={
            summary : [],
            titles: []
        }
    }

    //static async  getDerivedStateFromProps()  {
    fetchSummary = async () =>{
      const {activeLink} = this.props;
      let url = Object.values(activeLink);
        let title = Object.keys(activeLink);
        this.setState({titles:title})
        console.log(url);
        console.log(typeof(title))
        console.log(typeof(url))
        try {
          //if (Array.isArray(link)) { // Check for array of objects with title and url
            const summaries = [];
            // for (const item of url) {
              for (let i = 0; i < url.length; i++) {
              console.log('sending')
              console.log(url[i])
              const response = await axios.post(' http://127.0.0.1:5000/process_summary', { name: url[i], title: title[i] });
              console.log(response)
              summaries.push(response.data['output'] || []); // Add response or empty array
            }
            this.setState({ summary: summaries });
          // }
          // else{
          //   this.setState({summary: ['not an array']})
          // }
        } catch (error) {
          console.error(error);
        }
      };
      
    
    render(){           
        return(<>
        <button onClick={()=>this.fetchSummary()}>Load summaries</button>
        <br/>
        <br/>
        <button onClick={()=>window.print()}>Save Page</button>
            {console.log('list')}
            {/* {console.log(url)} */}
            {/* <h1>SummaryList</h1> */}
            <SummaryDisplay titles={this.state.titles} summaries={this.state.summary}/>
            {/* <p>{this.state.summary}</p> */}
            {/* {this.state.summary && this.state.summary.length > 0 && ( // Check for valid array and non-empty
              <>
            <ul>
                {this.state.summary.map((item, index) => (
                  <li key={index}> 
                    <p>{item}</p>
                    <br/><br/>
                  </li>
                
                )) }     
               </ul>
             </>)} */}
            </>
        )
    }
}

export default SummaryList;