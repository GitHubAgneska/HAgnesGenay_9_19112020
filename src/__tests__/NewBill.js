import {screen, fireEvent} from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/react';
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import Bills from "../containers/Bills"
import {bills} from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes"



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
            const formNewBill = screen.getByTestId('form-new-bill')            
            const newbill = new NewBill({document, onNavigate, firestore: null, localStorage: window.localStorage})
            const emptyBillMock = {}
            const handleSubmit = jest.fn(newbill.handleSubmit)
            const createBill = jest.fn(emptyBillMock)
    
            formNewBill.addEventListener('submit', handleSubmit)
            fireEvent.submit(formNewBill)
            
            expect(handleSubmit).toHaveBeenCalled();    
            expect(createBill).not.toHaveBeenCalled();
        })
    })
})

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page and click on browse btn", () => {
        test("Then I should be able to select a file and see its name once selected", () => {
            const html = NewBillUI()
            document.body.innerHTML = html
            const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) } 
            
            const newbill = new NewBill({document, onNavigate, firestore: null, localStorage: window.localStorage})
            const fileInput = screen.getByTestId('file')
            const handleChangeFile = jest.fn(newbill.handleChangeFile)
            fileInput.addEventListener('change', handleChangeFile)
            const fileMock = 'abcdef890.png'
            fireEvent.change(fileInput, { target: { files: [new File( [fileMock], fileMock)]} })

            expect(handleChangeFile).toHaveBeenCalled()
            expect(fileInput.files[0].name).toBe(fileMock)
        })
    })
})

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page, have made a new bill and submit it", () => {
        test("Then it should be created", () => {
            const html = NewBillUI()
            document.body.innerHTML = html
            const onNavigate = (pathname) => { document.body.innerHTML = ROUTES({pathname}) }
            window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
            
            const firestoreStorage = firebase // => is a mock
            const newbill = new NewBill({document, onNavigate, firestore:firestoreStorage, localStorage: window.localStorage})
            
            const fakeNewBill = {
                
                email : bills[0].email,
                type:  bills[0].type,
                name:   bills[0].name,
                amount:  bills[0].amount,
                date:  bills[0].date,
                vat:  bills[0].vat,
                pct: bills[0].pct,
                commentary: bills[0].commentary,
                fileUrl:  bills[0].fileUrl,
                fileName:  bills[0].fileName,
                status:  bills[0].status
                
            }
            /* // localStorage should be populated with new bill
            Object.defineProperty(window, "localStorage", {
                value: {
                    getItem: jest.fn(() => null),
                    setItem: jest.fn(() => fakeNewBill)
                },
                writable: true
            })
 */
            const submitBtn = screen.getByTestId('submit-btn')
            const handleSubmit = jest.fn(newbill.handleSubmit)
            
            submitBtn.addEventListener('submit', handleSubmit)
            
            fireEvent.submit(fakeNewBill)
            expect(handleSubmit).toHaveBeenCalled()
            
        })
    })
})