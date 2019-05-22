import React, { Component } from 'react'
import SingleFriend from './SingleFriend'
import ListItem from '../Elements/ListItem'

class FriendsList extends Component {
  state = {
    viewFriend: {},
    listFadeBottom: false,
    listFadeTop: false,
  }

  viewFriend = friend => {
    this.setState({ viewFriend: friend })
  }

  viewList = () => {
    this.setState({ viewFriend: {} })
  }

  scrollListener = e => {
    const atBottom =
      this.list.scrollTop + this.list.clientHeight >=
      this.list.scrollHeight - 10
    const atTop = this.list.scrollTop <= 10
    console.log(atTop)

    if (atTop && this.state.listFadeTop) {
      this.setState({ listFadeTop: false })
    }

    if (!atTop && !this.state.listFadeTop) {
      this.setState({ listFadeTop: true })
    }

    if (atBottom && this.state.listFadeBottom) {
      this.setState({ listFadeBottom: false })
    }

    if (!atBottom && !this.state.listFadeBottom) {
      this.setState({ listFadeBottom: true })
    }
  }

  componentDidMount = async () => {
    await this.props.fetchFriends()

    if (this.list) {
      this.list.addEventListener('scroll', e => this.scrollListener(e))
      const isLongList = this.list.scrollHeight > this.list.clientHeight
      if (isLongList) {
        await this.setState({
          listFadeBottom: true,
        })
      }
    }
  }

  componentWillUnmount() {
    if (this.list) {
      this.list.removeEventListener('scroll', e => this.scrollListener(e))
    }
  }

  render() {
    const { friends } = this.props
    const { viewFriend, listFadeBottom, listFadeTop } = this.state
    return (
      <div id='friends-list'>
        {viewFriend.hasOwnProperty('email') ? (
          <div>
            <div className='button' onClick={this.viewList}>
              Back to list
            </div>
            <br />
            <SingleFriend backToList={this.viewList} friend={viewFriend}/>
          </div>
        ) : friends[0] ? (
          <div>
            <div>Your friends:</div>
            <br />
            <div
              className={
                listFadeBottom && listFadeTop
                  ? 'actual-list fade-top fade-bottom'
                  : listFadeBottom
                  ? 'actual-list fade-bottom'
                  : listFadeTop
                  ? 'actual-list fade-top'
                  : 'actual-list'
              }
              ref={node => (this.list = node)}>
              <br />
              {friends.map(group => {
                return (
                  <ListItem
                    key={group.id}
                    error={false}
                    content={group}
                    clickAction={this.viewFriend}
                    leftIcon={
                      group.avatarURL ? group.avatarURL : './images/people.svg'
                    }
                  />
                )
              })}
            </div>
          </div>
        ) : (
          <ListItem
            key={'error-list-item'}
            error={true}
            content={{ error: 'You have no groups.' }}
          />
        )}
      </div>
    )
  }

  // render() {
  //   const { friends } = this.props
  //   const { viewFriend } = this.state
  //   return (
  //     <div id='friends-list'>
  //       {viewFriend.hasOwnProperty('email') ? (
  //         <div>
  //            <div className='button' onClick={this.viewList}>
  //             Back to list
  //           </div>
  //           <br/>
  //           <SingleFriend backToList={this.viewList} friend={viewFriend}/>
            
           
  //         </div>
  //       ) : friends[0] ? (
  //         <div>
  //           <div>Your friends:</div>
  //           <br />
  //           {friends.map(friend => {
  //             return (
  //               <ListItem
  //                 key={friend.email}
  //                 error={false}
  //                 content={friend}
  //                 clickAction={this.viewFriend}
  //                 leftIcon={
  //                   friend.avatarURL ? friend.avatarURL : './images/person.svg'
  //                 }
  //               />
  //             )
  //           })}
  //         </div>
  //       ) : (
  //         <ListItem key={'error-list-item'} error={true} content={{error: 'You have no friends.'}} />
  //       )}
  //     </div>
  //   )
  // }
}

export default FriendsList
