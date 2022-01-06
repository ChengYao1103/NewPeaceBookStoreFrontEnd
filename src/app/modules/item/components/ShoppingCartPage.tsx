import {Modal} from 'bootstrap'
import React, {FC, useState} from 'react'
import {useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../system/helpers'
import {PageTitle} from '../../../../system/layout/core'
import {RootState} from '../../../../setup'
import {ItemState} from '../../item/redux/ItemRedux'
import {CartState, actions} from '../redux/CartRedux'
import {dispatch} from '../../../../setup/redux/Store'
import getItemAPI from '../API/GetItemsAPI'

const ShoppingCartPage: FC = () => {
  const CartState: CartState = useSelector((state: RootState) => state.cart)
  const itemState: ItemState = useSelector((state: RootState) => state.item)
  const [updateItemId, setUpdateItemId] = useState(0)
  const [updateQuantity, setUpdateQuantity] = useState(0)
  var totalPrice = 0

  const getUserName = (itemId: number) => {
    let item = itemState.items.find((item) => item.id === itemId)
    return item?.owner.name
  }

  const getInfo = (itemId: number) => {
    let item = itemState.items.find((item) => item.id === itemId)
    return item
    /*let item = await getItemAPI(itemId)
    if ('id' in item) {
      setItemPrice(item.price)
      setItemName(item.owner.name)
    }*/
  }

  const calculatePrice = (price: number | undefined, quantity: number) => {
    if (!price) {
      price = 0
    }
    let result = price * quantity
    totalPrice += result
    return result
  }

  const openUpdateModal = (id: number, quantity: number) => {
    let item = itemState.items.find((item) => item.id === id)
    if (item) {
      setUpdateItemId(id)
      setUpdateQuantity(quantity)
      new Modal('#updateModal').show()
    }
  }

  const deleteItem = async (id: number) => {
    await dispatch(actions.deleteCartItem(id))
    toast.success('已刪除商品')
  }

  const modifyItem = async () => {
    const item = await getItemAPI(updateItemId)
    if ('id' in item) {
      if (item.quantity >= updateQuantity) {
        dispatch(actions.updateCartItem(updateItemId, updateQuantity))
        toast.success(`已修改商品：${item.name}下訂數量為${updateQuantity}個`)
        setUpdateQuantity(0)
        setUpdateItemId(0)
        document.getElementById('updateModalCancel')?.click()
      } else {
        toast.error(`下訂數量不可大於商品存貨數量(${item.quantity}個)`)
      }
    } else {
      toast.error(item)
    }
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{`我的購物車`}</PageTitle>
      <div className='col-12'>
        <h5>賣家名稱：{getUserName(CartState.Carts[0]?.itemId) || '目前沒有任何商品！'}</h5>
        <div className='card card-xxl-stretch mb-5 mb-xxl-8'>
          <div className='table-responsive'>
            <table className='table table-hover table-rounded table-striped gy-4 gs-7 text-center align-middle'>
              <thead>
                <tr className='fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200'>
                  <th>名稱</th>
                  <th>數量</th>
                  <th>單價</th>
                  <th>總計</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {CartState.Carts.map((item) => (
                  <tr key={item.itemId}>
                    <td>{getInfo(item.itemId)?.name}</td>
                    <td>{item.quantity}</td>
                    <td>{getInfo(item.itemId)?.price}</td>
                    <td>{calculatePrice(getInfo(item.itemId)?.price, item.quantity)}</td>
                    <td>
                      <button
                        className='btn btn-primary btn-sm mx-2'
                        onClick={() => openUpdateModal(item.itemId, item.quantity)}
                      >
                        <i className='bi bi-pencil-square fs-5'></i>修改數量
                      </button>
                      <button
                        className='btn btn-danger btn-sm mx-2'
                        onClick={() => deleteItem(item.itemId)}
                      >
                        <i className='bi bi-trash-fill fs-5'></i>刪除
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className='fs-5 text-end'>
                    <h2>總計　${totalPrice}</h2>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* begin::修改數量的modal */}
        <div className='modal fade' tabIndex={-1} id='updateModal'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>修改商品數量</h5>
                <div
                  className='btn btn-icon btn-sm btn-active-light-primary ms-2'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                >
                  <KTSVG
                    path='/media/icons/duotune/arrows/arr061.svg'
                    className='svg-icon svg-icon-2x'
                  />
                </div>
              </div>
              <div className='modal-body'>
                <div className='row'>
                  <div className='col-12 mt-4'>
                    <label className='form-check-label' htmlFor={`updateQuentity`}>
                      商品數量
                    </label>
                    <input
                      id='updateQuentity'
                      value={updateQuantity}
                      min={1}
                      type='number'
                      className='form-control mt-1'
                      onChange={(e) => setUpdateQuantity(parseInt(e.target.value))}
                    ></input>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  id='updateModalCancel'
                  type='button'
                  className='btn btn-light'
                  data-bs-dismiss='modal'
                >
                  取消
                </button>
                <button type='button' className='btn btn-primary' onClick={(e) => modifyItem()}>
                  修改
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* end::修改數量的modal */}
        <div className='d-flex justify-content-end mt-8'>
          <button className='btn btn-primary'>
            <span className='indicator-label '>下訂</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default ShoppingCartPage