import React, { Fragment, useState  } from 'react';
import { Link } from 'react-router-dom';
import { calc } from '../../main/calculator';
// import { connect } from 'react-redux';

const Calculator = () => {
    const [formData, setFormData] = useState({
        gnome: '',
      });
    
    const {gnome} = formData;
    
    const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onSubmit = async e => {
        e.preventDefault();
        calc()
    };

    return (
        <Fragment>
            <div class="container">
            <div>
                <nav class="nav nav-masthead justify-content-center float-md-end">
                <Link to='/' aria-current="page" className='nav-link'>Main</Link>
              <Link to='/calculator' className='nav-link'>Stealth/Speed Checker</Link>
                </nav>
            </div>
            <br/>
            <h1>Kolobok Checker</h1>
            <h4 style={{color : '#98ef47'}}>Make sure you use the GENOME code!</h4>
            <form onSubmit={e => onSubmit(e)}>
                    <div class="fields">
                        <input 
                            style={{width : '100%'}} 
                            id="hash" 
                            type="text" required
                            placeholder="Kolobok Genome" 
                            name='gnome'
                            value={gnome}
                            onChange={e => onChange(e)}
                        /> 
                        <input class="submit" onClick={calc} value="Check" type="button" />
                    </div>
                    <br/>
                    <p style={{color : '#98ef47', fontSize : 'larger'}} id="genresponse"></p> 
                    <p style={{color : '#98ef47'}} id="genname"></p>
            </form>
            <br/><br/>
            </div>        
        </Fragment>
  );
};

// const mapStateToProps = state => ({
//   auth: state.auth,
//   profile: state.profile
// });

// export default connect(
//   mapStateToProps,
//   { getCurrentProfile, deleteAccount }
// )(Dashboard);

export default Calculator;