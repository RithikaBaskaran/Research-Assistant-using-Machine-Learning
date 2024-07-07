import React, { Component }  from 'react';
import MethodDisplay from './MethoodDisplay';
import axios from 'axios';

class MethodList extends Component{
    constructor(){
        super();
        this.state={
            summary : [],
            titles: []
        }
    }

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
                const response = await axios.post(' http://127.0.0.1:5000/process_methodology', { name: url[i], title: title[i] });
                console.log(response)
                summaries.push(response.data['output'] || []); // Add response or empty array
              }
              this.setState({ summary: summaries });
          } catch (error) {
            console.error(error);
          }
        };
        
      

    render(){
        return(<>
            <button onClick={()=>this.fetchSummary()}>Load methodologies</button>
            <button onClick={()=>window.print()}>Save Page</button>
                {console.log('list')}
                <MethodDisplay titles={this.state.titles} summaries={this.state.summary}/>
                </>
            )
        }
    }
    
    
export default MethodList;