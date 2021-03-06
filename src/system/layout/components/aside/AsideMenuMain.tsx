/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {AsideMenuItem} from './AsideMenuItem'
import {CategoryState} from '../../../../app/modules/category/redux/CategoryRedux'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {IAuthState} from '../../../../app/modules/auth/redux/AuthRedux'

export function AsideMenuMain() {
  const authState: IAuthState = useSelector<RootState>(({auth}) => auth, shallowEqual) as IAuthState
  const user = authState.auth?.user
  const isAdmin = (user?.role || 0) >= 1
  const categoryState: CategoryState = useSelector<RootState>(
    ({category}) => category,
    shallowEqual
  ) as CategoryState
  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={'首頁'}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to={`/chat`}
        icon='/media/icons/duotune/communication/com007.svg'
        title={'聊天室'}
        fontIcon='bi-app-indicator'
      />
      {isAdmin && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>系統管理</span>
            </div>
          </div>
          <AsideMenuItem
            to={`/admin/categories`}
            icon='/media/icons/duotune/files/fil012.svg'
            title={'管理分類'}
            fontIcon='bi-app-indicator'
          />
          <AsideMenuItem
            to={`/admin/users`}
            icon='/media/icons/duotune/communication/com005.svg'
            title={'管理會員'}
            fontIcon='bi-app-indicator'
          />
          <AsideMenuItem
            to={`/admin/tags`}
            icon='/media/icons/duotune/communication/com009.svg'
            title={'管理標籤'}
            fontIcon='bi-app-indicator'
          />
          <AsideMenuItem
            to={`/admin/reports`}
            icon='/media/icons/duotune/general/gen007.svg'
            title={'管理舉報'}
            fontIcon='bi-app-indicator'
          />
        </>
      )}
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>分類</span>
        </div>
      </div>
      {categoryState.categories.map((category, i) => {
        if (category.is_department) {
          return (
            <AsideMenuItem
              key={`category-${category.id}`}
              to={`/category/${category.id}`}
              icon='/media/icons/duotune/coding/cod009.svg'
              title={category.name}
              fontIcon='bi-app-indicator'
            />
          )
        }
        return <span key={i}></span>
      })}
    </>
  )
}
