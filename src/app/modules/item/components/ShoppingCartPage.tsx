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
import {ItemModel} from '../redux/ItemModel'
import getItemAPI from '../API/GetItemAPI'
import {serialize} from 'v8'

const ShoppingCartPage: FC = () => {
  const CartState: CartState = useSelector((state: RootState) => state.cart)
  const itemState: ItemState = useSelector((state: RootState) => state.item)
  const [load, setLoad] = useState(false)
  const [checkedCount, setCheckedCount] = useState(0)
  const [checkedItems, setCheckedItems] = useState([] as ItemModel[])
  const [updateItemId, setUpdateItemId] = useState(0)
  const [updateQuantity, setUpdateQuantity] = useState(0)
  var items = [] as ItemModel[]
  if (!load && CartState.Carts.length > 0) {
    getItemAPI(CartState.Carts[0].itemId)
    setLoad(true)
  }
  var totalPrice = 0

  const getUserName = (itemId: number) => {
    let item = itemState.items.find((item) => item.id === itemId)
    return item?.owner.name
  }

  const getInfo = (itemId: number) => {
    let item = itemState.items.find((item) => item.id === itemId)
    if (item) {
      items.push(item)
    }
  }
  const getBuyQuantity = (itemId: number) => {
    let item = CartState.Carts.find((element) => element.itemId === itemId)
    if (item) {
      return item.quantity
    } else {
      return 0
    }
  }

  const calculatePrice = (price: number | undefined, quantity: number) => {
    if (!price) {
      price = 0
    }
    let result = price * quantity
    totalPrice += result
    return result
  }

  const checkItem = (item: ItemModel, checked: boolean) => {
    let items = checkedItems
    if (item && checked) {
      items.push(item)
      setCheckedItems(items)
      setCheckedCount(checkedCount + 1)
    } else if (item && !checked) {
      items.splice(checkedItems.indexOf(item), 1)
      setCheckedItems(items)
      setCheckedCount(checkedCount - 1)
    }
  }

  const openUpdateModal = (id: number, quantity: number) => {
    let item = itemState.items.find((item) => item.id === id)
    if (item) {
      setUpdateItemId(id)
      setUpdateQuantity(quantity)
      new Modal('#updateModal').show()
    }
  }

  const deleteItem = async (item: ItemModel) => {
    await dispatch(actions.deleteCartItem(item.id))
    toast.success(`已從購物車刪除商品：${item.name}`)
  }

  const modifyItem = async () => {
    const item = await getItemAPI(updateItemId)
    if ('id' in item) {
      if (item.quantity >= updateQuantity) {
        dispatch(actions.updateCartItem(updateItemId, updateQuantity))
        toast.success(
          <span>
            已修改商品：{item.name}
            <br />
            下訂數量為{updateQuantity}個
          </span>
        )
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
      {CartState.Carts.map((item) => getInfo(item.itemId))}
      <div className='col-12'>
        <div className='card card-flush py-4'>
          <div className='card-header'>
            <div className='card-title'>
              <h2>勾選下訂商品</h2>
            </div>
          </div>
          <div className='card-body pt-0 pb-1'>
            <div className='d-flex flex-column gap-10'>
              <div>
                <label className='form-label'>將商品加入至此筆訂單</label>
                {/* <!--begin::Selected products--> */}
                <div
                  className='d-flex flex-wrap gap-4 border border-dashed rounded p-6 mb-5'
                  id='edit_order_selected_products'
                >
                  {checkedCount === 0 ? (
                    <span className='text-muted'>已勾選之商品會顯示在此處</span>
                  ) : (
                    checkedItems.map((item) => (
                      <div className='d-flex align-items-center border border-dashed rounded p-3 bg-white'>
                        <img
                          className='symbol symbol-50px '
                          src={
                            item.images[0]
                              ? item.images[0].photo
                              : '/media/icons/duotune/ecommerce/ecm005.svg'
                          }
                          alt=''
                          height='auto'
                          width='50px'
                          background-position='center'
                        ></img>

                        <div className='ms-5'>
                          <span className='text-gray-800 fs-5 fw-bolder'>{item.name}</span>
                          <div className='d-flex flex-wrap gap-3'>
                            <div className='text-muted fs-7'>{item.owner.name}</div>
                            <div className='fw-bold fs-7'>
                              Price: $
                              <span data-kt-ecommerce-edit-order-filter='price'>{item.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* <!--begin::Selected products--> */}
                <div className='fw-bolder fs-4'>
                  訂單總金額:　$<span id='edit_order_total_price'>{totalPrice}</span>
                </div>
              </div>
              {/* <!--end::Input group--> */}
              {/* <!--begin::Separator--> */}
              <div className='separator'></div>
              {/* <!--end::Separator--> */}
              {/* <!--begin::Search products--> */}
              <div className='d-flex align-items-center position-relative mb-n7'>
                {/* <!--begin::Svg Icon | path: icons/duotune/general/gen021.svg--> */}
                <span className='svg-icon svg-icon-1 position-absolute ms-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <rect
                      opacity='0.5'
                      x='17.0365'
                      y='15.1223'
                      width='8.15546'
                      height='2'
                      rx='1'
                      transform='rotate(45 17.0365 15.1223)'
                      fill='black'
                    />
                    <path
                      d='M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z'
                      fill='black'
                    />
                  </svg>
                </span>
                {/* <!--end::Svg Icon--> */}
                <input
                  type='text'
                  data-kt-ecommerce-edit-order-filter='search'
                  className='form-control form-control-solid w-100 ps-14'
                  placeholder='Search Products'
                />
              </div>
              {/* <!--end::Search products--> */}
              {/* <!--begin::Table--> */}
              <div className='dataTables_wrapper dt-bootstrap4 no-footer'>
                <div className='table-responsive'>
                  <div className='dataTables_scroll'>
                    <div
                      className='dataTables_scrollBody'
                      style={{
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: '400px',
                        width: '100%',
                      }}
                    >
                      <table
                        className='table align-middle table-row-dashed fs-6 gy-5'
                        id='edit_order_product_table'
                      >
                        {/* <!--begin::Table head--> */}
                        <thead
                          style={{
                            position: 'sticky',
                            backgroundColor: 'white',
                            zIndex: '1',
                            top: '0',
                            boxShadow: 'inset 1px 1px #ffffff, 0 1px #000000',
                          }}
                        >
                          <tr className='text-start text-gray-400 fw-bolder fs-7 gs-0'>
                            <th className='w-25px pe-2'></th>
                            <th className=''>產品資訊</th>
                            <th className='min-w-70px text-center'>購買數量</th>
                            <th className='min-w-70px text-center'>剩餘數量</th>
                            <th className='min-w-150px text-center'>操作</th>
                          </tr>
                        </thead>
                        {/* <!--end::Table head--> */}
                        {/* <!--begin::Table body--> */}
                        <tbody className='fw-bold text-gray-600'>
                          {items.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                  <input
                                    className='form-check-input'
                                    type='checkbox'
                                    value='1'
                                    onChange={(e) => checkItem(item, e.target.checked)}
                                  />
                                </div>
                              </td>
                              {/* <!--begin::Product=--> */}
                              <td>
                                <div
                                  className='d-flex align-items-center'
                                  data-kt-ecommerce-edit-order-filter='product'
                                  data-kt-ecommerce-edit-order-id={item.id}
                                >
                                  {/* <!--begin::Thumbnail--> */}
                                  <img
                                    className='symbol symbol-50px '
                                    src={
                                      item.images[0]
                                        ? item.images[0].photo
                                        : '/media/icons/duotune/ecommerce/ecm005.svg'
                                    }
                                    alt=''
                                    height='auto'
                                    width='50px'
                                    background-position='center'
                                  ></img>
                                  {/* <!--end::Thumbnail--> */}
                                  <div className='ms-5'>
                                    {/* <!--begin::Title--> */}
                                    <span className='text-gray-800 fs-5 fw-bolder'>
                                      {item.name}
                                    </span>
                                    {/* <!--end::Title--> */}
                                    <div className='d-flex flex-wrap gap-3'>
                                      {/* <!--begin::SKU--> */}
                                      <div className='text-muted fs-7'>{item.owner.name}</div>
                                      {/* <!--end::SKU--> */}
                                      {/* <!--begin::Price--> */}
                                      <div className='fw-bold fs-7'>
                                        Price: $
                                        <span data-kt-ecommerce-edit-order-filter='price'>
                                          {item.price}
                                        </span>
                                      </div>
                                      {/* <!--end::Price--> */}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              {/* <!--end::Product=--> */}
                              <td className='text-center' data-order='19'>
                                <span className='fw-bolder '>{getBuyQuantity(item.id)}</span>
                              </td>
                              <td className='text-center' data-order='19'>
                                <span className='fw-bolder '>{item.quantity}</span>
                              </td>
                              <td className='text-center'>
                                <button
                                  className='btn btn-primary btn-sm mx-2'
                                  onClick={() => openUpdateModal(item.id, getBuyQuantity(item.id))}
                                >
                                  <i className='bi bi-pencil-square fs-5'></i>修改數量
                                </button>
                                <button
                                  className='btn btn-danger btn-sm mx-2'
                                  onClick={() => deleteItem(item)}
                                >
                                  <i className='bi bi-trash-fill fs-5'></i>刪除
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        {/* <!--end::Table body--> */}
                      </table>
                      {/* <!--end::Table--> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!--end::Card header--> */}
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
    </>
  )
}

export default ShoppingCartPage
