import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import  Login  from "./../src/components/login.component"

it("renders correctly", () => {
    const {queryByTestId} = render(<Login/>)

    expect(queryByTestId("email-input")).toBeTruthy()
    expect(queryByTestId("pass-input")).toBeTruthy()
    expect(queryByTestId("search-button")).toBeTruthy()
})



describe("Input value", () => {
    it("updates on change", () => {
        const {queryByTestId} = render(<Login/>)

        const emailInput = queryByTestId("email-input")
        const passInput = queryByTestId("pass-input")

        fireEvent.change(emailInput, {target: {value: "test"}})
        fireEvent.change(passInput, {target: {value: "test"}})

        expect(emailInput.value).toBe("test")
        expect(passInput.value).toBe("test")

    })
})


describe("Login button", () => {
    describe("with data inside query", () => {
        it("triggers login function", () => {
            const {queryByTestId} = render(<Login/>)
            const emailInput = queryByTestId("email-input")
            const passInput = queryByTestId("pass-input")
            fireEvent.change(emailInput, {target: {value: "test"}})
            fireEvent.change(passInput, {target: {value: "test"}})
            fireEvent.submit(queryByTestId('form'))
        })
    })
})

