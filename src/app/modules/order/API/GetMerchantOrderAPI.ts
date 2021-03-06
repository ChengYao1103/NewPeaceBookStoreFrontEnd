import axios from 'axios'
import * as OrderRedux from '../redux/OrderRedux'
import {ErrorResponse, NetworkErrorResponse} from '../../errors/ErrorDataTypes'
import {dispatch} from '../../../../setup/redux/Store'
import {OrderItemModel, OrderModel} from '../redux/OrderModel'

export type Response = {
  status: number
  order: OrderModel
  items: OrderItemModel[]
}

export const API_URL = (orderId: number) =>
  `${import.meta.env.VITE_API_URL}/auth/merchant/order/${orderId}`

// 取得商店單筆訂單詳細資訊
export default async function getMerchantOrderAPI(
  orderId: number
): Promise<OrderModel | ErrorResponse> {
  try {
    const {data} = await axios.get<Response>(API_URL(orderId))
    dispatch(OrderRedux.actions.updateOrders([data.order]))
    return data.order
  } catch (err: any) {
    console.log(err)
    return (err.response?.data as ErrorResponse) || NetworkErrorResponse
  }
}
