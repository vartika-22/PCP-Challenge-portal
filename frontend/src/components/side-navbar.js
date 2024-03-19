import React,{useState} from 'react'
import '../css/side-navbar.css';
import {NavLink} from 'react-router-dom';
import {FaBars, FaTimes} from 'react-icons/fa';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';




const Navbar=({children})=>{
  const[isOpen,setisOpen] = useState(false);
  const toggle = ()=> setisOpen(!isOpen);
  const menuItem=[
    
    {
      path:'/dash',
      name:'Home',
      icon:<i class="fa-solid fa-house"></i>,
      texts:'home'
    },
    {
      path:'/Leaderboard',
      name:'Leaderboard',
      icon:<i class="fa-solid fa-trophy"></i>,
      texts:"Leaderboard"
    },
    {
      path:'/Analytics',
      name:'Analytics',
      icon:<i class="fa-solid fa-chart-simple"></i>,
      texts:"Analytics"
    },
   
  ];

  const menuItem2=[
    {
      path:'/Challenges',
      name:'challenges',
      icon:<i class="fa-solid fa-pen"></i>,
      texts:"challenges"


    },
  ];

  const  menuItem3=[
    {
      path:'/profile',
      name:' user Profile',
      icon:<i class="fa-solid fa-user"></i>,
      texts:"searchbar"

    },
    {
      path:'/',
      name:'Logout',
      icon:<PowerSettingsNewIcon/>,
      texts:"profile"
    },
  ];



  return(
    <div className='main-container'>
    <div className='custom-container'
    style={{width:isOpen?'20%':'8%'}}
    
    >
    <div className='custom-sidebar'
    >
     <div className='custom-topsection'
     style={{height:isOpen?'':'60px'}}
     >
       <div className='logo'
       style={{display: isOpen?'block':'none'}}>
       <h1
       
       >PCP</h1>
       </div>
       <div className='custom-bars'>
       {isOpen ? (
        <FaTimes onClick={toggle} />
      ) : (
        <FaBars onClick={toggle} />
      )}
          </div>
     </div>


     {/*item lists 1*/}

     <div className='custom-sidebar-list'>
     <h3 style={{color:isOpen?'black':'white',marginLeft:isOpen?'':'11px'}}>{isOpen?'':'...'}
     </h3>
     {menuItem.map((item,index)=>(

      <NavLink
      to={item.path}
      key={index}
      className='custom-sidebar-item-container'
      >
      <div className='custom-sidebar-item-1'>
      {item.icon}
      </div>
      <div className='custom-sidebar-item-2'style={{display:isOpen?'flex':'none'}}>{item.name}</div>
      
      
      
      
      </NavLink>
     ))}
     </div>
     {/*item lists 2*/}
     <div className='custom-sidebar-list'>
     <h3 style={{color:isOpen?'black':'white',marginLeft:isOpen?'':'11px'}}>{isOpen?'':'...'}
     </h3>

     {menuItem2.map((item,index)=>(
      <NavLink
      to={item.path} 
      key={index}
      className='custom-sidebar-item-container'
      >
      <div className='custom-sidebar-item-1'>
      
      {item.icon}
      </div>
      <div className='custom-sidebar-item-2'style={{display:isOpen?'flex':'none'}}>{item.name}</div>
      
      
      </NavLink>
     ))}
     </div>
     {/*item list 2*/ }
     <div className='custom-sidebar-list'>
     <h3 style={{color:isOpen?'black':'white',marginLeft:isOpen?'':'11px'}}>{isOpen?'':'...'}
     </h3>

     {menuItem3.map((item,index)=>(
      <NavLink
      to={item.path} 
      key={index}
      className='custom-sidebar-item-container ext'
      >
      <div className='custom-sidebar-item-1'>
      {item.icon}
      </div>
      <div className='custom-sidebar-item-2'style={{display:isOpen?'flex':'none'}}>{item.name}</div>
      
      
      </NavLink>
     ))}
     </div>


    
    </div>

    
   
    
    
    
  </div>
  
  <main className='sub-main-container'
  style={{width:isOpen?'80%':'92%'}}
  
  
  >
  {children}
  </main></div>
  
  
  
  
 
  
  );
}

export default Navbar;