import React, { useEffect, useState } from 'react'
import axios from 'axios' 
import styled from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const InputName = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
  margin: 12px 0;
`

const CurrentStatus = styled.div`
  font-size: 19px;
  margin: 8px 0 12px 0;
  font-weight: bold;
`

const IsCompeletedButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  background: #f2a115;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

const EditButton = styled.button`
  color: white;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  margin: 0 10px;
  background: #0ac620;
  border-radius: 3px;
  border: none;
`

const DeleteButton = styled.button`
  color: #fff;
  font-size: 17px;
  font-weight: 500;
  padding: 5px 10px;
  background: #f54242;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`

toast.configure()

function EditTodo (props) {
  const initialTodoState = {
    id: null,
    name: "",
    is_completed: false
  }

  const [currentTodo, setCurrentTodo] = useState(initialTodoState)

  //toast message
  const notify = () => {
    toast.success('Todo successfully updated!', {
      position: 'bottom-center',
      hideProgressBar: true
    })
  }

  //id番のtodoを取得する
  const getTodo = id => {
    axios.get(`/api/v1/todos/${id}`) //showアクションでtodoオブジェクトが返る
    .then(resp => {
      setCurrentTodo(resp.data);
    })
    .catch(e => {
      console.log(e);
    });
  };

  /*
    引数： 
      first: 関数：todo取得、props.match.params.idでURLからidを取得できる
      second: props.match.params.idが変わるとuseEffectが動く指定

  */
  useEffect(() => {
    getTodo(props.match.params.id) //
  }, [props.match.params.id]);

  const handleInputChaged = event => {
    const { name, value } = event.target;  // {name, value } = {カラム名, その値}
    setCurrentTodo({ ...currentTodo, [name]: value }) //スプレッド構文で展開して、[カラム名]: 値
  }

  const updateIsCompleted = val => {
    //レコードの更新準備
    var data = {
      id: val.id,
      name: val.name,
      is_completed: !val.is_completed
    }
    axios.patch(`/api/v1/todos/${val.id}`, data)
    //レコードの更新ここまで

    //レコードの表示の更新
    .then(resp => {
      setCurrentTodo(resp.data)
    })
  }

  const updateTodo = () => {
    axios.patch(`/api/v1/todos/${currentTodo.id}`, currentTodo)
    .then(resp => {
      notify()
      props.history.push('/todos')
    })
    .catch(e => {
      console.log(e)
    })
  }

  const deleteTodo = () => {
    const sure = window.confirm('Are you sure?')
    if (sure) {
      axios.delete(`/api/v1/todos/${currentTodo.id}`)
      .then(resp => {
        props.history.push('/todos')
      })
    }
  }


  return (
    <>
      <h1>Editing Todo</h1>
      <div>
        <div>
          <label htmlFor="name">Current Name</label>
          <InputName 
            type="text"
            name="name"
            value={currentTodo.name}
            onChange={handleInputChaged}
          />

          <div>
            <span>Current Status</span><br/>
            <CurrentStatus>
              { currentTodo.is_completed ? "Completed" : "Uncompleted" }
            </CurrentStatus>
          </div>
        </div>

        {currentTodo.is_completed ? (
          <IsCompeletedButton
            className="badge badge-primary mr-2"
            onClick={() => updateIsCompleted(currentTodo)}
          >
            UnCompleted
          </IsCompeletedButton>
        ) : (
          <IsCompeletedButton
            className="badge badge-primary mr-2"
            onClick={() => updateIsCompleted(currentTodo)}
          >
            Completed
          </IsCompeletedButton>
        )}

        <EditButton
          type="submit"
          onClick={updateTodo}
        >
          Update
        </EditButton>

        <DeleteButton
          className="badge badge-danger mr-2"
          onClick={deleteTodo}
        >
          Delete
        </DeleteButton>
      </div>
    </>
  )
}

export default EditTodo