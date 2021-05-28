import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import {login,getbelow242,getavailable,breeding,get242,get242kid0,get246,get246kid0,getdie,burndie,getall,prizesent,adventure,letclaim,closealladventure,getbelow246,get246kid10,sellexperienced} from '../../main/main'

const Home = () => {
  const [availablelist, setAvailablelist] = useState([]);

  const [dielist, setDielist] = useState([]);
  
  const letbreed = ()=>{
    if(availablelist.length > 1){
      let items = [parseInt(availablelist[0].id),parseInt(availablelist[1].id)]
      let name = 'SP 246-248-254++'
      setAvailablelist(availablelist.slice(2))
      breeding(items,name)
      console.log(items)
      console.log(name)
    }else{
      console.log('availablelist below 2')
    }
  }

  const letburn = ()=>{
    if(dielist.length > 0){
      let items = []
      if(dielist.length > 400){
        items = dielist.slice(0,400)
      }else{
        items = dielist
      }
      burndie(items)
      setDielist(dielist.slice(400))
      console.log(items)
    }else{
      console.log('dielist is empty')
    }
  }

  const letadventure = ()=>{
    if(availablelist.length > 1){
      let item = availablelist[0]
      let slot = -1
      if(item.pe[3] == '0' ){
        slot = 3
      }else if(item.pe[4] == '0' ){
        slot = 4
      }
      setAvailablelist(availablelist.slice(1))

      if(slot == 3 || slot == 4){
        console.log(item)
        adventure([item.id],slot)
      }else{
        console.log('skip kolo alreay adventure 3,4 ');
      }
    }else{
      console.log('availablelist is empty')
    }
  }
  
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
          <h1>Pwd Kolobok Tool</h1>
          <div class="login">
              <input id="loginbtn" class="login" onClick={()=> login()} value="Login" type="button" />
          </div>
          <br/>
          <p style={{color : '#ef9d47'}} id="loginresponse"></p> 
          <p style={{color : '#ef9d47'}} id="autologin"></p>
          <br/>
          <input class="button" onClick={async ()=> setAvailablelist(await getavailable())} value="setavailable" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=>{console.log(availablelist)}} value="log available" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> letbreed()} value="letbreed" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> letadventure()} value="letadventure" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> closealladventure()} value="closealladventure" type="button" />
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <input class="button" onClick={()=> getbelow242()} value="get < 242" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> getbelow246()} value="get < 246" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> get242()} value="get242" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> get242kid0()} value="get242kid0" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> get246()} value="get246" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> get246kid0()} value="get246kid0" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> get246kid10()} value="get246kid10" type="button" />
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <input class="button" onClick={async ()=> setDielist(await getdie())} value="setdie" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> letburn()} value="letburn" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=>{console.log(dielist)}} value="logdielist" type="button" />
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <input class="button" onClick={()=> getall()} value="getall" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> prizesent()} value="prizesent" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> letclaim()} value="letclaim" type="button" />
          <br/>
          <br/>
          <input class="button" onClick={()=> sellexperienced()} value="sellexperienced" type="button" />
          <br/>
          <br/>
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

export default Home;