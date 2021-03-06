import React, {useState, useEffect} from 'react';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'

import {connect} from 'react-redux'

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [langFiltre, setLangFiltre] = useState('')


  useEffect(() => {
    const getWishlist = async() => {
      const data = await fetch(`/initiate-wishlist`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `token=${props.token}`
      });
      const wishlist = await data.json();
      console.log('wishlist', wishlist);
      props.initiateWishlist(wishlist);
    }
    getWishlist();
  }, [])

  var handleClickDelete = async function (title) {
    const data = await fetch(`/delete-article/${title}/${props.token}`, {
      method: 'DELETE'
    })
    const body = await data.json();

    props.deleteToWishList(title);
  }

  // MODAL
  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)
  }
  var handleOk = e => {
    console.log(e)
    setVisible(false)
  }
  var handleCancel = e => {
    console.log(e)
    setVisible(false)
  }
  var noArticles
  if(props.myArticles == 0){
    noArticles = <div style={{marginTop:"30px"}}>No Articles</div>
  }

  return (
    <div>
         
            <Nav/>

            <div className="Banner"/>

            {noArticles}

            <div className="Card">
    

            {props.myArticles.map((article,i) => (
                <div key={i} style={{display:'flex',justifyContent:'center'}}>

                  <Card
                    
                    style={{ 
                    width: 300, 
                    margin:'15px', 
                    display:'flex',
                    flexDirection: 'column',
                    justifyContent:'space-between' }}
                    cover={
                    <img
                        alt="example"
                        src={article.urlToImage}
                    />
                    }
                    actions={[
                        <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title,article.content)} />,
                        <Icon type="delete" key="ellipsis" onClick={() => handleClickDelete(article.title)} />
                    ]}
                    >

                    <Meta
                      title={article.title}
                      description={article.description}
                    />

                  </Card>
                  <Modal
                    title={title}
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p>{content}</p>
                  </Modal>

                </div>

              ))}



       

                

             </div>
      
 

      </div>
  );
}

function mapStateToProps(state){
  return {
    myArticles: state.wishList,
    token: state.token
  }
}

function mapDispatchToProps(dispatch){
  return {
    deleteToWishList: function(articleTitle){
      dispatch({type: 'deleteArticle',
        title: articleTitle
      })
    },
    initiateWishlist: function(wishlist){
      dispatch(
        {type: 'initiate',
        wishlist: wishlist
      })
    }
  }
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);
