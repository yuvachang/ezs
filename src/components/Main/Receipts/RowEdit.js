import React, { Component } from 'react'
import SelectUser from './SelectUser'

class RowEdit extends Component {
  state = {
    cost: '',
    delete: false,
    item: '',
    users: [],
  }

  addUser = async user => {
    // add user to row
    await this.setState({
      users: [...this.state.users, { id: user.id, name: user.name }],
    })

    // await this.updateUserAmountsAndRow()
  }

  removeUser = async userId => {
    // remove user from row
    await this.setState({
      users: this.state.users.filter(user => user.id !== userId),
    })

    // update userAmounts
    //// delete rowIdx key from userAmounts.items
    // await this.updateUserAmountsAndRow(userId)
  }

  sumCosts = obj => {
    const vals = Object.values(obj)
    if (vals.length) {
      return vals.reduce((a, b) => a + b).toFixed(2)
    } else return 0
  }

  usersChanged = () => {
    const state = this.state.users
    const row = this.props.row.users

    console.log('USERSCHANGED', state, row)
    if (state.length !== row.length) return true
    const hash = {}
    state.forEach(user => {
      hash[user.id] = 1
    })
    for (let i = 0; i < row.length; i++) {
      if (!hash[row[i].id]) return true
    }

    console.log('USERSCHANGED: FALSE')
    return false
  }

  updateUserAmountsAndRow = async (removedUserId, deleteRow) => {
    //only called when add/remove users & delete row that has users
    const { userAmounts, rowIdx, row } = this.props
    const { users, cost } = this.state
    console.log(row.cost, cost)

    // dont update if nothing changed
    if (!this.usersChanged() && row.cost === cost) return

    const usersIds = users.map(user => user.id)
    const amount = cost / users.length
    Object.keys(userAmounts).forEach(userId => {
      if (usersIds.includes(userId)) {
        userAmounts[userId].items[rowIdx] = amount
      } else {
        delete userAmounts[userId].items[rowIdx]
      }
      userAmounts[userId].amount = this.sumCosts(userAmounts[userId].items)
    })

    console.log('usrAmts', userAmounts, 'users', users)

    this.updateRow(userAmounts)
  }

  handleChange = e => {
    //// if cost is changed, then userAmounts have to change.

    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      // defocus and trigger onBlur method
      e.target.blur()
    }
  }

  onBlur = async e => {
    const val = e.target.value
    const name = e.target.name
    const row = this.props.row
    const state = this.state

    if (state[name] !== val || row[name] !== val) {
      // update state
      await this.setState({
        [name]: val,
      })

      // if price changed, update userAmounts
      if (name === 'cost') {
        await this.updateUserAmountsAndRow()
      }

      // else only update row
      else await this.updateRow()
    }
  }

  updateRow = async userAmounts => {
    const { rowIdx, updateRow } = this.props
    if (userAmounts) {
      await updateRow(rowIdx, this.state, userAmounts)
    } else {
      await updateRow(rowIdx, this.state, null)
    }
  }

  componentDidUpdate = async prevProps => {
    if (prevProps.row !== this.props.row) {
      await this.setState({
        ...this.props.row,
      })
    }
  }

  componentDidMount = () => {
    this.setState({
      ...this.props.row,
    })
  }

  render() {
    const { row, stopEdit, userAmounts } = this.props
    const { users } = this.state

    return (
      <tr>
        <td className='editbutton'>
          <img src='/images/edit.svg' className='icon' onClick={stopEdit} />
        </td>
        <td className='item'>
          <input
            // className='row-input'
            name='item'
            type='text'
            onBlur={this.onBlur}
            onKeyDown={this.onKeyDown}
            value={this.state.item}
            onChange={this.handleChange}
          />
        </td>
        <td className='cost'>
          <input
            // className='row-input'
            name='cost'
            type='number'
            min='0.00'
            max='9999.99'
            step='0.01'
            onBlur={this.onBlur}
            onKeyDown={this.onKeyDown}
            value={this.state.cost}
            onChange={this.handleChange}
          />
        </td>
        <td className='users'>
          <SelectUser
            userAmounts={userAmounts}
            removeUser={this.removeUser}
            addUser={this.addUser}
            users={users}
            updateUserAmounts={this.updateUserAmountsAndRow}
          />
        </td>
        <td className='deletebutton'>
          <img src='/images/trash.svg' className='icon' />
        </td>
      </tr>
    )
  }
}

export default RowEdit
