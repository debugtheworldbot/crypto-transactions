import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { contractAddress, contractAbi } from '../utils/const'

export const TransactionContext = React.createContext()
const { ethereum } = window

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const singer = provider.getSigner()
  const transactionContract = new ethers.Contract(contractAddress, contractAbi, singer)
  return transactionContract
}


export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState()
  const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount') || 0)

  useEffect(() => {
    checkIfWalletConnect()
  }, [])

  const handleChange = (e, name) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }))
  }

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
  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert('please install metamask!')
      const { addressTo, amount, keyword, message } = formData
      const transactionContract = getEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)._hex

      await ethereum.request({
        method: 'eth_sendTransaction', params: [{
          from: currentAccount,
          to: addressTo,
          value: parsedAmount,
          gas: '0x5208'
        }]
      })

      const transactionId = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)
      console.log('loading:', transactionId)
      setIsLoading(true)
      await transactionId.wait()
      setIsLoading(false)
      console.log('success:', transactionId)

      const transactionCount = await transactionContract.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())
      localStorage.setItem('transactionCount', transactionCount.toNumber())
      console.log(transactionCount)

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
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, sendTransaction }}>
      {children}
    </TransactionContext.Provider>
  )
}