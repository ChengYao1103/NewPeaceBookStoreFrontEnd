/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'
import {useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {KTSVG, toAbsoluteUrl} from '../../../../system/helpers'
import {Dropdown1} from '../../../../system/partials'
import getUserAPI from '../../auth/API/GetUserAPI'
import {IAuthState} from '../../auth/redux/AuthRedux'
import {ChatState} from '../redux/ChatRedux'

const Group: FC = () => {
  const userState: IAuthState = useSelector((state: RootState) => state.auth)
  const chatState: ChatState = useSelector((state: RootState) => state.chat)

  const getUser = (userId: number) => {
    const user = userState.users.find((u) => u.id === userId)
    if (!user) {
      getUserAPI(userId)
    }
    return user
  }

  return (
    <div className='d-flex flex-column flex-lg-row'>
      <div className='flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0'>
        <div className='card card-flush'>
          <div className='card-header pt-7' id='kt_chat_contacts_header'>
            <form className='w-100 position-relative' autoComplete='off'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute top-50 ms-5 translate-middle-y'
              />

              <input
                type='text'
                className='form-control form-control-solid px-15'
                name='search'
                placeholder='Search by username or email...'
              />
            </form>
          </div>

          <div className='card-body pt-5' id='kt_chat_contacts_body'>
            <div
              className='scroll-y me-n5 pe-5 h-200px h-lg-auto'
              data-kt-scroll='true'
              data-kt-scroll-activate='{default: false, lg: true}'
              data-kt-scroll-max-height='auto'
              data-kt-scroll-dependencies='#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header'
              data-kt-scroll-wrappers='#kt_content, #kt_chat_contacts_body'
              data-kt-scroll-offset='0px'
            >
              {chatState.chats.map((chat) => {
                const user = getUser(chat.userId)
                if (user) {
                  return (
                    <>
                      <div className='d-flex flex-stack py-4'>
                        <div className='d-flex align-items-center'>
                          <div className='symbol symbol-45px symbol-circle'>
                            <span className='symbol-label bg-light-danger text-danger fs-6 fw-bolder'>
                              E
                            </span>
                            <div className='symbol-badge bg-success start-100 top-100 border-4 h-15px w-15px ms-n2 mt-n2'></div>
                          </div>

                          <div className='ms-5'>
                            <a
                              href='#'
                              className='fs-5 fw-bolder text-gray-900 text-hover-primary mb-2'
                            >
                              Emma Bold
                            </a>
                            <div className='fw-bold text-gray-400'>emma@intenso.com</div>
                          </div>
                        </div>

                        <div className='d-flex flex-column align-items-end ms-2'>
                          <span className='text-muted fs-7 mb-1'>1 day</span>
                        </div>
                      </div>
                      <div className='separator separator-dashed d-none'></div>
                    </>
                  )
                }
              })}
            </div>
          </div>
        </div>
      </div>

      <div className='flex-lg-row-fluid ms-lg-7 ms-xl-10'>
        <div className='card' id='kt_chat_messenger'>
          <div className='card-header' id='kt_chat_messenger_header'>
            <div className='card-title'>
              <div className='symbol-group symbol-hover'>
                <div className='symbol symbol-35px symbol-circle'>
                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/150-4.jpg')} />
                </div>
                <div className='symbol symbol-35px symbol-circle'>
                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/150-15.jpg')} />
                </div>
                <div className='symbol symbol-35px symbol-circle'>
                  <span className='symbol-label bg-light-warning text-warning 40px'>M</span>
                </div>
                <div className='symbol symbol-35px symbol-circle'>
                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/150-8.jpg')} />
                </div>
                <div className='symbol symbol-35px symbol-circle'>
                  <span className='symbol-label bg-light-danger text-danger 40px'>O</span>
                </div>
                <div className='symbol symbol-35px symbol-circle'>
                  <span className='symbol-label bg-light-primary text-primary 40px'>N</span>
                </div>
                <div className='symbol symbol-35px symbol-circle'>
                  <img alt='Pic' src={toAbsoluteUrl('/media/avatars/150-6.jpg')} />
                </div>
                <a
                  href='#'
                  className='symbol symbol-35px symbol-circle'
                  // data-bs-toggle='modal'
                  // data-bs-target='#kt_modal_view_users'
                >
                  <span
                    className='symbol-label fs-8 fw-bolder'
                    data-bs-toggle='tooltip'
                    data-bs-trigger='hover'
                    title='View more users'
                  >
                    +42
                  </span>
                </a>
              </div>
            </div>

            <div className='card-toolbar'>
              <div className='me-n3'>
                <button
                  className='btn btn-sm btn-icon btn-active-light-primary'
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-end'
                  data-kt-menu-flip='top-end'
                >
                  <i className='bi bi-three-dots fs-2'></i>
                </button>
                <Dropdown1 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {Group}
