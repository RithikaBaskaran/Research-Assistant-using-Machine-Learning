import { Component } from "react";
import styles from "./css/search.module.css";
import React from 'react';
import axios from 'axios';

export default class SearchBar extends Component{
    constructor(props) {
        super(props);
        this.state = {
          inputValue: '',
          output: '',
          pdfLinks: [],
          input:'',
          htmlLinks: [],
          pageNo: 1
        };
      }

    handlePage = (page) =>{
      this.setState({
        pageNo: page
      })
      this.handleSubmit()
    }

    
    handleSubmit=async () => {
      // ()=>
      // this.props.setActiveSection('resource')
      try {
        console.log(this.state.inputValue)
            const response = await axios.post(' http://127.0.0.1:5000/process_data', { name: this.state.inputValue, page: this.state.pageNo });
            console.log(response.data)
            //this.setState({ output: response.data });
            //const {pdf_Links, html_Links} = response.data;
            this.setState({ pdfLinks: response.data.pdf_links || [] , htmlLinks: response.data.html_links||[]});
            console.log(this.state.pdfLinks)
            console.log(this.state.htmlLinks)
            this.props.goToSinglePdf(this.state.pdfLinks)
          } catch (error) {
            console.error(error);
          }
      };
    render(){
      const {pdfLinks, htmlLinks} = this.state;
      // const {goToSinglePdf} = this.props;
      const pdfEntries = Object.entries(pdfLinks);
      const htmlEntries = Object.entries(htmlLinks);
        return(
            <>
            <div>
              {/* <form onSubmit={this.handleSubmit}>  */}
              <div className={styles.searchbar}><input type="text" className={styles.searchbox} value={this.state.inputValue} onChange={(e) => this.setState({ inputValue: e.target.value })} />
              <button onClick={this.handleSubmit}>Search</button></div>
              {/* </form> */}
              <br/>
              
                {console.log(pdfEntries)}
              {pdfEntries && pdfEntries.length > 0 && ( // Check for valid array and non-empty
              <>
              <div>Results: </div>
              <ul>
                {pdfEntries.map((item, index) => (
                  <li className={styles.listItem} key={index}> 
                   {/* onClick={()=>goToSinglePdf(item)} */}
                   
                    {item[0].toString()}
                    {/* <a className={styles.links} href={item[1]} target="_blank" rel="noopener noreferrer">{}</a><br/> */}
                    <br/><br/>
                  </li>
                
                )) }    
              </ul>
              
              </>
              
            )}

{htmlEntries && htmlEntries.length > 0 && ( // Check for valid array and non-empty
              <>
              <div>pdf unavailable:</div>
              <ul>
                {htmlEntries.map((item, index) => (
                  <li className={styles.listItem} key={index}>
                     {/* onClick={()=>goToSinglePdf(item)}> */}
                    {item[0].toString()}
                    {/* <a className={styles.links} href={item[1]} target="_blank" rel="noopener noreferrer">{}</a><br/> */}
                    <br/><br/>
                  </li>
                ))}

                
              </ul>
              </>
            )}

            {pdfEntries.length===0 && htmlEntries.length === 0 && ( // Display message for empty list
              <p>Enter your research topic and please wait...</p>
            )}
              <button onClick={()=>this.handlePage(1)}>1</button>
              <button onClick={()=>this.handlePage(2)}>2</button>
              <button onClick={()=>this.handlePage(3)}>3</button>
              <button onClick={()=>this.handlePage(4)}>4</button>
              <button onClick={()=>this.handlePage(5)}>5</button>
              <button onClick={()=>this.handlePage(6)}>6</button>
              <button onClick={()=>this.handlePage(7)}>7</button>
              <button onClick={()=>this.handlePage(8)}>8</button>
              <button onClick={()=>this.handlePage(9)}>9</button>
              <button onClick={()=>this.handlePage(10)}>10</button>
            </div>
            </>
        )
    }
}