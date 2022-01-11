import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { contractAddress, contractAbi } from '../utils/const'

export const TransactionContext = React.createContext()
const { ethereum } = window

const getEthereumContract = () => {
  const provider = new ethers.provider.Web3Provider(ethereum)
  const singer = provider.getSinger()
  const transactionContract = new ethers.Contract(contractAddress, contractAbi, singer)
  console.log({ provider, singer, transactionContract })
}


export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState()
  useEffect(() => {
    checkIfWalletConnect()
  }, [])
  const checkIfWalletConnect = async () => {
    if (!ethereum) return alert('please install metamask!')
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log(accounts)
      if (accounts.length) {
        setCurrentAccount(accounts[0])
        // getAllTransactions
      } else {
        console.log('no accounts')
      }
    } catch (e) {
      console.log(e)
    }

  }
  const connectWallet = async () => {
    if (!ethereum) return alert('please install metamask!')
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <TransactionContext.Provider value={{connectWallet,currentAccount}}>
      {children}
    </TransactionContext.Provider>
  )
}