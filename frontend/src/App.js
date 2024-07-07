import React, { Component }  from 'react';
import SearchBar from "./SearchBar";
// import Navbar from "./Navbar";
import SinglePage from "./SinglePage";

class App extends Component{
    constructor(){
        super();
        this.state = {
            activePdf: ''
        };
    }

    componentDidMount () {
        // const script = document.createElement("script");
    
        // script.src = "main.py";
        // script.async = true;
    
        // document.body.appendChild(script);
    }

    handleMenu(val){
       // this.setState({
            console.log(val)
         //   activeMenu: val
       // })
    }

    goToSinglePdf = (link) =>{
        console.log(link);
        this.setState({
          activePdf: link
        })
      }  

    render(){
        return( 
        <>
            <h1>Research Assistant</h1>
            <SearchBar goToSinglePdf={this.goToSinglePdf} />
            <br/>
            {this.state.activePdf?<SinglePage activePdf={this.state.activePdf}/>:null}
            {/* <Navbar activeMenu={this.state.activeMenu} handleMenu={this.handleMenu}/>*/}</> 
        )
    }
}
export default App;