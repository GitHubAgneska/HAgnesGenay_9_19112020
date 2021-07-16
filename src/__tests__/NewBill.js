import {screen, fireEvent} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/react';
const $ = require('jquery');

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import Firestore from "../app/Firestore"

import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills"
import {bills} from "../fixtures/bills.js"
import VerticalLayout from "../views/VerticalLayout"
import {ROUTES, ROUTES_PATH} from "../constants/routes"
import Dashboard, {filteredBills, cards} from "../containers/Dashboard.js"
import DashboardUI from "../views/DashboardUI.js"


describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test("Then post should fail if required fields are not filled out", () => {
            const html = NewBillUI()
            document.body.innerHTML = html

            // connected as an employee
            Object.defineProperty(window, 'localStorage', {value: localStorageMock})
            window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({pathname})
            }
            const newbill = new NewBill({document, onNavigate, firestore: null, localStorage: window.localStorage})

            const formNewBill = screen.getByTestId('form-new-bill')
            const handleSubmit = jest.fn(newbill.handleSubmit)
            formNewBill.addEventListener('submit', handleSubmit)
            fireEvent.submit(formNewBill)

            const createBill = jest.fn(newbill.createBill)
            fireEvent.createBill()

            expect(handleSubmit).toHaveBeenCalled();
            expect(createBill).not.toHaveBeenCalled();


        })
    })
})

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page and click on browse btn", () => {
        test("Then I should be able to select a file", () => {
            const html = NewBillUI()
            document.body.innerHTML = html
            const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) }
            let firestoreMock = {
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                set: jest.fn().mockResolvedValueOnce(),
                get: jest.fn().mockReturnThis(),
            };
            
            window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
            // localStorage should be populated with input file
            Object.defineProperty(window, "localStorage", {
                value: {
                    getItem: jest.fn(() => null),
                    setItem: jest.fn(() => null)
                },
                writable: true
            })

            const newbill = new NewBill({document, onNavigate, firestore:firestoreMock, localStorage: window.localStorage})
            
            //const getSpy = jest.spyOn(firebase, "get")
            const fileMock = 'abcdef890.png'
            const filePath = fileMock.split(/\\/g)
            const fileName = filePath[filePath.length - 1]
            // const ref = jest.fn()
            //const ref = jest.fn(() => ({doc}))
            // const firebase = jest.fn()
            // jest.spyOn(firebase, 'firestore').mockImplementationOnce(() => firestoreMock);

            const fileInput = screen.getByTestId('file')
            const handleChangeFile = jest.fn((e) => newbill.handleChangeFile(e, fileMock))
            fileInput.addEventListener('change', handleChangeFile)
            // fireEvent.change(fileInput, { target: { value: fileMock } })
            fireEvent.change(fileInput, { target: { files: [new File( [fileMock], fileMock)]} })
            // fireEvent.click(fileInput)
            //expect(fileInput.value).toBe(fileMock)
            expect(handleChangeFile).toHaveBeenCalled()
            // expect(localStorageMock).toHaveBeenCalled()
            
            
            //expect(firestoreMock.collection).toHaveBeenCalled()
            //expect(firestoreMock.collection).toHaveBeenCalledWith(`justificatifs/${fileName}`);
            //expect(window.localStorage.setItem).toHaveBeenCalledWith(ref, JSON.stringify({path: filePath}))

            //expect(ref).toBe(`justificatifs/${fileName}`)
            //expect(window.localStorage.setItem).toHaveBeenCalled()
            ///expect(window.localStorage.setItem).toHaveBeenCalledWith(ref,filePath)
        })
    })
})

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page, have made a new bill and submit it", () => {
        test("Then it should be created", () => {
            const html = NewBillUI()
            document.body.innerHTML = html
            const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) }
            let firestoreMock = {
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                set: jest.fn().mockResolvedValueOnce(),
                get: jest.fn().mockReturnThis(),
            };
            
            window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
            // localStorage should be populated with new bill
            Object.defineProperty(window, "localStorage", {
                value: {
                    getItem: jest.fn(() => null),
                    setItem: jest.fn(() => null)
                },
                writable: true
            })

            const newbill = new NewBill({document, onNavigate, firestore:firestoreMock, localStorage: window.localStorage})
            const createBill = jest.fn(newbill.createBill)
            const submitBtn = screen.getByTestId('submit-btn')
            submitBtn.addEventListener('submit', createBill)
            const formNewBill = screen.getByTestId('form-new-bill')
            fireEvent.submit(formNewBill)
            const getSpy = jest.spyOn(firebase, "add")
            expect(getSpy).toHaveBeenCalledTimes(1)

            
        })
    })
})