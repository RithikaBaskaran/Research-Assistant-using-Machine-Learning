import React, { Component }  from 'react';
import Navbar from "./Navbar";
import ResourceList from "./ResourceList";
import SummaryList from "./SummaryList";
import MethodList from "./MethodList";
import Images from "./Images";

class SinglePage extends Component{
    constructor(){
        super();
        this.state = {
            activeMenu: "resource"
        };
    }

    setActiveSection = (active) =>{
        this.setState({
            activeMenu: active
        })
        console.log(this.state.activeMenu)
    }

    changeToActiveSection = (activePdf)=>{
        if(this.state.activeMenu==='resource'){console.log(this.state.activeMenu)
            return(<ResourceList activeLink={activePdf}/>)
        }else if(this.state.activeMenu==='summary'){console.log(this.state.activeMenu)
            return(<SummaryList activeLink={activePdf}/>)
        }else if(this.state.activeMenu==='method'){console.log(this.state.activeMenu)
            return(<MethodList activeLink={activePdf}/>)
        }else if(this.state.activeMenu==='images'){console.log(this.state.activeMenu)
            return(<Images activeLink={activePdf}/>)
        }else{
            return(null)
        }
    }

    render(){
        const {activePdf} = this.props;
        console.log(activePdf)
        return( <>
            <h1>Extracted Information</h1>
            
            <Navbar setActiveSection={this.setActiveSection} activeMenu={this.state.activeMenu} handleMenu={this.handleMenu}/>
            {this.changeToActiveSection(activePdf)}
            </>
        )
    }
}
export default SinglePage;