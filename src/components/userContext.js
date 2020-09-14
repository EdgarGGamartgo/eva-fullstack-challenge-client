import React from 'react'

/**
 * User context module is responsible for sharind data
 * among Login and Info components.
 * 
 */
const UserContext = React.createContext()

const UserProvider = UserContext.Provider
const UserConsumer = UserContext.Consumer

export { UserProvider, UserConsumer}