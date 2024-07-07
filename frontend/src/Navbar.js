import React, { Component }  from 'react';
import styles from "./css/NavBar.module.css";
// import ResourceList from "./ResourceList";
// import SummaryList from "./SummaryList";
// import MethodList from  "./MethodList";
// import MyButton from "./MyButton";
//import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

class Navbar extends Component{

    render(){
        const {setActiveSection} = this.props;
        return(<>
            {/* <Router>
                <nav className={styles.navbar}>
                    <ul className={styles.navlist}>
                        <MyButton to="resources" />
                        <MyButton to="summary" />
                        <MyButton to="method" />
                    </ul>
                </nav>
                <Routes>
                    <Route path="/resources" 
                        element={<ResourceList />} />
                    <Route path="/summary"
                        element={<SummaryList />} />
                    <Route path="/method"
                        element={<MethodList />} />
                </Routes>
            </Router> */}

            <nav className={styles.navbar}>
            <ul className={styles.navlist}>
            <li onClick={()=>setActiveSection('resource')}>Resource Link</li>
            <li onClick={()=>setActiveSection('summary')}>Summary </li>
            <li onClick={()=>setActiveSection('method')}>Methodology</li>
            <li onClick={()=>setActiveSection('images')}>Images</li>
        </ul></nav>
            </>
        )
    }
}
export default Navbar;