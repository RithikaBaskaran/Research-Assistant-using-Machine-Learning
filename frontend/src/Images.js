import React, { Component }  from 'react';
import axios from 'axios';
import ImageDisplay from './ImageDisplay';

class Images extends Component{
    constructor(){
        super();
        this.state={
            // summary : [],
            titles: []
        }
    }

    fetchImages = async () =>{
        const {activeLink} = this.props;
        let url = Object.values(activeLink);
          let title = Object.keys(activeLink);
          this.setState({titles:title})
          console.log(url);
          console.log(typeof(title))
          console.log(typeof(url))
          try {
            //if (Array.isArray(link)) { // Check for array of objects with title and url
              // const summaries = [];
              // for (const item of url) {
                for (let i = 0; i < url.length; i++) {
                console.log('sending')
                console.log(url[i])
                const response = await axios.post(' http://127.0.0.1:5000/process_images', { name: url[i], title: title[i] });
                console.log(response)
                // summaries.push(response.data['output'] || []); // Add response or empty array
              }
            //   this.setState({ summary: summaries });
          } catch (error) {
            console.error(error);
          }
        };
    render(){
        return(<>
            {console.log('list')}
            <h1>Images</h1>
            <button onClick={()=>this.fetchImages()}>Download images</button>
            {/* <button onClick={()=>window.print()}>Save Page</button> */}
            {/* <ImageDisplay titles={["Nigerian_football_federation,_corruption_and_development_of_football_in_Nigeri"]}/> */}
            {/* // {['Cars_buyers_and_fuel_economy']}/> */}
            {/* // {this.state.titles}{/> */}
            </>
        )
    }
}

export default Images;