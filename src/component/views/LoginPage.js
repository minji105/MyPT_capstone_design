import axios from 'axios';
import React, {useEffect} from 'react'

import {useDispatch} from 'react-redux';
import {loginUser} from '../_actions/user_action.js'

function LoginPage(props) {     
  useEffect(() => {
    axios.post('http://localhost:3001/api/users/login')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const dispatch = useDispatch();
 
  const [Id, setId] = React.useState(" ")
  const [Pw, setPw] = React.useState(" ")

  const onIdHandler = (event) => {
    setId(event.currentTarget.value)
  }

  const onPwHandler = (event) => {
    setPw(event.currentTarget.value)
  }

  const onSubmitHandler = async (event) => {
        event.preventDefault(); //리프레시 방지-> 방지해야 이 아래 라인의 코드들 실행 가능 
 
        let body={
            id: Id,
            pw: Pw
        }
 
        // dispatch(loginUser(body))
        // .then(response => {
        //     if(response.payload.loginSuccess) {
        //         props.history.push('/')             //리액트에서 페이지 이동하기 위해서는 props.history.push() 이용.
        //     } else{
        //         alert(' Error')
        //     }
        // })
        try {
          const response = await dispatch(loginUser(body));
  
          if (response.payload.loginSuccess) {
              props.history.push('/');
          } else {
              alert('Error');
              console.log('로그인 실패')
          }
        } catch (error) {
            console.log(error);
        }
    }
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
    width: '100%', height: '100vh'}}>
      
    <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
      <label>Id</label>
      <input type="id" value={Id} onChange={onIdHandler} />
      <label>Password</label>
      <input type="pw" value={Pw} onChange={onPwHandler} />
      <br />
      <button>
        Login
      </button>
    </form>

    </div>
  )
}

export default LoginPage