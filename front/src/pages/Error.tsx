import React from 'react'
import Header from '../components/Header'
import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error: any = useRouteError();

  return (
    <>
    <Header/>
    <div style={{ color: 'red', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <h1>Что-то пошло не так....</h1>
      <div>status: {error.status?.toString()}</div>
      <div>statusText: {error.statusText?.toString()}</div>
      <div>data: {error.data?.toString()}</div>
      
    </div>
    </>
  )
}
